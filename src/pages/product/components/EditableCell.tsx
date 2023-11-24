/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Input, InputNumber, Select, Table } from 'antd'
import dayjs from 'dayjs'
import { memo, useEffect } from 'react'
import { ProductTableDataType } from '../ProductPage'
import useProductForm from '../hooks/useProductForm'

type InputType = 'select' | 'text' | 'number' | 'datepicker'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: InputType
  record: ProductTableDataType
  index: number
  children: React.ReactNode
}

export type EditableTableProps = Parameters<typeof Table>[0]

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  record,
  inputType,
  children,
  ...restProps
}) => {
  const { prints, options, product, setProduct, handleChangeSelector } =
    useProductForm()
  useEffect(() => {
    if (record) {
      setProduct({
        productCode: record.productCode,
        quantityPO: record.quantityPO,
        dateInputNPL: record.dateInputNPL,
        dateOutputFCR: record.dateOutputFCR
      })
      console.log(record)
    }
  }, [])

  const inputTypeComponentMap: Record<string, React.ReactNode> = {
    number: (
      <InputNumber
        className='w-full'
        value={product.quantityPO}
        onChange={(value) => {
          console.log(value)
          if (value) {
            setProduct({ ...product, quantityPO: value })
          }
        }}
        placeholder='Quantity po..'
      />
    ),
    text: (
      <Input
        value={product.productCode}
        onChange={(e) => {
          if (e.target.value) {
            setProduct({ ...product, productCode: e.target.value })
          }
        }}
      />
    ),
    select: (
      <Select
        mode='multiple'
        allowClear
        placeholder='Please select'
        onChange={handleChangeSelector}
        optionLabelProp='label'
        // options={options(
        //   record.prints.map((item) => {
        //     return {
        //       value: item,
        //       label:
        //         prints.length > 0
        //           ? prints.find((i) => i.name === item)?.name ?? ''
        //           : item
        //     }
        //   })
        // )}
        className='w-full'
        style={{
          width: '100%'
        }}
      />
    ),
    datepicker: (
      <DatePicker
        defaultValue={dayjs(
          dataIndex === 'dateInputNPL'
            ? product.dateInputNPL
            : product.dateOutputFCR
        )}
      />
    )
  }

  const inputNode: React.ReactNode =
    inputTypeComponentMap[inputType] || inputTypeComponentMap['default']

  return <td {...restProps}>{editing ? <>{inputNode}</> : children}</td>
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(EditableCell)
