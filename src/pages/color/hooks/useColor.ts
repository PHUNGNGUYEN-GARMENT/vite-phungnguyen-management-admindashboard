import { FormInstance } from 'antd'
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
  const [searchText, setSearchText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dateCreation, setDateCreation] = useState<boolean>(true)

  const handleAddNew = async (
    form: FormInstance<Color>,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    const row = await form.validateFields()
    // setLoading(true)
    const colorConverted = {
      ...row,
      status: 'active'
    } as Color
    await ColorAPI.createNewItem(colorConverted)
      .then((meta) => {
        setLoading(true)
        if (meta?.success) {
          onSuccess?.(meta)
          setOpenModal(false)
        }
      })
      .finally(() => {
        setLoading(false)
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
    ColorToUpdate: Color,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    await ColorAPI.updateItemByID(id, ColorToUpdate)
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

  const handleDeleteItem = async (
    id: number,
    onSuccess?: (meta: ResponseDataType) => void
  ) => {
    setLoading(true)
    await ColorAPI.updateItemByID(id, { status: 'deleted' })
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
    searchText,
    setSearchText,
    getColorList,
    handleUpdateItem,
    handleDeleteItem,
    handleAddNew,
    handleSorted
  }
}
