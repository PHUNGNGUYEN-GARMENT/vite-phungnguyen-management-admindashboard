import client from '~/api/client'
import { ResponseDataType, SampleSewing } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const PATH_API = 'sample-sewings'

export default {
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
  createNew: async (productID: number, dateSewingNPL: string): Promise<ResponseDataType | undefined> => {
    return client
      .post(`${PATH_API}`, {
        productID: productID,
        dateSewingNPL: dateSewingNPL
      })
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
  updateItem: async (item: SampleSewing): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${PATH_API}/${item.sampleSewingID}`, {
        productID: item.productID,
        dateSewingNPL: item.dateSewingNPL,
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
        // console.log(JSON.stringify(res.data))
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  }
}
