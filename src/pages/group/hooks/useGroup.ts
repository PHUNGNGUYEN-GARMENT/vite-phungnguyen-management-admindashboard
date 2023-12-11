import { useState } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import GroupAPI from '~/api/services/GroupAPI'
import { Group, SortDirection } from '~/typing'

export default function useGroup() {
  const [metaData, setMetaData] = useState<ResponseDataType>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [dateCreation, setDateCreation] = useState<boolean>(true)

  const handleAddNewItem = async (
    itemNew: Group,
    onDataSuccess?: (
      data: ResponseDataType | undefined,
      status: boolean
    ) => void
  ) => {
    setLoading(true)
    await GroupAPI.createNewItem(itemNew)
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
      .finally(() => {
        setLoading(false)
        setOpenModal(false)
      })
  }

  const getDataList = async (
    params: RequestBodyType,
    onDataSuccess?: (
      data: ResponseDataType | undefined,
      status: boolean
    ) => void
  ) => {
    setLoading(true)
    const body: RequestBodyType = {
      ...defaultRequestBody,
      ...params
    }
    await GroupAPI.getItems(body)
      .then((meta) => {
        if (meta?.success) {
          console.log(meta)
          setMetaData(meta)
          onDataSuccess?.(meta, true)
        }
      })
      .catch((err) => {
        console.log(err)
        onDataSuccess?.(undefined, false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleSorted = async (
    direction: SortDirection,
    onDataSuccess?: (
      data: ResponseDataType | undefined,
      status: boolean
    ) => void
  ) => {
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
    await getDataList(body, onDataSuccess)
  }

  const handleUpdateItem = async (
    id: number,
    itemToUpdate: Group,
    onDataSuccess?: (
      data: ResponseDataType | undefined,
      status: boolean
    ) => void
  ) => {
    setLoading(true)
    GroupAPI.updateItemByPk(id, itemToUpdate)
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
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDeleteItem = async (
    id: number,
    onDataSuccess?: (
      data: ResponseDataType | undefined,
      status: boolean
    ) => void
  ) => {
    setLoading(true)
    await GroupAPI.updateItemByPk(id, { status: 'deleted' })
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
      .finally(() => {
        setLoading(false)
      })
  }

  const handlePermanentlyDeleteItem = async (
    id: number,
    onDataSuccess?: (
      data: ResponseDataType | undefined,
      status: boolean
    ) => void
  ) => {
    setLoading(true)
    await GroupAPI.deleteItemByPk(id)
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
      .finally(() => {
        setLoading(false)
      })
  }

  return {
    page,
    setPage,
    metaData,
    setMetaData,
    dateCreation,
    setDateCreation,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    getDataList,
    handleUpdateItem,
    handleDeleteItem,
    handleAddNewItem,
    handleSorted,
    handlePermanentlyDeleteItem
  }
}
