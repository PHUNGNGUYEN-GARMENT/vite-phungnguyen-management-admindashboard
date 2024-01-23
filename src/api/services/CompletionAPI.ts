import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Completion } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'completions'

export default {
  createNewItem: async (item: Completion): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
        ...item,
        status: item.status ?? 'active'
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
  createOrUpdateItemByPk: async (id: number, item: Completion): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/createOrUpdate/${id}`, {
        ...item,
        status: item.status ?? 'active'
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
  createOrUpdateItemBy: async (
    query: {
      field: string
      key: React.Key
    },
    item: Completion
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/createOrUpdate/${query.field}/${query.key}`, {
        ...item,
        status: item.status ?? 'active'
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
      })
  },
  updateItemByPk: async (id: number, item: Completion): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${id}`, {
        ...item
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
  updateItemBy: async (
    query: {
      field: string
      key: React.Key
    },
    item: Completion
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${query.field}/${query.key}`, {
        ...item
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
      })
  },
  deleteItemBy: async (query: { field: string; key: React.Key }): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/${query.field}/${query.key}`)
      .then((res) => {
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