import { FormInstance } from 'antd'
import { useState } from 'react'
import { ResponseDataType } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import { Product } from '~/typing'
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
      dateOutputFCR: DayJS(row.dateOutputFCR).format(DatePattern.iso8601),
      dateInputNPL: DayJS(row.dateOutputFCR).format(DatePattern.iso8601)
    } as Product
    await ProductAPI.createNew(productConverted).then((data) => {
      if (data?.success) {
        onSuccess?.(data)
        setOpenModal(false)
        console.log(data)
      }
    })
    setLoading(false)
  }

  const fetchDataList = async (
    current?: number,
    pageSize?: number,
    setLoading?: (enable: boolean) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (data: any) => void
  ) => {
    await ProductAPI.getAlls({
      filter: {
        status: 'active',
        items: [-1]
      },
      paginator: {
        page: current ?? 1,
        pageSize: pageSize ?? 5
      },
      searchTerm: '',
      sorting: {
        column: 'id',
        direction: 'asc'
      }
    })
      .then((data) => {
        setLoading?.(true)
        if (data?.success) {
          setMetaData(data)
          onSuccess?.(data)
          // console.log(data)
        }
      })
      .finally(() => {
        setLoading?.(false)
      })
  }

  const querySearchData = async (
    searchText: string,
    onSuccess?: (data: ResponseDataType) => void
  ) => {
    if (searchText.length !== 0) {
      await ProductAPI.getItemByCode(searchText).then((data) => {
        if (data?.success) {
          console.log(data)
          onSuccess?.(data)
          setMetaData(data)
        }
      })
    }
  }

  return {
    metaData,
    loading,
    setLoading,
    handleAddNew,
    openModal,
    setOpenModal,
    searchText,
    setSearchText,
    fetchDataList,
    querySearchData
  }
}
