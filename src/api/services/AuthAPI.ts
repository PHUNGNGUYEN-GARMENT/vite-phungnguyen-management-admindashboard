import client, { ResponseDataType } from '~/api/client'
import { User } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'users'

export default {
  register: async (user: User): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/register`, {
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
        errorFormatter(error)
      })
  },
  login: async (user: User): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/login`, {
        ...user
      })
      .then((res) => {
        console.log(res)
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  },
  checkAdmin: async (accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .get(`${NAMESPACE}/check-admin`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        console.log(res)
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  }
}
