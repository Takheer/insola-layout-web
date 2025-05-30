import type {TPiecesLayout} from "@/services/alignPieces";
import Konva from "konva";

export const useDrawPiecesOnSheet = (sheetHeight: number) => {
  const ZOOM_THRESHOLD = 200
  function getPieceDrawings(piece: TPiecesLayout): Konva.Shape[] {
    const textBaseSize = 16 * 0.002 * sheetHeight
    const textRotated = piece.h > piece.w && (piece.originalWidth ?? 0) < ZOOM_THRESHOLD
    const textSize = Math.min((textRotated ? piece.h : piece.w) / ZOOM_THRESHOLD, 1) * textBaseSize
    return [
      new Konva.Rect({
        x: piece.x,
        y: piece.y,
        width: piece.w,
        height: piece.h,
        fill: '#89b717',
        opacity: 0.8,
      }),
      new Konva.Text({
        x: piece.x,
        y: piece.y + piece.h - textSize,
        text: `${piece.originalWidth || piece.w}`,
        fontSize: textSize,
        fontFamily: 'Roboto',
        fill: '#222222'
      }).move({x: piece.w / 2 - textSize, y: 0}),
      new Konva.Text({
        x: piece.x,
        y: piece.y + piece.h - textSize,
        text: `${piece.originalHeight || piece.h}`,
        fontSize: textSize,
        fontFamily: 'Roboto',
        fill: '#222222'
      }).rotate(-90).move({x: 2, y: 0})
    ]
  }

  function getSheetDrawings(sheet: TPiecesLayout): Konva.Shape[] {
    return [new Konva.Rect({
      x: sheet.x,
      y: sheet.y,
      width: sheet.w,
      height: sheet.h,
      fill: '#6db8c9',
      opacity: 0.6
    })]
  }

  return {getPieceDrawings, getSheetDrawings}
}
