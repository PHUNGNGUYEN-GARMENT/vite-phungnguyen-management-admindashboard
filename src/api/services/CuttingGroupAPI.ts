import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { CuttingGroup } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'cutting-groups'

export default {
  createNewItem: async (item: CuttingGroup): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
        productID: item.productID,
        quantityRealCut: item.quantityRealCut,
        timeCut: item.timeCut,
        dateSendEmbroidered: item.dateSendEmbroidered,
        quantityArrivedEmbroidered: item.quantityArrivedEmbroidered,
        quantityDeliveredBTP: item.quantityDeliveredBTP,
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
  updateItemByPk: async (id: number, itemToUpdate: CuttingGroup): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${id}`, {
        ...itemToUpdate
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
    itemToUpdate: CuttingGroup
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${query.field}/${query.key}`, {
        ...itemToUpdate
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