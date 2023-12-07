import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Color, ProductColor } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'product-colors'

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
  createNewItem: async (item: Color): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
        nameColor: item.nameColor,
        hexColor: item.hexColor,
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
  updateItemByPk: async (
    id: number,
    item: ProductColor
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}`, {
        params: {
          id
        },
        data: item
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
  updateItemByProductID: async (
    productID: number,
    item: ProductColor
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/product`, {
        params: {
          productID
        },
        data: item
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
  updateItemByColorID: async (
    colorID: number,
    item: ProductColor
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/color`, {
        params: {
          colorID
        },
        data: item
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
