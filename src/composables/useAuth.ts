import {getCookie} from "@/utils/cookies.ts";

export const useAuth = () => {
  function isLoggedIn() {
    return Boolean(getCookie('token'))
  }

  return { isLoggedIn }
}
