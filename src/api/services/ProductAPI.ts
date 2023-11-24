import client, { ResponseDataType } from '~/api/client'
import { Product } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const PATH_API = 'products'

export default {
  getAlls: async (): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${PATH_API}/find`)
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
  createNew: async (
    product: Product
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${PATH_API}`, {
        productCode: product.productCode,
        quantityPO: product.quantityPO,
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
  getItem: async (id: number): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${PATH_API}/${id}`)
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
  updateItem: async (
    product: Product
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${PATH_API}/${product.productID}`, {
        productCode: product.productCode,
        quantityPO: product.quantityPO,
        dateInputNPL: product.dateInputNPL,
        dateOutputFCR: product.dateOutputFCR,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
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
  deleteItem: async (id: number): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${PATH_API}/${id}`)
      .then((res) => {
        // console.log(JSON.stringify(res.data))
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
