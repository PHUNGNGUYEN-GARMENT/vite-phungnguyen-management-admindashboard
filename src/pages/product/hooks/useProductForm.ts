/* eslint-disable @typescript-eslint/no-unused-vars */
import { SelectProps } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import { Print, Product } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'

export default function useProductForm() {
  const [product, setProduct] = useState<Product>({})
  const [prints, setPrints] = useState<Print[]>([])
  const [printSelected, setPrintSelected] = useState<string[]>([])
  const [dateInputNPL, setDateInputNPL] = useState(() => dayjs(Date.now()))
  const [dateOutputFCR, setDateOutputFCR] = useState(() => dayjs(Date.now()))

  const onSelectDateInputNPL = (newValue: Dayjs) => {
    setDateInputNPL(newValue)
    setProduct({ ...product, dateInputNPL: new Date(newValue.format(DatePattern.input)) })
  }

  const onPanelChangeDateInputNPL = (newValue: Dayjs) => {
    setDateInputNPL(newValue)
    setProduct({ ...product, dateOutputFCR: new Date(newValue.format(DatePattern.input)) })
  }

  const onSelectDateOutputFCR = (newValue: Dayjs) => {
    setDateOutputFCR(newValue)
    setProduct({ ...product, dateOutputFCR: new Date(newValue.format(DatePattern.input)) })
  }

  const onPanelChangeDateOutputFCR = (newValue: Dayjs) => {
    setDateOutputFCR(newValue)
    setProduct({ ...product, dateOutputFCR: new Date(newValue.format(DatePattern.input)) })
  }

  const options: SelectProps['options'] = prints.map((item) => {
    return { label: item.name, value: item.printID, desc: item.name }
  })

  const handleChangeSelector = (value: string[]) => {
    setPrintSelected(value)
  }

  const handleOk = () => {
    console.log({
      product: product,
      prints: printSelected
    })
    ProductAPI.createNew({
      productCode: product.productCode,
      quantityPO: product.quantityPO,
      dateInputNPL: product.dateInputNPL,
      dateOutputFCR: product.dateOutputFCR
    }).then((res) => {
      if (res?.isSuccess) {
        const parseProduct = res.data as Product
        for (const val of printSelected) {
          PrintablePlaceAPI.createNew(parseInt(val), parseProduct.productID!).then((res2) => {
            console.log(res2)
          })
        }
      }
    })
  }

  const handleCancel = () => {}

  return {
    product,
    options,
    setProduct,
    prints,
    setPrints,
    dateInputNPL,
    dateOutputFCR,
    onSelectDateInputNPL,
    onSelectDateOutputFCR,
    onPanelChangeDateInputNPL,
    onPanelChangeDateOutputFCR,
    handleChangeSelector,
    handleOk,
    handleCancel
  }
}
