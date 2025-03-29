import { type TPiecesLayout } from "@/services/alignPieces";
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import {computed, nextTick, ref} from "vue";


const LIST_BIGGER = 2780;
const LIST_LESSER = 2050;

export const usePiecesDrawing = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('lg')

  const aspect = LIST_BIGGER/LIST_LESSER;
  const rawListHeightPx = () => isMobile.value ? 180 : 400;

  const canvasHeight = ref(rawListHeightPx())
  const canvasWidth = computed(() => rawListHeightPx() * aspect);
  const widthCoef = canvasWidth.value/LIST_BIGGER
  const heightCoef = canvasHeight.value/LIST_LESSER

  const ctx = ref(null)
  async function drawPiece(piece: TPiecesLayout) {
    await nextTick()
    const offsetY = piece.rawListNumber * rawListHeightPx() + 32 * piece.rawListNumber;

    ctx.value.strokeStyle = 'black';
    ctx.value.fillStyle = "rgba(0, 255, 0, 0.1)";
    ctx.value.strokeRect(piece.x * widthCoef, piece.y * heightCoef + offsetY, piece.w * widthCoef, piece.h * heightCoef);
    ctx.value.fillRect(piece.x * widthCoef, piece.y * heightCoef + offsetY, piece.w * widthCoef, piece.h * heightCoef);

    if (piece.w >= 200 && piece.h >= 60) {
      ctx.value.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.value.fillText(`${piece.w}x${piece.h}`, piece.x * widthCoef + 2, (piece.y+piece.h) * heightCoef + offsetY - 2);
    } else if (piece.h >= 200 && piece.w >= 60) {
      ctx.value.fillStyle = "rgba(0, 0, 0, 0.6)";
      drawTextRotated(
      `${piece.w}x${piece.h}`,
      (piece.x+piece.w) * widthCoef - 2,
      (piece.y+piece.h) * heightCoef + offsetY,
      -90
      )
    }
  }

  function drawTextRotated(text: string, x: number, y: number, deg: number) {
    ctx.value.save();
    ctx.value.translate(x, y);
    ctx.value.rotate(deg * (Math.PI / 180) );
    ctx.value.translate(-x, -y);
    ctx.value.fillText(text, x, y);
    ctx.value.restore();
  }

  async function drawList(piece: TPiecesLayout) {
    await nextTick()
    ctx.value.strokeStyle = 'gray';
    ctx.value.fillStyle = "rgba(0, 0, 255, 0.1)";

    const offsetY = piece.rawListNumber * rawListHeightPx() + 32 * piece.rawListNumber;
    ctx.value.strokeRect(piece.x * widthCoef, piece.y * heightCoef + offsetY, piece.w * widthCoef, piece.h * heightCoef);
    ctx.value.fillRect(piece.x * widthCoef, piece.y * heightCoef + offsetY, piece.w * widthCoef, piece.h * heightCoef);
    ctx.value.beginPath();
    ctx.value.moveTo(piece.x * widthCoef, piece.y * heightCoef + offsetY);
    ctx.value.lineTo((piece.x+piece.w) * widthCoef, (piece.y+piece.h) * heightCoef + offsetY);
    ctx.value.stroke();
  }

  async function clearCanvas() {
    await nextTick()
    ctx.value.clearRect(0,0,canvasWidth.value, canvasHeight.value)
    ctx.value.strokeRect(0,0,canvasWidth.value-1, canvasHeight.value-1)
  }

  function drawPieces(pieces: TPiecesLayout[], lists: TPiecesLayout[]) {
    const maxList = Math.max(...lists.map(l => l.rawListNumber));
    canvasHeight.value = (maxList + 1) * rawListHeightPx() + 32 * maxList
    for (let piece of pieces) {
      drawPiece(piece)
    }

    for (let list of lists) {
      drawList(list)
    }
  }

  return { ctx, drawList, drawPiece, drawPieces, drawTextRotated, clearCanvas, canvasHeight, canvasWidth }
}
