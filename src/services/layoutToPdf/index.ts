import {jsPDF as JSPDF} from "jspdf";
import { font } from '@/assets/fonts/Roboto.js'
import type {TOrderPdfData} from "@/services/layoutToPdf/types.ts";

export const useLayoutToPdf = () => {
  const doc = new JSPDF({
    orientation: "portrait",
    unit: "mm",
    format: 'a4'
  });
  doc.addFileToVFS('Roboto.ttf', font);
  doc.addFont('Roboto.ttf', 'Roboto', 'normal');
  console.log(doc.getFontList());

  doc.setFont('Roboto', 'normal');

  function layoutToPdf(order: TOrderPdfData) {

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

    doc.save("a4.pdf");
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

  return layoutToPdf
}

