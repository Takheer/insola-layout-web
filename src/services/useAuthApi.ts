type SctDetail = {
  width: number
  length: number
  count: number
}

type SctParams = {
  listLength: number
  listWidth: number
  orderName?: string
  createdAt: string
  orderReadyAt?: string
  materialName: string
  listThickness: number
  edge1Thickness: number
  edge1Name?: string
  edge2Thickness: number
  edge2Name?: string
  orderInfo?: string
  details: SctDetail[]
}

export const useAuthApi = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  async function sendCodeToEmail(email: string) {
    const res = await fetch(apiUrl + `/user/send-email/${email}`);

    return await res.json()
  }

  async function createUser(email: string, name: string) {
    console.log({email, name})
    const res = await fetch(apiUrl + `/user?email=${email}&name=${name}`, {
      method: 'POST'
    });

    return await res.json()
  }

  async function auth(email: string, otp: string) {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', otp)

    try {
      const res = await fetch(apiUrl + `/user/auth`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.access_token) {
        document.cookie = `token=${result.access_token}; path=/; max-age=86400; secure; samesite=lax;`
        return { success: true }
      }
      return { success: false }
    } catch (e) {
      return { success: false }
    }
  }

  return { sendCodeToEmail, auth, createUser }
}
