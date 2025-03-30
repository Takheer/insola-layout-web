import { type TPiecesLayout } from "@/services/alignPieces";
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import {computed, nextTick, ref} from "vue";
import type {TRawSheetSettings} from "@/stores/useCuttingStore.ts";

export const usePiecesDrawing = (settings: TRawSheetSettings) => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('lg')

  const LIST_BIGGER = settings.sheetWidth - 2 * settings.padding;
  const LIST_LESSER = settings.sheetHeight - 2 * settings.padding;

  const aspectRatio = LIST_BIGGER/LIST_LESSER;
  const rawListHeightPx = () => isMobile.value ? 180 : 400;

  const canvasHeight = ref(rawListHeightPx())
  const canvasWidth = ref(rawListHeightPx() * aspectRatio);

  function getDrawablePiece(piece: TPiecesLayout): TPiecesLayout {
    const offsetY = piece.rawListNumber * (rawListHeightPx() + 24);

    return {
      ...piece,
      x: piece.x * canvasWidth.value / piece.rawListWidth,
      y: piece.y * (canvasWidth.value / aspectRatio) / piece.rawListHeight + offsetY,
      w: piece.w * canvasWidth.value / piece.rawListWidth,
      h: piece.h * (canvasWidth.value / aspectRatio) / piece.rawListHeight
    }

    // if (piece.w >= 200 && piece.h >= 60) {
    //   ctx.value.fillStyle = "rgba(0, 0, 0, 0.6)";
    //   ctx.value.fillText(`${piece.w}x${piece.h}`, piece.x * widthCoef + 2, (piece.y+piece.h) * heightCoef + offsetY - 2);
    // } else if (piece.h >= 200 && piece.w >= 60) {
    //   ctx.value.fillStyle = "rgba(0, 0, 0, 0.6)";
    //   drawTextRotated(
    //   `${piece.w}x${piece.h}`,
    //   (piece.x+piece.w) * widthCoef - 2,
    //   (piece.y+piece.h) * heightCoef + offsetY,
    //   -90
    //   )
    // }
  }

  function getDrawablePiecesAndSheets(pieces: TPiecesLayout[], sheets: TPiecesLayout[]) {
    const maxList = Math.max(...sheets.map(l => l.rawListNumber));
    canvasHeight.value = (maxList + 1) * rawListHeightPx() + 32 * maxList
    return {
      pieces: pieces.map(p => getDrawablePiece(p)),
      sheets: sheets.map(p => getDrawablePiece(p)),
    }
  }

  return { getDrawablePiecesAndSheets, canvasHeight, canvasWidth }
}
