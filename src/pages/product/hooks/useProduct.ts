import { FormInstance } from 'antd'
import { useState } from 'react'
import ProductAPI from '~/api/services/ProductAPI'
import { Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'

export default function useProduct() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [admin, setAdmin] = useState<boolean>(false)

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
          setOpenAddNewModal(false)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return {
    admin,
    setAdmin,
    loading,
    setLoading,
    handleAddNew,
    openModal,
    setOpenModal,
    searchText,
    setSearchText
  }
}
