import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { SewingLineDelivery } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

const NAMESPACE = 'sewing-line-deliveries'

export default {
  createNewItem: async (
    item: SewingLineDelivery
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}`, {
        sewingLineID: item.sewingLineID,
        productID: item.productID,
        quantityOrigin: item.quantityOrigin,
        quantitySewed: item.quantitySewed,
        expiredDate: item.expiredDate,
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
  getItemBySewingLine: async (
    sewingLineID: number
  ): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/sewingLineID/${sewingLineID}`)
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
    item: SewingLineDelivery
  ): Promise<ResponseDataType | undefined> => {
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
  updateItemBySewingLineID: async (
    sewingLineID: number,
    item: SewingLineDelivery
  ): Promise<ResponseDataType | undefined> => {
    return client
      .put(`${NAMESPACE}/sewingLineID/${sewingLineID}`, {
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
  updateItemByProductID: async (
    productID: number,
    item: SewingLineDelivery
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
  deleteItemBySewingLineID: async (
    sewingLineID: number
  ): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/sewingLineID/${sewingLineID}`)
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
  }
}
