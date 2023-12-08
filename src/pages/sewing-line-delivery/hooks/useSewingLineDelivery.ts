import { FormInstance } from 'antd'
import { useState } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import SewingLineDeliveryAPI from '~/api/services/SewingLineAPI'
import { SewingLineDelivery, SortDirection } from '~/typing'

export default function useSewingLineDelivery() {
  const [metaData, setMetaData] = useState<ResponseDataType>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dateCreation, setDateCreation] = useState<boolean>(true)

  const handleAddNew = async (
    form: FormInstance<SewingLineDelivery>,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    const row = await form.validateFields()
    const newRow: SewingLineDelivery = {
      ...row,
      status: 'active'
    }
    console.log(row)
    await SewingLineDeliveryAPI.createNewItem(newRow)
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

  const getDataList = async (
    params: RequestBodyType,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    const body: RequestBodyType = {
      ...defaultRequestBody,
      ...params
    }
    await SewingLineDeliveryAPI.getItems(body)
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
    await getDataList(body, (meta) => {
      if (meta?.success) {
        onSuccess?.(meta)
      }
    })
  }

  const handleUpdateItem = async (
    id: number,
    itemToUpdate: SewingLineDelivery,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    await SewingLineDeliveryAPI.updateItemByID(id, itemToUpdate)
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
    await SewingLineDeliveryAPI.updateItemByID(id, { status: 'deleted' })
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
    getDataList,
    handleUpdateItem,
    handleDeleteItem,
    handleAddNew,
    handleSorted
  }
}
