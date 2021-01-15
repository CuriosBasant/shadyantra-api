export { default as Piece, PieceType, NullPiece } from './Piece';
export { default as OfficerPiece, Ashvarohi, Gajarohi, Maharathi, Senapati } from './Officers';
export { default as RoyalPiece, Arthshastri, Guptchar, Rajendra, Indra, Rajendraw } from './Royals';
export { default as Rajrishi } from './Rajrishi';
export { default as Pyada } from './Pyada';
// export { default as Rajendra } from './royals/Rajendra';

export type PieceSymbol = 'I' | 'J' | 'A' | 'R' | 'C' | 'S' | 'H' | 'G' | 'M' | 'P';
export type PieceNotation = Lowercase<PieceSymbol> | PieceSymbol;
