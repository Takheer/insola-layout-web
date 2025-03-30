import type {TCuttingPiece} from "@/services/alignPieces/types";
import type {TRawSheetSettings} from "@/stores/useCuttingStore.ts";
import {useCuttingStore} from "@/stores/useCuttingStore.ts";

export type TPiecesLayout = {
  x: number
  y: number
  h: number
  w: number
  rawListNumber: number
  rawListWidth: number
  rawListHeight: number
  materialId?: number
}

export const useAlignPieces = () => {
  const store = useCuttingStore()

  function alignPieces(pieces: TCuttingPiece[], isVertical: boolean): { pieces: TPiecesLayout[], lists: TPiecesLayout[] } {
    const result = [] as TPiecesLayout[]
    const rawList = {
      h: store.rawSheetSettings.sheetHeight - 2 * store.rawSheetSettings.padding,
      w: store.rawSheetSettings.sheetWidth - 2 * store.rawSheetSettings.padding,
      x: 0,
      y: 0,
      rawListHeight: store.rawSheetSettings.sheetHeight - 2 * store.rawSheetSettings.padding,
      rawListWidth: store.rawSheetSettings.sheetWidth - 2 * store.rawSheetSettings.padding
    } as TPiecesLayout;
    const lists = [{...rawList, rawListNumber: 0}] as TPiecesLayout[]
    let rawListsCount = 0;
    pieces = pieces.map(p => [...Array(p.count).fill({...p, width: +p.width, height: +p.height })]).flat()
    pieces.sort((p1, p2) => p1.width * p1.height < p2.width * p2.height ? 1 : -1);

    lists[0].materialId = pieces[0]?.materialId;

    for (let piece of pieces) {
      let placement = placePiece(piece, lists, isVertical);
      if (!placement) {
        rawListsCount++
        lists.push({ ...rawList, rawListNumber: rawListsCount, materialId: piece.materialId })
        placement = placePiece(piece, lists, isVertical)
      }
      result.push(placement!);
    }

    return { pieces: result, lists }
  }

  function placePiece(piece: TCuttingPiece, lists: TPiecesLayout[], isVertical: boolean) {
    let list = lists.find(l => pieceFitsListExactly(piece, l));
    let listIndex = lists.findIndex(l => pieceFitsListExactly(piece, l))

    if (!list) {
      for (let i = 0; i < lists.length; i++) {
        if (pieceFitsList(piece, lists[i])) {
          list = lists[i];
          listIndex = i
        }
      }
    }

    if (!list) {
      return null;
    }

    const pieceLayout = (piece.width <= list.w && piece.height <= list.h
    ? { x: list.x, y: list.y, w: piece.width, h: piece.height }
    : { x: list.x, y: list.y, w: piece.height, h: piece.width }) as TPiecesLayout
    pieceLayout.rawListNumber = list.rawListNumber
    pieceLayout.rawListHeight = list.rawListHeight
    pieceLayout.rawListWidth = list.rawListWidth
    pieceLayout.materialId = list.materialId

    // console.log(`placing piece ${piece.width} ${piece.height} (${pieceLayout.x}, ${pieceLayout.y}) to list ${list.rawListNumber}`)

    const newLists = splitList(pieceLayout, list, isVertical)
    lists.splice(listIndex, 1)
    lists.push(...newLists)
    uniteLists(lists)
    lists.sort((l1, l2) => l1.w * l1.h < l2.w * l2.h ? 1 : -1)
    return pieceLayout;
  }

  function pieceFitsList(piece: TCuttingPiece, list: TPiecesLayout) {
    if (piece.materialId !== undefined && piece.materialId !== list.materialId) {
      return false;
    }

    return piece.width <= list.w && piece.height <= list.h
    || piece.rotatable && piece.width <= list.h && piece.height <= list.w
  }

  function pieceFitsListExactly(piece: TCuttingPiece, list: TPiecesLayout) {
    if (piece.materialId !== undefined && piece.materialId !== list.materialId || !pieceFitsList(piece,list)) {
      return false;
    }

    return piece.width === list.w || piece.height === list.h
    || piece.rotatable && (piece.width === list.h || piece.height === list.w)
  }

  function splitList(piece: TPiecesLayout, list: TPiecesLayout, isVertical: boolean): TPiecesLayout[] {
    const r = (value: number) => Math.round(value * 100) / 100
    const lists = isVertical ? [
      {
        ...list,
        x: r(list.x + piece.w + store.rawSheetSettings.sawDiskWidth),
        y: r(list.y),
        w: list.w - piece.w - store.rawSheetSettings.sawDiskWidth,
        h: list.h,
      },
      {
        ...list,
        x: r(list.x),
        y: r(list.y + piece.h + store.rawSheetSettings.sawDiskWidth),
        w: piece.w,
        h: list.h - piece.h - store.rawSheetSettings.sawDiskWidth
      }

    ] : [
      {
        ...list,
        x: r(list.x + piece.w + store.rawSheetSettings.sawDiskWidth),
        y: list.y,
        w: list.w - piece.w - store.rawSheetSettings.sawDiskWidth,
        h: piece.h
      },
      {
        ...list,
        x: r(list.x),
        y: r(list.y + piece.h + store.rawSheetSettings.sawDiskWidth),
        w: list.w,
        h: list.h - piece.h - store.rawSheetSettings.sawDiskWidth,
      }
    ]
    return lists.filter(l => l.h > 0 && l.w > 0)
  }

  function uniteLists(lists: TPiecesLayout[]) {
    for (let i = 0; i < lists.length; i++) {
      for (let j = 0; j < lists.length; j++) {
        if (i == j) continue;
        const l1 = lists[i];
        const l2 = lists[j];
        if (l1.rawListNumber !== l2.rawListNumber) continue;

        if (l1.x === l2.x && (l1.y === l2.h + l2.y + store.rawSheetSettings.sawDiskWidth || l2.y === l1.h + l1.y + store.rawSheetSettings.sawDiskWidth)) {
          lists.splice(i,1);
          lists.splice(j-1,1);

          lists.push({
            ...l1,
            x: l1.x,
            y: Math.min(l1.y, l2.y),
            w: l1.w,
            h: l1.h + l2.h + store.rawSheetSettings.sawDiskWidth
          });
        } else if (l1.y === l2.y && (l1.x === l2.w + l2.x + store.rawSheetSettings.sawDiskWidth || l2.x === l1.w + l1.x + store.rawSheetSettings.sawDiskWidth)) {
          lists.splice(i,1);
          lists.splice(j-1,1);

          lists.push({
            ...l1,
            x: Math.min(l1.x, l2.x),
            y: l1.y,
            w: l1.w + l2.w + store.rawSheetSettings.sawDiskWidth,
            h: l1.h
          });
        }
      }
    }
  }

  function getLayoutSizeWithoutEdges (piece: TCuttingPiece) {
    if (piece.sizeWithEdges) {
      return {
        w: piece.width - piece.edges.width.reduce((prev, curr) => prev+curr, 0),
        h: piece.height - piece.edges.height.reduce((prev, curr) => prev+curr, 0)
      }
    }

    return {
      w: piece.width, h: piece.height
    }
  }

  return { alignPieces }
}
