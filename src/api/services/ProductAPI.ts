import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Product } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const PATH_API = 'products'

export default {
  getAlls: async (
    bodyRequest: RequestBodyType
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${PATH_API}/find`, {
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
  getItemByID: async (id: number): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${PATH_API}`, {
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
      .get(`${PATH_API}`, {
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
  updateItem: async (
    id: number,
    product: Product
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${PATH_API}/${id}`, {
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
