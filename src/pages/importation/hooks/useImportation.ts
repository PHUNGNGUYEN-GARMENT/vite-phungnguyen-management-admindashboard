import { FormInstance } from 'antd'
import { useState } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import { Importation, SortDirection } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'

export default function useImportation() {
  const [metaData, setMetaData] = useState<ResponseDataType>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dateCreation, setDateCreation] = useState<boolean>(true)

  const handleAddNew = async (
    form: FormInstance<Importation>,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    setLoading(true)
    const row = await form.validateFields()
    const newRow: Importation = {
      ...row,
      status: 'active'
    }
    console.log(row)
    await ImportationAPI.createNewItem(newRow)
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
    await ImportationAPI.getItems(body)
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

  const handleSaveUpdateItem = async (
    key: number,
    row: Importation,
    onSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      console.log({
        ...row,
        date: DayJS(row.dateImported).format(DatePattern.display)
      })

      const itemFound = await ImportationAPI.getItemByProductID(key)

      const importationData = {
        quantity: row.quantity,
        dateImported: DayJS(row.dateImported).format(DatePattern.iso8601)
      }

      if (itemFound) {
        const importationFound: Importation = itemFound.data
        ImportationAPI.updateItemByID(
          importationFound.id!,
          importationData
        ).then((meta) => onSuccess?.(meta))
      } else {
        ImportationAPI.createNewItem({
          ...importationData,
          productID: key,
          status: 'active'
        }).then((meta) => onSuccess?.(meta))
      }
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (
    id: number,
    onSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    setLoading(true)
    await ImportationAPI.updateItemByID(id, { status: 'deleted' })
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
    handleSaveUpdateItem,
    handleDeleteItem,
    handleAddNew,
    handleSorted
  }
}
