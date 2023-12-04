import { FormInstance } from 'antd'
import { useState } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import { Product, SortDirection } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'

export default function useProduct() {
  const [metaData, setMetaData] = useState<ResponseDataType>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleAddNew = async (
    form: FormInstance<Product>,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    const row = await form.validateFields()
    // setLoading(true)
    const productConverted = {
      ...row,
      status: 'active',
      dateOutputFCR: DayJS(row.dateOutputFCR).format(DatePattern.iso8601),
      dateInputNPL: DayJS(row.dateOutputFCR).format(DatePattern.iso8601)
    } as Product
    await ProductAPI.createNewItem(productConverted)
      .then((meta) => {
        setLoading(true)
        if (meta?.success) {
          onSuccess?.(meta)
          setMetaData(meta)
          setOpenModal(false)
        }
      })
      .finally(() => {
        setLoading(false)
      })
    setLoading(false)
  }

  const getProductList = async (
    params: RequestBodyType,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    const body: RequestBodyType = {
      ...defaultRequestBody,
      ...params
    }
    await ProductAPI.getItems(body)
      .then((data) => {
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
    await getProductList(body, (meta) => {
      if (meta?.success) {
        onSuccess?.(meta)
      }
    })
  }

  const handleUpdateItem = async (
    id: number,
    productToUpdate: Product,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    await ProductAPI.updateItemByID(id, productToUpdate)
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
    await ProductAPI.updateItemByID(id, { status: 'deleted' })
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
    loading,
    setLoading,
    handleAddNew,
    openModal,
    setOpenModal,
    searchText,
    setSearchText,
    getProductList,
    handleUpdateItem,
    handleDeleteItem,
    handleSorted
  }
}
