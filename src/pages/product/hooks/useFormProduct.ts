import { SelectProps } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import { Product } from '~/typing'

export default function useFormProduct() {
  const [selfProduct, setSelfProduct] = useState<Product>({})
  const [dateInputNPLSelectedValue, setDateInputNPLSelectedValue] = useState(() => dayjs(Date.now()))
  const [dateInputNPLValue, setDateInputNPLValue] = useState(() => dayjs('2017-01-25'))

  const [dateOutputFCRSelectedValue, setDateOutputFCRSelectedValue] = useState(() => dayjs(Date.now()))
  const [dateOutputFCRValue, setDateOutputFCRValue] = useState(() => dayjs('2017-01-25'))

  const onSelectDateInputNPL = (newValue: Dayjs) => {
    setDateInputNPLValue(newValue)
    setDateInputNPLSelectedValue(newValue)
    console.log(newValue)
  }

  const onPanelChangeDateInputNPL = (newValue: Dayjs) => {
    setDateInputNPLValue(newValue)
  }

  const onSelectDateOutputFCR = (newValue: Dayjs) => {
    setDateOutputFCRValue(newValue)
    setDateOutputFCRSelectedValue(newValue)
    console.log(newValue)
  }

  const onPanelChangeDateOutputFCR = (newValue: Dayjs) => {
    setDateInputNPLValue(newValue)
  }

  const options: SelectProps['options'] = []

  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i
    })
  }

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`)
  }

  return {
    selfProduct,
    setSelfProduct,
    dateInputNPLSelectedValue,
    setPrints,
    openModal,
    setOpenModal
  }
}
