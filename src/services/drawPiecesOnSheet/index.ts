import type {TPiecesLayout} from "@/services/alignPieces";
import Konva from "konva";

export const useDrawPiecesOnSheet = (sheetHeight: number) => {
  function getPieceDrawings(piece: TPiecesLayout): Konva.Shape[] {
    const textSize = 16 * 0.002 * sheetHeight
    const textRotated = piece.h > piece.w && piece.originalWidth < 200
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
        text: `${piece.originalWidth}x${piece.originalHeight}`,
        fontSize: textSize,
        fontFamily: 'Roboto',
        fill: '#222222'
      }).rotate(textRotated ? -90 : 0)
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
