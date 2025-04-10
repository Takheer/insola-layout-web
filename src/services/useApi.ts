import {edgeValues} from "@/services/consts.ts";
import {useCuttingStore} from "@/stores/useCuttingStore.ts";
import {getCookie} from "@/utils/cookies.ts";
import {edgeCodesToEdges, slotCodesToSlots} from "@/utils/codesToArrays.ts";

export const piecesFromDto = (pieces: any[]) => {
  let localPieces = [];
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    p.edges = {
      width: [...edgeCodesToEdges[p.edges_width_code as keyof typeof edgeCodesToEdges]],
      height: [...edgeCodesToEdges[p.edges_height_code as keyof typeof edgeCodesToEdges]]
    };
    p.slots = {
      width: [...slotCodesToSlots[(p.slots_width_code ?? 0) as keyof typeof slotCodesToSlots]],
      height: [...slotCodesToSlots[(p.slots_height_code ?? 0) as keyof typeof slotCodesToSlots]]
    };
    localPieces.push(p)
  }

  return localPieces
}

export const getEdgeCode = (edges: number[]) => {
  let code = 0;
  if (edges.includes(edgeValues.THICK) && edges.includes(edgeValues.THIN)) {
    return 5;
  }

  if (edges[0] === edgeValues.THIN || edges[1] === edgeValues.THIN) {
    code += 2;
  }
  code += edges[0] === edgeValues.NO ? 0 : 1;
  code += edges[1] === edgeValues.NO ? 0 : 1;

  return code;
}

export const useApi = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const getSlotCode = (slots: (number|boolean)[]) => {
    return slots.reduce((prev: number, curr) => prev + (Boolean(curr) ? 1 : 0), 0)
  }

  const storeToReqBody = (uuid: string, store: ReturnType<typeof useCuttingStore>): string => JSON.stringify({
    slot_offset: store.slotSettings.offset,
    slot_height: store.slotSettings.depth,
    slot_width: store.slotSettings.width,
    uuid,
    layout_method: store.layoutMethod,
    raw_sheet_height: store.rawSheetSettings.sheetHeight,
    raw_sheet_width: store.rawSheetSettings.sheetWidth,
    raw_sheet_thickness: store.rawSheetSettings.sheetThickness,
    raw_sheet_padding: store.rawSheetSettings.padding,
    raw_sheet_saw_disk_width: store.rawSheetSettings.sawDiskWidth,
    pieces: store.pieces.map(p => ({
      name: p.name,
      width: p.width,
      height: p.height,
      edges_height_code: getEdgeCode(p.edges.height),
      edges_width_code: getEdgeCode(p.edges.width),
      slots_height_code: getSlotCode(p.slots.height),
      slots_width_code: getSlotCode(p.slots.width),
      count: p.count,
      rotatable: p.rotatable
    })),
  })

  async function createNewProject(uuid: string, store: ReturnType<typeof useCuttingStore>) {
    const res = await fetch(apiUrl + `/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('token')}`
      },
      body: storeToReqBody(uuid, store)
    });
    return {
      status: res.status,
      project: {
        ...(await res.json())
      }
    }
  }

async function updateProject(uuid: string, store: ReturnType<typeof useCuttingStore>) {
    const res = await fetch(apiUrl + `/projects/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('token')}`
      },
      body: storeToReqBody(uuid, store)
    });
    return {
      status: res.status,
      ...(await res.json())
    }
  }

  async function getUserProjects() {
    const res = await fetch(apiUrl + `/user/projects`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('token')}`
      }
    });

    return {
      status: res.status,
      projects: await res.json()
    }
  }

  async function getProjectByUuid(uuid: string) {
    const res = await fetch(apiUrl + `/projects/${uuid}`)

    return {
      status: res.status,
      project: {
        ...(await res.json())
      }
    }
  }

  return { createNewProject, getUserProjects, updateProject, getProjectByUuid }
}
