import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Product } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'products'

export default {
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
  getItemByProductCode: async (
    productCode: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/productCode/${productCode}`)
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
    product: Product
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${id}`, {
        ...product
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
