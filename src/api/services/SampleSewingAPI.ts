import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { SampleSewing } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'sample-sewings'

export default {
  createNewItem: async (
    item: SampleSewing
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
        productID: item.productID,
        dateSewingNPL: item.dateSewingNPL,
        status: 'active'
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
  getItemBy: async (query: {
    field: string
    key: React.Key
  }): Promise<ResponseDataType | undefined> => {
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
  getItems: async (
    bodyRequest: RequestBodyType
  ): Promise<ResponseDataType | undefined> => {
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
  updateItemByPk: async (
    id: number,
    item: SampleSewing
  ): Promise<ResponseDataType | undefined> => {
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
    item: SampleSewing
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
  }
}
