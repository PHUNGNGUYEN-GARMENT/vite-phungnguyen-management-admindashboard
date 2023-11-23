import client from '~/api/client'
import { Print, ResponseDataType } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const PATH_API = 'prints'

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
  createNew: async (name: string): Promise<ResponseDataType | undefined> => {
    return client
      .post(`${PATH_API}`, {
        name: name
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
  updateItem: async (item: Print): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${PATH_API}/${item.printID}`, {
        name: item.name,
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
