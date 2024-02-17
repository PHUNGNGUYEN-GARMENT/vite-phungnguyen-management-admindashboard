import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { GarmentAccessoryNote } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'garment-accessory-notes'

export default {
  createNewItem: async (item: GarmentAccessoryNote, accessToken: string): Promise<ResponseDataType | undefined> => {
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
        errorFormatter(error)
      })
  },
  createNewItems: async (items: GarmentAccessoryNote[], accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/items`, items, {
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
        errorFormatter(error)
      })
  },
  createOrUpdateItemByPk: async (
    id: number,
    item: GarmentAccessoryNote,
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
        errorFormatter(error)
      })
  },
  createOrUpdateItemByProductID: async (
    productID: number,
    item: GarmentAccessoryNote,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/createOrUpdate/productID/${productID}`,
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
        errorFormatter(error)
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
        errorFormatter(error)
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
        errorFormatter(error)
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
        errorFormatter(error)
      })
  },
  updateItemByPk: async (
    id: number,
    item: GarmentAccessoryNote,
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
        errorFormatter(error)
      })
  },
  updateItemsBy: async (
    query: {
      field: string
      key: React.Key
    },
    recordsToUpdate: GarmentAccessoryNote[],
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .post(`${NAMESPACE}/updateItems/${query.field}/${query.key}`, recordsToUpdate, {
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
        errorFormatter(error)
      })
  },
  updateItemBy: async (
    query: {
      field: string
      key: React.Key
    },
    item: GarmentAccessoryNote,
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
        errorFormatter(error)
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
        errorFormatter(error)
      })
  },
  deleteItemBy: async (
    query: { field: string; key: React.Key },
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/${query.field}/${query.key}`, {
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
        errorFormatter(error)
      })
  }
}
