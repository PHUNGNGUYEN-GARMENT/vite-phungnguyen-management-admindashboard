import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { User } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'
const NAMESPACE = 'users'

export default {
  createNewItem: async (user: User): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
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
        throw Error(`${error}`)
      })
  },
  getItemByPk: async (id: number): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/${id}`)
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
        throw Error(`${error}`)
      })
  },
  getItemBy: async (query: { field: string; key: React.Key }): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/${query.field}/${query.key}`)
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
        throw Error(`${error}`)
      })
  },
  getItems: async (bodyRequest: RequestBodyType): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/find`, {
        ...bodyRequest
      })
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
        throw Error(`${error}`)
      })
  },
  userRolesFromAccessToken: async (accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .get(`${NAMESPACE}/user-roles`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
        throw Error(`${error}`)
      })
  },
  userFromAccessToken: async (accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .get(`${NAMESPACE}/users`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
        throw Error(`${error}`)
      })
  },
  updateItemByPk: async (id: number, item: User): Promise<ResponseDataType | undefined> => {
    return await client
      .put(`${NAMESPACE}/${id}`, item)
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
        throw Error(`${error}`)
      })
  },
  updateItemBy: async (
    query: {
      field: string
      key: React.Key
    },
    item: User
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${query.field}/${query.key}`, item)
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
        throw Error(`${error}`)
      })
  },
  deleteItemByPk: async (id: number): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/${id}`)
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
        throw Error(`${error}`)
      })
  }
}
