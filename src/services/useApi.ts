import {edgeValues} from "@/components/consts.ts";
import {useCuttingStore} from "@/stores/useCuttingStore.ts";
import {getCookie} from "@/utils/cookies.ts";

export const useApi = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const getEdgeCode = (edges: number[]) => {
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

  const getSlotCode = (slots: (number|boolean)[]) => {
    return slots.reduce((prev: number, curr) => prev + (Boolean(curr) ? 1 : 0), 0)
  }

  async function createNewProject(uuid: string, store: ReturnType<typeof useCuttingStore>) {
    const res = await fetch(apiUrl + `/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('token')}`
      },
      body: JSON.stringify({
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

  return { createNewProject, getUserProjects }
}
