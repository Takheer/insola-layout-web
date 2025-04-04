import {defineStore} from "pinia";
import {type TCuttingPiece} from "@/stores/useCuttingStore.ts";

export type TCuttingProject = {
  uuid: string
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
