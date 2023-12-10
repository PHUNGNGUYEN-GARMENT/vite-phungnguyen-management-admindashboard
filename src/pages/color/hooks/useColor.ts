import { useState } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import { Color, SortDirection } from '~/typing'

export default function useColor() {
  const [metaData, setMetaData] = useState<ResponseDataType>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  // const [searchText, setSearchText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dateCreation, setDateCreation] = useState<boolean>(true)

  const handleAddNewItem = async (
    itemNew: Color,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    await ColorAPI.createNewItem(itemNew)
      .then((meta) => {
        setLoading(true)
        if (meta?.success) {
          onSuccess?.(meta)
        }
      })
      .finally(() => {
        setLoading(false)
        setOpenModal(false)
      })
    setLoading(false)
  }

  const getColorList = async (
    params: RequestBodyType,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    const body: RequestBodyType = {
      ...defaultRequestBody,
      ...params
    }
    await ColorAPI.getItems(body)
      .then((data) => {
        console.log(data)
        if (data?.success) {
          setMetaData(data)
          onSuccess?.(data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
    setLoading(false)
  }

  const handleSorted = async (
    direction: SortDirection,
    onSuccess?: (meta: ResponseDataType) => void
  ) => {
    const body: RequestBodyType = {
      ...defaultRequestBody,
      sorting: {
        column: 'id',
        direction: direction
      }
    }
    await getColorList(body, (meta) => {
      if (meta?.success) {
        onSuccess?.(meta)
      }
    })
  }

  const handleUpdateItem = async (
    id: number,
    itemToUpdate: Color,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    await ColorAPI.updateItemByPk(id, itemToUpdate)
      .then((meta) => {
        if (meta?.success) {
          setLoading(true)
          onSuccess?.(meta)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDeleteItem = async (
    id: number,
    onSuccess?: (meta: ResponseDataType) => void
  ) => {
    setLoading(true)
    await ColorAPI.updateItemByPk(id, { status: 'deleted' })
      .then((meta) => {
        if (meta?.success) {
          setLoading(true)
          onSuccess?.(meta)
        }
      })
      .finally(() => {
        setLoading(false)
      })
    setLoading(false)
  }

  return {
    metaData,
    setMetaData,
    dateCreation,
    setDateCreation,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    // searchText,
    // setSearchText,
    getColorList,
    handleUpdateItem,
    handleDeleteItem,
    handleAddNewItem,
    handleSorted
  }
}
