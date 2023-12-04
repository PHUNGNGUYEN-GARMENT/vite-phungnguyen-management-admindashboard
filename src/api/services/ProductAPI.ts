import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Product } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'products'

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
    product: Product
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
        productCode: product.productCode,
        quantityPO: product.quantityPO,
        status: product.status,
        dateInputNPL: product.dateInputNPL,
        dateOutputFCR: product.dateOutputFCR
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
  getItemByCode: async (
    code: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/code`, {
        params: {
          code: code
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
    product: Product
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${id}`, {
        productCode: product.productCode,
        quantityPO: product.quantityPO,
        status: product.status,
        dateInputNPL: product.dateInputNPL,
        dateOutputFCR: product.dateOutputFCR
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
