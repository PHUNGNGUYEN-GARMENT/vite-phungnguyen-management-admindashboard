import { SelectProps } from 'antd'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { Print, Product } from '~/typing'

export default function useProductForm() {
  const [product, setProduct] = useState<Product>({})
  const [prints, setPrints] = useState<Print[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateInputNPLSelectedValue, setDateInputNPLSelectedValue] = useState<Date | string>()
  const [dateInputNPLValue, setDateInputNPLValue] = useState<Date | string>()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateOutputFCRSelectedValue, setDateOutputFCRSelectedValue] = useState<Date | string>()
  const [dateOutputFCRValue, setDateOutputFCRValue] = useState<Date | string>()

  const onSelectDateInputNPL = (newValue: Dayjs) => {
    setDateInputNPLValue(newValue.format('YYYY-MM-DD HH:mm:ss'))
    setDateInputNPLSelectedValue(newValue.format('YYYY-MM-DD HH:mm:ss'))
    setProduct({ ...product, dateInputNPL: newValue.format('YYYY-MM-DD HH:mm:ss') })
  }

  const onPanelChangeDateInputNPL = (newValue: Dayjs) => {
    setDateInputNPLValue(newValue.format('YYYY-MM-DD HH:mm:ss'))
    console.log('onPanelChangeDateInputNPL', newValue.format('YYYY-MM-DD HH:mm:ss'))
  }

  const onSelectDateOutputFCR = (newValue: Dayjs) => {
    setDateOutputFCRValue(newValue)
    setDateOutputFCRSelectedValue(newValue)
    setProduct({ ...product, dateOutputFCR: newValue.format() })
    console.log('onSelectDateOutputFCR', newValue.format('YYYY-MM-DD HH:mm:ss'))
  }

  const onPanelChangeDateOutputFCR = (newValue: Dayjs) => {
    setDateInputNPLValue(newValue)
    console.log('onPanelChangeDateOutputFCR', newValue.format('YYYY-MM-DD HH:mm:ss'))
  }

  // const options: SelectProps['options'] =

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
    // setSelectedValue(value)
  }

  return {
    product,
    options,
    setProduct,
    prints,
    setPrints,
    dateInputNPLValue,
    dateOutputFCRValue,
    onSelectDateInputNPL,
    onSelectDateOutputFCR,
    onPanelChangeDateInputNPL,
    onPanelChangeDateOutputFCR,
    handleChangeSelector
  }
}
