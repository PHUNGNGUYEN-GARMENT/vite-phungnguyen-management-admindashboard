import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { ProductGroup } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'product-groups'

export default {
  createNewItem: async (
    item: ProductGroup
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
        productID: item.productID,
        groupID: item.groupID,
        name: item.name,
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
  getItemByProductID: async (
    productID: number
  ): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/productID/${productID}`)
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
  getItemByGroupID: async (
    groupID: number
  ): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/groupID/${groupID}`)
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
    item: ProductGroup
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${id}`, { ...item })
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
    item: ProductGroup
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/productID/${productID}`, {
        ...item
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
  updateItemByGroupID: async (
    groupID: number,
    item: ProductGroup
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/groupID/${groupID}`, {
        ...item
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
  },
  deleteItemByProductID: async (
    productID: number
  ): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/productID/${productID}`)
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
  deleteItemByGroupID: async (
    groupID: number
  ): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/groupID/${groupID}`)
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
