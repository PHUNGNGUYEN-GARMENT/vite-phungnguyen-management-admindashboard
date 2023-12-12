import { useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import { ItemStatusType, SortDirection } from '~/typing'

export interface ItemWithId {
  id: number
  status?: ItemStatusType
  // ... other common properties
}

export interface APIService<T extends ItemWithId> {
  createNewItem: (itemNew: Partial<T>) => Promise<ResponseDataType | undefined>
  getItemByPk: (id: number) => Promise<ResponseDataType | undefined>
  getItemBy: (query: { field: string; key: React.Key }) => Promise<ResponseDataType | undefined>
  getItems: (params: RequestBodyType) => Promise<ResponseDataType | undefined>
  updateItemByPk: (id: number, itemToUpdate: Partial<T>) => Promise<ResponseDataType | undefined>
  updateItemBy: (
    query: {
      field: string
      key: React.Key
    },
    itemToUpdate: Partial<T>
  ) => Promise<ResponseDataType | undefined>
  deleteItemByPk: (id: number) => Promise<ResponseDataType | undefined>
}

export default function useAPICaller<T extends { id?: number }>(apiService: APIService<ItemWithId>) {
  const [metaData, setMetaData] = useState<ResponseDataType | undefined>(undefined)
  const [page, setPage] = useState<number>(1)

  const createNewItem = async (
    itemNew: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, status: boolean) => void
  ) => {
    try {
      setLoading?.(true)
      await apiService
        .createNewItem(itemNew)
        .then((meta) => {
          if (meta?.success) {
            onDataSuccess?.(meta, true)
          } else {
            onDataSuccess?.(undefined, false)
          }
        })
        .catch((err) => {
          console.log(err)
          onDataSuccess?.(undefined, false)
        })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading?.(false)
    }
  }

  const getItemByPk = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, status: boolean) => void
  ) => {
    try {
      await apiService
        .getItemByPk(id)
        .then((meta) => {
          setLoading?.(true)
          if (meta?.success) {
            onDataSuccess?.(meta, true)
          } else {
            onDataSuccess?.(undefined, false)
          }
          console.log(meta)
        })
        .catch((err) => {
          console.log(err)
          onDataSuccess?.(undefined, false)
        })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading?.(false)
    }
  }

  const getItemBy = async (
    query: {
      field: string
      key: React.Key
    },
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, status: boolean) => void
  ) => {
    try {
      await apiService
        .getItemBy?.(query)
        .then((meta) => {
          setLoading?.(true)
          if (meta?.success) {
            onDataSuccess?.(meta, true)
          } else {
            onDataSuccess?.(undefined, false)
          }
          console.log(meta)
        })
        .catch((err) => {
          console.log(err)
          onDataSuccess?.(undefined, false)
        })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading?.(false)
    }
  }

  const getListItems = async (
    params: RequestBodyType,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, status: boolean) => void
  ) => {
    try {
      setLoading?.(true)
      const body: RequestBodyType = {
        ...defaultRequestBody,
        ...params
      }
      await apiService
        .getItems(body)
        .then((meta) => {
          if (meta?.success) {
            setMetaData(meta)
            onDataSuccess?.(meta, true)
          }
        })
        .catch((err) => {
          console.log(err)
          onDataSuccess?.(undefined, false)
        })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading?.(false)
    }
  }

  const sortedListItems = async (
    direction: SortDirection,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, status: boolean) => void
  ) => {
    try {
      const body: RequestBodyType = {
        ...defaultRequestBody,
        paginator: {
          page: page,
          pageSize: 5
        },
        sorting: {
          column: 'id',
          direction: direction
        }
      }
      await getListItems(body, setLoading, onDataSuccess)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemByPk = async (
    id: number,
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, status: boolean) => void
  ) => {
    try {
      setLoading?.(true)
      apiService
        .updateItemByPk(id, itemToUpdate)
        .then((data) => {
          if (data?.success) {
            setMetaData(data)
            onDataSuccess?.(data, true)
          }
        })
        .catch((err) => {
          console.log(err)
          onDataSuccess?.(undefined, false)
        })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemBy = async (
    query: {
      field: string
      key: React.Key
    },
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, status: boolean) => void
  ) => {
    try {
      setLoading?.(true)
      apiService
        .updateItemBy(query, itemToUpdate)
        .then((data) => {
          if (data?.success) {
            setMetaData(data)
            onDataSuccess?.(data, true)
          }
        })
        .catch((err) => {
          console.log(err)
          onDataSuccess?.(undefined, false)
        })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemByPk = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, status: boolean) => void
  ) => {
    try {
      setLoading?.(true)
      await apiService
        .deleteItemByPk(id)
        .then((data) => {
          if (data?.success) {
            setMetaData(data)
            onDataSuccess?.(data, true)
          }
        })
        .catch((err) => {
          console.log(err)
          onDataSuccess?.(undefined, false)
        })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading?.(false)
    }
  }

  return {
    page,
    setPage,
    metaData,
    createNewItem,
    getItemByPk,
    getItemBy,
    getListItems,
    updateItemByPk,
    updateItemBy,
    deleteItemByPk,
    sortedListItems
  }
}
