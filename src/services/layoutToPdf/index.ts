import {jsPDF as JSPDF} from "jspdf";
// @ts-ignore
import { font } from '@/assets/fonts/Roboto.js'
import type {TOrderPdfData} from "@/services/layoutToPdf/types.ts";
import Konva from "konva";
import type {TPiecesLayout} from "@/services/alignPieces";
import {ELayoutMethod, type TCuttingPiece} from "@/stores/useCuttingStore.ts";
import {useAlignPieces} from "@/services/alignPieces";
import {getEdgeCode} from "@/services/useApi.ts";
import {useDrawPiecesOnSheet} from "@/services/drawPiecesOnSheet";

export const useLayoutToPdf = () => {
  const {alignPieces} = useAlignPieces();
  let doc = new JSPDF({
    orientation: "portrait",
    unit: "mm",
    format: 'a4'
  });

  async function layoutToPdf(order: TOrderPdfData) {

    doc = new JSPDF({
      orientation: "portrait",
      unit: "mm",
      format: 'a4'
    });
    doc.addFileToVFS('Roboto.ttf', font);
    doc.addFont('Roboto.ttf', 'Roboto', 'normal');

    doc.setFont('Roboto', 'normal');

    drawParagraph(`Заказ: ${order.title}`, 10, 12)
    doc.line(10, 13, 200, 13)

    drawParagraph(`Материал: ${order.materialName}`, 10, 20)
    doc.line(10, 21, 200, 21)

    drawParagraph(`Заказчик: ${order.client ?? ''}`, 10, 28)
    drawParagraph(`Дата готовности:`, 100, 28)
    doc.line(10, 29, 200, 29);

    drawRect(10, 33, 190, 8, "#cccccc", 'FD')
    drawHeader("Результаты", 93, 38.5)

    const leftCol = [
      {k: 'Количество листов', v: order.result.sheetsCount.toString()},
      {k: 'Количество деталей', v: order.details.count.toString()},
      {k: 'Длина реза', v: order.result.cuttingLength.toString()},
      {k: 'Длина пазов', v: order.result.slotsLength.toString()},
      {k: 'Длина кромки 2 мм', v: order.result.edgeThickLength.toString()},
      {k: 'Длина кромки 0.8 мм', v: order.result.edgeThinLength.toString()},
    ]

    for (let i = 0; i < 6; i++) {
      drawTableUnit(10, 41+i*8, leftCol[i].k, leftCol[i].v)
    }

    // Правый ряд со справочной хуйнёй
    const rightCol = [
      {k: 'Размер листа', v: `${order.sheet.width}x${order.sheet.height}`},
      {k: 'Толщина листа', v: `${order.sheet.thickness}`},
      {k: 'Площадь листа', v: `${order.sheet.area}`},
      {k: 'Площадь листов', v: `${order.result.sheetsTotalArea}`},
      {k: 'Площадь обрезков', v: `${order.result.residuesTotalArea}`},
      {k: 'Площадь отходов', v: `${order.result.junkTotalValue}`},
    ]

    for (let i = 0; i < 6; i++) {
      drawTableUnit(105, 41+i*8, rightCol[i].k, rightCol[i].v)
    }

    drawRect(10, 98, 190, 8, "#cccccc", 'FD')
    drawHeader("Кромки", 93, 103.5)
    drawTableUnit(10, 106, `Тип 1 — ${order.edges.edgeThickWidth} мм`, '')
    drawHorizontalLine(69, 110, 32, 1)
    drawTableUnit(105, 106, `Тип 2 — ${order.edges.edgeThinWidth} мм`, '')
    drawHorizontalLine(164, 110, 32, 1, true, 3)

    const {pieces, lists: sheets} = alignPieces(order.pieces, order.layoutMethod === ELayoutMethod.VERTICAL);

    const piecesByRawList: Record<string, TPiecesLayout[]> = {}
    const sheetsByRawList: Record<string, TPiecesLayout[]> = {}
    for (let piece of pieces) {
      if (Object.keys(piecesByRawList).includes(String(piece.rawListNumber))) {
        piecesByRawList[String(piece.rawListNumber)].push(piece);
      } else {
        piecesByRawList[String(piece.rawListNumber)] = [piece]
      }
    }

    for (let sheet of sheets) {
      if (Object.keys(sheetsByRawList).includes(String(sheet.rawListNumber))) {
        sheetsByRawList[String(sheet.rawListNumber)].push(sheet);
      } else {
        sheetsByRawList[String(sheet.rawListNumber)] = [sheet]
      }
    }

    const piecesByPage = order.pieces.reduce((prev, curr, i) => {
      const index = Math.floor(i/32)
      Array.isArray(prev[index]) ? prev[index].push(curr) : prev[index] = [curr];
      return prev
    }, [[]] as TCuttingPiece[][])

    for (let i = 0; i < piecesByPage.length; i++) {
      piecesListToPdf(piecesByPage[i], i*32 + 1)
    }

    for (let rawList of Object.keys(piecesByRawList)) {
      doc.addPage()
      await sheetToPdf(order, piecesByRawList[parseInt(rawList)], sheetsByRawList[parseInt(rawList)])
    }

    doc.save("a4.pdf");
  }

  async function sheetToPdf(order: TOrderPdfData, pieces: TPiecesLayout[], sheets: TPiecesLayout[]) {
    const {getSheetDrawings, getPieceDrawings} = useDrawPiecesOnSheet(order.sheet.height);

    const divElement = document.createElement('div')
    divElement.setAttribute('id', 'container');
    divElement.style.display = 'none';
    document.body.appendChild(divElement)
    const stage = new Konva.Stage({
      container: 'container',
      width: order.sheet.width,
      height: order.sheet.height
    });
    const layer = new Konva.Layer();

    for (let piece of pieces) {
      layer.add(...getPieceDrawings(piece))
    }

    for (let sheet of sheets) {
      layer.add(...getSheetDrawings(sheet))
    }

    stage.add(layer)

    doc.addImage(
      await rotate90(stage.toDataURL({ pixelRatio: 0.5 })),
      30,
      10,
      150,
      150 * order.sheet.width / order.sheet.height
    );
    document.body.removeChild(divElement)
  }

  function piecesListToPdf(pieces: TCuttingPiece[], startNumber: number) {
    doc.addPage()
    drawRect(10, 18, 15, 8, "#cccccc", 'FD')
    drawRect(25, 18, 20, 8,"#cccccc",  'FD')
    drawRect(45, 18, 20, 8,"#cccccc",  'FD')
    drawRect(65, 18, 20, 8,"#cccccc",  'FD')
    drawRect(85, 18, 20, 8,"#cccccc",  'FD')
    drawRect(105, 18, 95, 8,"#cccccc",  'FD')
    drawParagraph('№', 10+2, 18 + 6)
    drawParagraph("Ширина", 25 + 2, 18 + 6)
    drawParagraph("Длина", 45 + 2, 18 + 6)
    drawParagraph("Кол-во", 65 + 2, 18 + 6)
    drawParagraph("Поворот", 85 + 1.5, 18 + 6)
    drawParagraph("Название", 105+2, 18 + 6)

    for (let i = 0; i <  pieces.length; i++) {
      const y = 26 + i*8
      const edgesHeight = getEdgeCode(pieces[i].edges.height)
      const edgesWidth = getEdgeCode(pieces[i].edges.width)
      drawRect(10, y, 15, 8, "#cccccc", 'FD')
      drawRect(25, y, 20, 8,"#cccccc",  'S')
      drawRect(45, y, 20, 8,"#cccccc",  'S')
      drawRect(65, y, 20, 8,"#cccccc",  'S')
      drawRect(85, y, 20, 8,"#cccccc",  'S')
      drawRect(105, y, 95, 8,"#cccccc",  'S')
      drawParagraph(`${startNumber + i}`, 10+2, y + 6)
      drawParagraph(pieces[i].height?.toString() ?? '0', 25 + 2, y + 5)
      drawLinesByEdgeCode(edgesHeight, 25 + 2, y + 5.8)
      drawParagraph(pieces[i].width?.toString() ?? '0', 45 + 2, y + 5)
      drawLinesByEdgeCode(edgesWidth, 45 + 2, y + 5.8)
      drawParagraph(pieces[i].count?.toString() ?? '0', 65 + 2, y + 6)
      drawParagraph(pieces[i].rotatable ? 'Да' : 'Нет', 85 + 2, y + 6)
      drawParagraph(pieces[i].name ?? '', 105+2, y + 6)
    }

  }

  function drawParagraph(text: string, x: number, y: number) {
    doc.setFontSize(12);
    doc.text(text, x, y);
  }

  function drawHeader(text: string, x: number, y: number) {
    doc.setFontSize(16);
    doc.text(text, x, y);
  }

  function drawRect(x: number, y: number, w: number, h: number, color: string = '#cccccc', style: 'S'|'F'|'FD') {
    doc.setFillColor(color)
    doc.rect(x, y, w, h, style)
  }

  function drawHorizontalLine(x: number, y: number, w: number, lineWidth: number = 0.2, dashed: boolean = false, dashWidth: number = 1) {
    doc.setLineWidth(lineWidth)
    if (dashed) {
      doc.setLineDashPattern([dashWidth, dashWidth], 0)
    }
    doc.line(x, y, x+w, y)
    doc.setLineWidth(0.2)
    doc.setLineDashPattern([], 0)
  }

  function drawTableUnit(x: number, y: number, key: string, value: string) {
    drawRect(x, y, 55, 8, "#cccccc", 'FD')
    drawRect(x + 55, y, 40, 8,"#cccccc",  'S')
    drawParagraph(key, x + 2, y + 6)
    drawParagraph(value, x + 55 + 2, y + 6)
  }

  function rotate90(src: string): Promise<string> {
    return new Promise(resolve => {
      const img = new Image()
      img.src = src
      img.onload = function() {
        const canvas = document.createElement('canvas')
        canvas.width = img.height
        canvas.height = img.width
        canvas.style.position = "absolute"
        const ctx = canvas.getContext("2d")
        ctx!.translate(img.height, img.width / img.height)
        ctx!.rotate(Math.PI / 2)
        ctx!.drawImage(img, 0, 0)
        resolve(canvas.toDataURL())
      }
    })
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

  return layoutToPdf
}

