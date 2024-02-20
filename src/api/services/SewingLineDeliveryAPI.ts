import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { SewingLineDelivery } from '~/typing'

const NAMESPACE = 'sewing-line-deliveries'

export default {
  createNewItem: async (item: SewingLineDelivery, accessToken: string): Promise<ResponseDataType | undefined> => {
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
  createNewItems: async (items: SewingLineDelivery[], accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/items`,
        items.map((item) => {
          return { ...item, status: 'active' }
        }),
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
    item: SewingLineDelivery,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${id}`, item, {
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
  updateItemBy: async (
    query: {
      field: string
      key: React.Key
    },
    item: SewingLineDelivery,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${query.field}/${query.key}`, item, {
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
  updateItemsBy: async (
    query: {
      field: string
      key: React.Key
    },
    recordsToUpdate: SewingLineDelivery[],
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
