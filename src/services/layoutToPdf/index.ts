import {jsPDF as JSPDF} from "jspdf";
import { font } from '@/assets/fonts/Roboto.js'
import type {TOrderPdfData} from "@/services/layoutToPdf/types.ts";
import Konva from "konva";
import type {TPiecesLayout} from "@/services/alignPieces";
import {ELayoutMethod} from "@/stores/useCuttingStore.ts";
import {useAlignPieces} from "@/services/alignPieces";

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

    drawParagraph(`Заказчик: ${order.sheet.thickness}`, 10, 28)
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

    const {pieces, lists: sheets, stats} = alignPieces(order.pieces, order.layoutMethod === ELayoutMethod.VERTICAL);

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

    console.log({ piecesByRawList, sheetsByRawList, sheets })

    for (let rawList of Object.keys(piecesByRawList)) {
      doc.addPage()
      await sheetToPdf(order, piecesByRawList[parseInt(rawList)], sheetsByRawList[parseInt(rawList)])
    }

    doc.save("a4.pdf");
  }

  async function sheetToPdf(order: TOrderPdfData, pieces: TPiecesLayout[], sheets: TPiecesLayout[]) {
    const divElement = document.createElement('div')
    divElement.setAttribute('id', 'container')
    document.body.appendChild(divElement)
    const stage = new Konva.Stage({
      container: 'container',
      width: order.sheet.width,
      height: order.sheet.height
    });
    const layer = new Konva.Layer();

    for (let piece of pieces) {
      layer.add(new Konva.Rect({
        x: piece.x,
        y: piece.y,
        width: piece.w,
        height: piece.h,
        fill: '#89b717',
        opacity: 0.8,
      }))
    }

    for (let sheet of sheets) {
      layer.add(new Konva.Rect({
        x: sheet.x,
        y: sheet.y,
        width: sheet.w,
        height: sheet.h,
        fill: '#6db8c9',
        opacity: 0.6
      }))
    }

    stage.add(layer)

    doc.addImage(
      await rotate90(stage.toDataURL({ pixelRatio: 2 })),
      10,
      10,
      190,
      190 * order.sheet.width / order.sheet.height
    );
    document.body.removeChild(divElement)
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
        ctx.translate(img.height, img.width / img.height)
        ctx.rotate(Math.PI / 2)
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL())
      }
    })
  }

  return layoutToPdf
}

