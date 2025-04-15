import {defineStore} from "pinia";
import {ELayoutMethod, type TCuttingPiece, type TRawSheetSettings, type TSlotSettings} from "@/stores/useCuttingStore.ts";

export type TProjectDetails = {
  title?: string
  client?: string,
  manager?: string
}

export type TCuttingProject = {
  uuid?: string
  projectDetails: TProjectDetails
  slotSettings: TSlotSettings
  edgeSettings: {
    edgeThickWidth: number,
    edgeThinWidth: number
  },
  rawSheetSettings: TRawSheetSettings,
  layoutMethod: ELayoutMethod,
  pieces: TCuttingPiece[]
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projectsList: [] as TCuttingProject[]
  }),
  getters: {
    isProjectPublished: (state) => (projectUuid: string | null) => projectUuid && state.projectsList.map(p => p.uuid).includes(projectUuid)
  }
})
