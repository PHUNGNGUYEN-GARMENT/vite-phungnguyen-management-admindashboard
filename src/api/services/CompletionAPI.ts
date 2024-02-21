import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Completion } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'
const NAMESPACE = 'completions'

export default {
  createNewItem: async (item: Completion, accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}`,
        {
          ...item,
          status: item.status ?? 'active'
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
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
  createOrUpdateItemByPk: async (
    id: number,
    item: Completion,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/createOrUpdate/${id}`,
        {
          ...item,
          status: item.status ?? 'active'
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
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
  createOrUpdateItemBy: async (
    query: {
      field: string
      key: React.Key
    },
    item: Completion,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/createOrUpdate/${query.field}/${query.key}`,
        {
          ...item,
          status: item.status ?? 'active'
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
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
  getItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/${id}`, {
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
  getItemBy: async (
    query: { field: string; key: React.Key },
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/${query.field}/${query.key}`, {
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
  getItems: async (bodyRequest: RequestBodyType, accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/find`,
        {
          ...bodyRequest
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
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
  updateItemByPk: async (id: number, item: Completion, accessToken: string): Promise<ResponseDataType | undefined> => {
    return client
      .put(
        `${NAMESPACE}/${id}`,
        {
          ...item
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
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
    item: Completion,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(
        `${NAMESPACE}/${query.field}/${query.key}`,
        {
          ...item
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
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
  deleteItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/${id}`, {
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
  deleteItemBy: async (
    query: { field: string; key: React.Key },
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/${query.field}/${query.key}`, {
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
  }
}
