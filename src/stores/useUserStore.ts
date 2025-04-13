import {defineStore} from "pinia";
import {getCookie} from "@/utils/cookies.ts";

type TUser = {
  fullName: string,
  email: string,
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    user: {
      fullName: '',
      email: '',
    } as TUser
  }),
  getters: {
    getCurrentUser: (state) => getCookie('token') && state.user
  }
})
