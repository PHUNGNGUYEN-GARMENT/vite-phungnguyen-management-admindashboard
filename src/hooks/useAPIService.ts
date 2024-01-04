/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import { ItemStatusType, SortDirection } from '~/typing'

export interface ItemWithId {
  id?: number
  status?: ItemStatusType
  // ... other common properties
}

export interface APIService<T extends ItemWithId> {
  createNewItem: (itemNew: Partial<T>) => Promise<ResponseDataType | undefined>
  createNewItems?: (itemsNew: Partial<T>[]) => Promise<ResponseDataType | undefined>
  createOrUpdateItemByPk?: (id: number, item: Partial<T>) => Promise<ResponseDataType | undefined>
  createOrUpdateItemBy?: (
    query: { field: string; key: React.Key },
    item: Partial<T>
  ) => Promise<ResponseDataType | undefined>
  getItemByPk: (id: number) => Promise<ResponseDataType | undefined>
  getItemBy: (query: { field: string; key: React.Key }) => Promise<ResponseDataType | undefined>
  getItems: (params: RequestBodyType) => Promise<ResponseDataType | undefined>
  updateItemByPk: (id: number, itemToUpdate: Partial<T>) => Promise<ResponseDataType | undefined>
  updateItemsBy?: (
    query: { field: string; key: React.Key },
    recordsToUpdate: Partial<T>[]
  ) => Promise<ResponseDataType | undefined>
  updateItemBy: (
    query: {
      field: string
      key: React.Key
    },
    itemToUpdate: Partial<T>
  ) => Promise<ResponseDataType | undefined>
  deleteItemByPk: (id: number) => Promise<ResponseDataType | undefined>
  deleteItemBy?: (query: { field: string; key: React.Key }) => Promise<ResponseDataType | undefined>
}

export default function useAPIService<T extends { id?: number }>(apiService: APIService<ItemWithId>) {
  const [metaData, setMetaData] = useState<ResponseDataType | undefined>(undefined)
  const [page, setPage] = useState<number>(1)

  const createNewItem = async (
    itemNew: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (meta: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.createNewItem(itemNew)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Created!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const createNewItems = async (
    itemsNew: T[],
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (meta: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.createNewItems?.(itemsNew)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Created!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const getItemByPk = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.getItemByPk(id)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Success!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
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
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.getItemBy?.(query)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Success!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const getListItems = async (
    params: RequestBodyType,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.getItems(params)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Success!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const sortedListItems = async (
    direction: SortDirection,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void,
    search?: {
      field: string
      term: string
    }
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
        },
        search: search
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
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItemByPk(id, itemToUpdate)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Updated!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemsBy = async (
    query: {
      field: string
      key: React.Key
    },
    recordsToUpdate: T[],
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItemsBy?.(query, recordsToUpdate)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Updated!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
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
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItemBy(query, itemToUpdate)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Updated!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemByPk = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.deleteItemByPk(id)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Deleted!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemBy = async (
    query: {
      field: string
      key: React.Key
    },
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.deleteItemBy?.(query)
      if (meta?.success) {
        onDataSuccess?.(meta, 'Deleted!')
      } else {
        onDataSuccess?.(undefined, 'Failed!')
      }
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const createOrUpdateItemByPk = async (
    id: number,
    item: Partial<T>,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.createOrUpdateItemByPk?.(id, item)
      onDataSuccess?.(meta, meta?.message)
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  const createOrUpdateItemBy = async (
    query: {
      field: string
      key: React.Key
    },
    item: Partial<T>,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType | undefined, message?: string) => void
  ) => {
    try {
      setLoading?.(true)
      const meta = await apiService.createOrUpdateItemBy?.(query, item)
      onDataSuccess?.(meta, meta?.message)
      setMetaData(meta)
    } catch (err) {
      console.error(err)
      onDataSuccess?.(undefined, 'Error!')
    } finally {
      setLoading?.(false)
    }
  }

  return {
    metaData,
    page,
    setPage,
    createNewItem,
    createNewItems,
    getItemByPk,
    getItemBy,
    getListItems,
    updateItemByPk,
    updateItemBy,
    updateItemsBy,
    deleteItemByPk,
    deleteItemBy,
    sortedListItems,
    createOrUpdateItemBy,
    createOrUpdateItemByPk
  }
}

export async function serviceActionUpdate<T extends { id?: number }>(
  query: {
    field: string
    key: React.Key
  },
  service: APIService<ItemWithId>,
  itemToUpdate: Partial<T>,
  setLoading?: (enable: boolean) => void,
  onDataSuccess?: (data: ResponseDataType | undefined, message: string) => void
) {
  try {
    setLoading?.(true)
    const itemUpdated =
      query.field === 'id'
        ? await service.updateItemByPk(Number(query.key), { ...itemToUpdate })
        : await service.updateItemBy(query, { ...itemToUpdate })
    if (itemUpdated?.success) {
      onDataSuccess?.(itemUpdated, 'Updated!')
    } else {
      onDataSuccess?.(itemUpdated, 'Update failed!')
    }
  } catch (err) {
    console.log(err)
    setLoading?.(false)
  } finally {
    setLoading?.(false)
  }
}
