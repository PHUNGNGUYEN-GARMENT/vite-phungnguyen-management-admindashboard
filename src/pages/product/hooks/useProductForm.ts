import { SelectProps } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import ProductAPI from '~/api/services/ProductAPI'
import { Product } from '~/typing'

export default function useProductForm() {
  const [product, setProduct] = useState<Product>({})
  const [selectedValue, setSelectedValue] = useState<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateInputNPLSelectedValue, setDateInputNPLSelectedValue] = useState(() => dayjs(Date.now()))
  const [dateInputNPLValue, setDateInputNPLValue] = useState(() => dayjs(Date.now()))

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateOutputFCRSelectedValue, setDateOutputFCRSelectedValue] = useState(() => dayjs(Date.now()))
  const [dateOutputFCRValue, setDateOutputFCRValue] = useState(() => dayjs(Date.now()))

  const onSelectDateInputNPL = (newValue: Dayjs) => {
    setDateInputNPLValue(newValue)
    setDateInputNPLSelectedValue(newValue)
    setProduct({ ...product, dateInputNPL: newValue.format() })
    console.log('onSelectDateInputNPL', newValue.format())
  }

  const onPanelChangeDateInputNPL = (newValue: Dayjs) => {
    setDateInputNPLValue(newValue)
    console.log('onPanelChangeDateInputNPL', newValue.format())
  }

  const onSelectDateOutputFCR = (newValue: Dayjs) => {
    setDateOutputFCRValue(newValue)
    setDateOutputFCRSelectedValue(newValue)
    setProduct({ ...product, dateOutputFCR: newValue.format() })
    console.log('onSelectDateOutputFCR', newValue.format())
  }

  const onPanelChangeDateOutputFCR = (newValue: Dayjs) => {
    setDateInputNPLValue(newValue)
    console.log('onPanelChangeDateOutputFCR', newValue.format())
  }

  const options: SelectProps['options'] = [
    {
      label: 'China',
      value: 'china',
      emoji: '🇨🇳',
      desc: 'China (中国)'
    },
    {
      label: 'USA',
      value: 'usa',
      emoji: '🇺🇸',
      desc: 'USA (美国)'
    },
    {
      label: 'Japan',
      value: 'japan',
      emoji: '🇯🇵',
      desc: 'Japan (日本)'
    },
    {
      label: 'Korea',
      value: 'korea',
      emoji: '🇰🇷',
      desc: 'Korea (韩国)'
    }
  ]

  const handleChangeSelector = (value: string[]) => {
    setSelectedValue(value)
  }

  const handleOk = () => {
    ProductAPI.createNew({
      ...product,
      dateInputNPL: dateInputNPLValue,
      dateOutputFCR: dateOutputFCRValue
    }).then((res) => {
      // PrintablePlaceAPI.createNew()
      console.log(res?.data)
    })
    // console.log({
    //   ...product,
    //   dateInputNPL: dateInputNPLValue.format(),
    //   dateOutputFCR: dateOutputFCRValue.format(),
    //   prints: selectedValue
    // })
  }

  const handleCancel = () => {}

  return {
    product,
    options,
    setProduct,
    selectedValue,
    dateInputNPLValue,
    dateOutputFCRValue,
    onSelectDateInputNPL,
    onSelectDateOutputFCR,
    onPanelChangeDateInputNPL,
    onPanelChangeDateOutputFCR,
    handleChangeSelector,
    handleOk,
    handleCancel
  }
}
