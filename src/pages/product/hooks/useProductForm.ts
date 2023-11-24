/* eslint-disable @typescript-eslint/no-unused-vars */
import { SelectProps } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import { Print, Product } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'

export default function useProductForm() {
  const [product, setProduct] = useState<Product>({
    dateInputNPL: dayjs(Date.now()).format(DatePattern.input),
    dateOutputFCR: dayjs(Date.now()).format(DatePattern.input)
  })
  const [prints, setPrints] = useState<Print[]>([])
  const [printableSelected, setPrintableSelected] = useState<Print[]>([])
  const [dateInputValue, setDateInputValue] = useState(() => dayjs(Date.now()))
  const [dateInputSelectedValue, setDateInputSelectedValue] = useState(() => dayjs(Date.now()))
  const [dateOutputValue, setDateOutputValue] = useState(() => dayjs(Date.now()))
  const [dateOutputSelectedValue, setDateOutputSelectedValue] = useState(() => dayjs(Date.now()))

  useEffect(() => {
    setProduct({
      ...product,
      dateOutputFCR: dateOutputSelectedValue.format(DatePattern.input),
      dateInputNPL: dateInputSelectedValue.format(DatePattern.input)
    })
  }, [dateInputValue, dateOutputValue, dateInputSelectedValue, dateOutputSelectedValue])

  const onSelectDateInputNPL = (newValue: Dayjs) => {
    setDateInputValue(newValue)
    setDateInputSelectedValue(newValue)
  }

  const onPanelChangeDateInputNPL = (newValue: Dayjs) => {
    setDateInputValue(newValue)
  }

  const onSelectDateOutputFCR = (newValue: Dayjs) => {
    setDateOutputSelectedValue(newValue)
    setDateOutputValue(newValue)
  }

  const onPanelChangeDateOutputFCR = (newValue: Dayjs) => {
    setDateOutputValue(newValue)
  }

  const options: SelectProps['options'] = prints.map((item) => {
    return { label: item.name, value: item.printID, desc: item.name }
  })

  const handleChangeSelector = (_value: string[], option: DefaultOptionType | DefaultOptionType[]) => {
    setPrintableSelected(
      option.map((item: DefaultOptionType) => {
        return { printID: item.value, name: item.label } as Print
      })
    )
    console.log(option)
  }

  const handleOk = (setLoading: (enable: boolean) => void) => {
    ProductAPI.createNew(product)
      .then((res) => {
        setLoading(true)
        if (res?.isSuccess) {
          const parseProduct = res.data as Product
          const dataRequest = printableSelected.map((printable) => {
            return {
              printID: printable.printID,
              productID: parseProduct.productID!,
              name: printable.name
            }
          })
          PrintablePlaceAPI.createNew(dataRequest).then((res2) => {
            if (res2?.isSuccess) {
              console.log(res2)
            }
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleCancel = () => {}

  return {
    product,
    options,
    setProduct,
    prints,
    setPrints,
    dateInputValue,
    dateOutputValue,
    onSelectDateInputNPL,
    onSelectDateOutputFCR,
    onPanelChangeDateInputNPL,
    onPanelChangeDateOutputFCR,
    handleChangeSelector,
    handleOk,
    handleCancel
  }
}
