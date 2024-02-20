import client, { ResponseDataType } from '~/api/client'
import { User } from '~/typing'

const NAMESPACE = 'users'

export default {
  register: async (user: User): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/auth/register`, {
        ...user,
        status: user.status ?? 'active'
      })
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  login: async (user: User): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/auth/login`, user)
      .then((res) => {
        console.log(res)
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
        throw Error('')
      })
  },
  sendEmail: async (emailToSend: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/auth/send-email/${emailToSend}`)
      .then((res) => {
        console.log(res)
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  verifyOTP: async (user: { email: string; otp: string }): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/auth/verify-otp/${user.email}`, { otp: user.otp })
      .then((res) => {
        console.log(res)
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  }
}
