import client from '~/api/client'
import { PrintablePlace, ResponseDataType } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const PATH_API = 'printable-places'

export default {
  createNew: async (printID: number, productID: number): Promise<ResponseDataType | undefined> => {
    return client
      .post(`${PATH_API}`, {
        printID: printID,
        productID: productID
      })
      .then((res) => {
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  },
  getAlls: async (): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${PATH_API}/find`)
      .then((res) => {
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
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  },
  updateItem: async (item: PrintablePlace): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${PATH_API}`, {
        printID: item.printID,
        productID: item.productID,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        orderNumber: item.orderNumber
      })
      .then((res) => {
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
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  }
}
