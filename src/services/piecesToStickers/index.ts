import {jsPDF as JSPDF} from "jspdf";
import {getEdgeCode} from "@/services/useApi.ts";
import {type TCuttingPiece, useCuttingStore} from "@/stores/useCuttingStore.ts";
// @ts-expect-error не типизированный шрифт
import { font } from '@/assets/fonts/Roboto.js'

export const usePiecesToStickers = () => {
  const store = useCuttingStore()
  let doc = new JSPDF({
    orientation: "landscape",
    unit: "mm",
    format: [47, 25]
  });

  function piecesToStickers(pieces: TCuttingPiece[]) {
    doc = new JSPDF({
      orientation: "landscape",
      unit: "mm",
      format: [47, 25]
    });
    doc.addFileToVFS('Roboto.ttf', font);
    doc.addFont('Roboto.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto', 'normal');

    let pieceIndex = 1;
    for (const piece of pieces) {
      for (let i = 0; i < piece.count!; i++) {
        doc.addPage()
        pieceToSticker(piece, pieceIndex);
      }
      pieceIndex++;
    }
    doc.deletePage(1)

    doc.save(`${store.projectDetails.title || 'Безымянный проект'} – этикетки.pdf`);
  }

  function drawParagraph(text: string, x: number, y: number, fontSize: number = 12) {
    doc.setFontSize(fontSize);
    doc.text(text, x, y);
  }

  function drawRect(x: number, y: number, w: number, h: number, color: string = '#cccccc', style: 'S'|'F'|'FD') {
    doc.setFillColor(color)
    doc.rect(x, y, w, h, style)
  }

  function drawLinesByEdgeCode(edgeCode: number, x: number, y: number) {
    const w = 7
    doc.setLineWidth(0.5)
    switch (edgeCode) {
      case 5:
        doc.setLineDashPattern([], 0);
        doc.line(x, y, x+w, y)
        doc.setLineDashPattern([1,1], 0);
        doc.line(x, y+1, x+w, y+1)
        break;
      case 4:
        doc.setLineDashPattern([1,1], 0);
        doc.line(x, y, x+w, y)
        doc.line(x, y+1, x+w, y+1)
        break;
      case 3:
        doc.setLineDashPattern([1,1], 0);
        doc.line(x, y, x+w, y)
        break;
      case 2:
        doc.setLineDashPattern([], 0);
        doc.line(x, y, x+w, y)
        doc.line(x, y+1, x+w, y+1)
        break;
      case 1:
        doc.setLineDashPattern([], 0);
        doc.line(x, y, x+w, y)
        break;
    }
    doc.setLineDashPattern([], 0);
    doc.setLineWidth(0.2)
  }

  function pieceToSticker(piece: TCuttingPiece, index: number) {
    const y = 6
    const h = 6
    const y2 = y + h

    const x1 = 2
    const x2 = 16
    const x3 = 30

    const edgesHeight = getEdgeCode(piece.edges.height)
    const edgesWidth = getEdgeCode(piece.edges.width)

    drawRect(x1, y, x2-x1, h, "#cccccc", 'FD')
    drawRect(x2, y, x3-x2, h,"#cccccc",  'FD')
    drawRect(x3, y, x3-x2 + 1, h,"#cccccc",  'FD')
    drawParagraph('№', x1+2, y + 4, 8)
    drawParagraph("Длина", x2+2, y + 4, 8)
    drawParagraph("Ширина", x3+2, y + 4, 8)

    drawRect(x1, y2, x2-x1, 8, "#ffffff", 'S')
    drawRect(x2, y2, x3-x2, 8,"#ffffff",  'S')
    drawRect(x3, y2, x3-x2 + 1, 8,"#ffffff",  'S')
    drawParagraph(`#${index}:`, x1+2, y2 + 5)
    drawParagraph(piece.height?.toString() ?? '0', x2 + 2, y2 + 5)
    drawLinesByEdgeCode(edgesHeight, x2+2, y2 + 5.8)
    drawParagraph(piece.width?.toString() ?? '0', x3 + 2, y2 + 5)
    drawLinesByEdgeCode(edgesWidth, x3+2, y2 + 5.8)
  }

  return piecesToStickers
}
