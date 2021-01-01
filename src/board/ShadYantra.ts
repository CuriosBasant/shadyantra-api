import { EventEmitter } from 'events';
import path from 'path';
import { performance } from 'perf_hooks';
import requireAll from 'require-all';
import { Board, Builder, History, SquareName, SQUARE_FLAGS } from '.';
import { Piece, PieceSymbol } from '../pieces';
import { Alliance } from '../player';
import { BOARD_SIZE, DEFAULT_FEN, EVENT, TOTAL_SQUARES } from '../Utils';


interface ChessOption {
  isWhiteTurn?: boolean;
}

type MoveString = `${ SquareName }${ SquareName }`;
type MoveObject = {
  from: SquareName | number,
  to: SquareName | number;
};

export default class ShadYantra extends EventEmitter {
  board!: Board;
  history = new History();
  isWhiteTurn: boolean;

  constructor(
    fen = DEFAULT_FEN, {
      isWhiteTurn = true,
    }: ChessOption = {}
  ) {
    super();
    this.isWhiteTurn = isWhiteTurn;
    this.registerEvents(path.join(__dirname, '../events'));
    this.loadFEN(fen);
  }

  move(squareRef: MoveString | MoveObject) {
    let f: SquareName, t: SquareName;
    if (typeof squareRef == 'string') {
      f = squareRef.slice(0, 2) as SquareName;
      t = squareRef.slice(2) as SquareName;
    } else {
      const resolve = (v: SquareName | number): SquareName => typeof v == 'number' ? SQUARE_FLAGS[v] as SquareName : v;
      f = resolve(squareRef.from);
      t = resolve(squareRef.to);
    }
    const currentSquare = this.board.getSquareWithName(f), destinationSquare = this.board.getSquareWithName(t);
    if (!currentSquare || !destinationSquare) {
      throw new Error("Invalid Square Provided!");
    }
    if (currentSquare.isEmpty) throw new Error("No piece to move from there.");

    const currentLegalMoves = this.board.activePlayer.legalMoves;
    const validMoves = currentLegalMoves.filter(move => move.destinationSquare == destinationSquare && move.movedPiece == currentSquare.piece);
    if (validMoves.length == 0) {
      console.error('Invalid move');
      return;
    } else if (validMoves.length > 1) {
      console.error('More than such move exists');
      return;
    }
    this.board = validMoves[0].execute();
    this.emit(EVENT.MOVE, validMoves[0]);
  }

  private validateFEN(fen: string) {
    return true;
  }
  generateFEN() {
    let ctr = -1;
    const join = (ch: string) => ctr == -1 ? ch : [ctr + ch, ctr = -1][0];
    return this.board.builder.config.reduce((str, piece, i) => {
      if (!piece) {
        ctr++;
      } else {
        str += join(piece.notation);
      }
      if (!((i + 1) % BOARD_SIZE)) {
        str += join('/');
      }
      return str;
    }, '');
  }
  select(squareName: string) {
    const square = this.board.getSquareWithName(squareName as SquareName);
    if (!square) throw new Error("That square doesnot exist");
    if (square.isEmpty) throw new Error("No piece on that square!");
    const validMoves = this.board.activePlayer.legalMoves.filter(move => move.movedPiece == square.piece);

    return validMoves.map(move => move.destinationSquare.name);
  }
  removePieceFrom(square: SquareName) {
    return true;
  }
  putPieceOn(square: SquareName, notation: PieceSymbol) {

  }

  registerEvents(dirname: string) {
    const files = requireAll({ dirname, resolve: file => file.default, filter: /^([^\.].*)\.(j|t)s(on)?$/ });

    for (const [eventName, funToRun] of Object.entries<Function | undefined>(files)) {
      if (!funToRun) continue;
      this.on(eventName, funToRun.bind(this));
    }
  }

  loadFEN(fen: string) {
    if (!this.validateFEN(fen)) throw new Error("Invalid FEN");

    const builder = new Builder();
    let sqrIndex = 0;
    for (const ch of fen) {
      if (ch == '/') continue;
      if (ch.isNumber()) {
        sqrIndex += +ch;
      } else {
        const PieceClass = Piece.getPieceBySymbol(ch.toUpperCase() as PieceSymbol);
        const alliance = ch.isUpperCase() ? Alliance.WHITE : Alliance.BLACK;
        builder.setPiece(new PieceClass(sqrIndex, alliance));
        // console.log(sqrIndex, ch);
      }
      sqrIndex++;
    }
    this.board = builder.build();
  }
}


class Square2 {
  piece: Piece | null;
  constructor(piece: Piece | null) {
    this.piece = piece;
  }
  
  get isEmpty() {
    return this.piece === null;
  }
}

const square = new Square2(null);
if (!square.isEmpty) {
  // Error: Object is possibly 'null'.
  // square.piece.alliance;
}