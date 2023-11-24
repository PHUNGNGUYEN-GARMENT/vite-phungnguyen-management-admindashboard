import client, { ResponseDataType } from '~/api/client'
import { PrintablePlace } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const PATH_API = 'printable-places'

export default {
  createNew: async (
    items: { printID: number; productID: number; name?: string }[]
  ): Promise<ResponseDataType | undefined> => {
    return client
      .post(`${PATH_API}`, {
        items
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
  getAlls: async (
    printID?: number | null,
    productID?: number | null
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${PATH_API}/find`, {
        printID: printID,
        productID: productID
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
    item: PrintablePlace
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${PATH_API}`, {
        printID: item.printID,
        productID: item.productID,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        orderNumber: item.orderNumber
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
