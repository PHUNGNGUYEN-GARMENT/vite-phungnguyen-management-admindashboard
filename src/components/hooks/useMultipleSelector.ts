import { DefaultOptionType } from 'antd/es/select'
import { useState } from 'react'

const useMultipleSelector = () => {
  const [values, setValues] = useState<string[]>([])
  const [option, setOption] = useState<{
    value: string
    label: string
    desc: string
    emoji?: string
  }>()

  const options = (
    items: {
      value: string
      label: string
      desc: string
      emoji?: string
    }[]
  ) => {
    return items
  }

  const onChangeSelector = (
    _values: string[],
    option: DefaultOptionType | DefaultOptionType[]
  ) => {
    setValues(_values)
    console.log(option)
  }

  return {
    options,
    values,
    setValues,
    option,
    setOption,
    onChangeSelector
  }
}

export default useMultipleSelector
