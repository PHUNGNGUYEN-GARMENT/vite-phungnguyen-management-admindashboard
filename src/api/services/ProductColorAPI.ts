import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { ProductColor } from '~/typing'

const NAMESPACE = 'product-colors'

export default {
  createNewItem: async (item: ProductColor, accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}`,
        {
          ...item,
          status: item.status ?? 'active'
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  createOrUpdateItemByPk: async (
    id: number,
    item: ProductColor,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/createOrUpdate/${id}`,
        {
          ...item,
          status: item.status ?? 'active'
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  createOrUpdateItemBy: async (
    query: {
      field: string
      key: React.Key
    },
    item: ProductColor,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/createOrUpdate/${query.field}/${query.key}`,
        query.field === 'productID'
          ? {
              colorID: item.colorID,
              status: item.status ?? 'active'
            }
          : {
              productID: item.productID,
              status: item.status ?? 'active'
            },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  createOrUpdateItemByProductID: async (
    productID: number,
    item: ProductColor,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/createOrUpdate/productID/${productID}`,
        {
          colorID: item.colorID,
          status: item.status ?? 'active'
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  createOrUpdateItemByColorID: async (
    colorID: number,
    item: ProductColor,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/createOrUpdate/colorID/${colorID}`,
        {
          productID: item.productID,
          status: item.status ?? 'active'
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  getItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/${id}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  getItemBy: async (
    query: { field: string; key: React.Key },
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/${query.field}/${query.key}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  getItems: async (bodyRequest: RequestBodyType, accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/find`,
        {
          ...bodyRequest
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  updateItemByPk: async (
    id: number,
    item: ProductColor,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(
        `${NAMESPACE}/${id}`,
        {
          ...item
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  updateItemBy: async (
    query: {
      field: string
      key: React.Key
    },
    item: ProductColor,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(
        `${NAMESPACE}/${query.field}/${query.key}`,
        {
          ...item
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  },
  deleteItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/${id}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        if (res.data) {
          return res.data as ResponseDataType
        }
        return res.data
      })
      .catch(function (error) {
        throw Error(`${error}`)
      })
  }
}
