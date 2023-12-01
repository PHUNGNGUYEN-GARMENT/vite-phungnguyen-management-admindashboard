import client, { ResponseDataType } from '~/api/client'
import { Color } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const PATH_API = 'colors'

export default {
  getAllColors: async (): Promise<ResponseDataType | undefined> => {
    return await client
      .get(`${PATH_API}/find`)
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
  createNew: async (
    nameColor: string,
    hexColor: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .post(`${PATH_API}`, {
        nameColor: nameColor,
        hexColor: hexColor
      })
      .then((res) => {
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  },
  updateItem: async (color: Color): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${PATH_API}`, {
        colorID: color.colorID,
        nameColor: color.nameColor,
        hexColor: color.hexColor,
        createdAt: color.createdAt,
        updatedAt: color.updatedAt,
        orderNumber: color.orderNumber
      })
      .then((res) => {
        console.log(res.data)
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  },
  deleteItem: async (
    colorID: number
  ): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${PATH_API}/${colorID}`)
      .then((res) => {
        // console.log(JSON.stringify(res.data))
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  }
}
