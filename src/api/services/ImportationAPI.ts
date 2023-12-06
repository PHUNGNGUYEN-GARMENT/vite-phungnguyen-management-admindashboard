import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Importation } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'importations'

export default {
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
  createNewItem: async (
    item: Importation
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
        productID: item.productID,
        quantity: item.quantity,
        dateImported: item.dateImported,
        status: item.status
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
  getItemByID: async (id: number): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/id`, {
        params: {
          id: id
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
      })
  },
  getItemByProductID: async (
    productID: number
  ): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/productID`, {
        params: {
          productID: productID
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
      })
  },
  updateItemByID: async (
    id: number,
    item: Importation
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
  deleteItemByID: async (id: number): Promise<ResponseDataType | undefined> => {
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
