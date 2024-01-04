import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { GarmentAccessoryNote } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'garment-accessory-notes'

export default {
  createNewItem: async (item: GarmentAccessoryNote): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
        productID: item.productID,
        accessoryNoteID: item.accessoryNoteID,
        garmentAccessoryID: item.garmentAccessoryID,
        noteStatus: item.noteStatus,
        status: item.status ?? 'active'
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
  createNewItems: async (items: GarmentAccessoryNote[]): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/items`, items)
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
  createOrUpdateItemByPk: async (id: number, item: GarmentAccessoryNote): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/createOrUpdate/${id}`, {
        productID: item.productID,
        garmentAccessoryID: item.garmentAccessoryID,
        accessoryNoteID: item.accessoryNoteID,
        noteStatus: item.noteStatus,
        status: item.status ?? 'active'
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
  createOrUpdateItemByProductID: async (
    productID: number,
    item: GarmentAccessoryNote
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/createOrUpdate/productID/${productID}`, {
        garmentAccessoryID: item.garmentAccessoryID,
        accessoryNoteID: item.accessoryNoteID,
        noteStatus: item.noteStatus,
        status: item.status ?? 'active'
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
  getItemBy: async (query: { field: string; key: React.Key }): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/${query.field}/${query.key}`)
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
  getItems: async (bodyRequest: RequestBodyType): Promise<ResponseDataType | undefined> => {
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
  updateItemByPk: async (id: number, item: GarmentAccessoryNote): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${id}`, {
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
  updateItemsBy: async (
    query: {
      field: string
      key: React.Key
    },
    recordsToUpdate: GarmentAccessoryNote[]
  ): Promise<ResponseDataType | undefined> => {
    return client
      .post(`${NAMESPACE}/updateItems/${query.field}/${query.key}`, recordsToUpdate)
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
    item: GarmentAccessoryNote
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/${query.field}/${query.key}`, {
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
  deleteItemBy: async (query: { field: string; key: React.Key }): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/${query.field}/${query.key}`)
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
