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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddNew = async (form: FormInstance<any>) => {
    const row = await form.validateFields()
    // setLoading(true)
    const productConverted = {
      ...row,
      dateOutputFCR: DayJS(row.dateOutputFCR).format(DatePattern.iso8601),
      dateInputNPL: DayJS(row.dateOutputFCR).format(DatePattern.iso8601)
    } as Product
    console.log(row)
    ProductAPI.createNew(productConverted)
      .then((data) => {
        setLoading(true)
        if (data?.success) {
          setOpenModal(false)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchDataList = (
    current?: number,
    pageSize?: number,
    setLoading?: (enable: boolean) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (data: any) => void
  ) => {
    ProductAPI.getAlls(current, pageSize)
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

  const querySearchData = (searchText: string) => {
    if (searchText.length !== 0) {
      ProductAPI.getItemByCode(searchText).then((data) => {
        console.log(data)
        if (data?.success) {
          console.log(data)
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
