/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Input, InputNumber, Select, Table } from 'antd'
import dayjs from 'dayjs'
import { memo, useEffect } from 'react'
import useMultipleSelector from '~/components/hooks/useMultipleSelector'
import { ProductTableDataType } from '../ProductPage'
import useProductForm from '../hooks/useProductForm'

type InputType = 'select' | 'text' | 'number' | 'datepicker' | 'view'

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
  const { prints, product, setProduct } = useProductForm()
  const { options, onChangeSelector, values, setValues } = useMultipleSelector()
  useEffect(() => {
    if (record) {
      setProduct({
        productID: record.productID,
        productCode: record.productCode,
        quantityPO: record.quantityPO,
        dateInputNPL: record.dateInputNPL,
        dateOutputFCR: record.dateOutputFCR
      })
      if (prints && prints.length > 0 && record.prints.length > 0) {
        const items = prints.filter(
          (item) => !record.prints.includes(item.name)
        )
        console.log(record.prints)
        setValues(
          record.prints.map((item) => {
            return `${item}`
          })
        )
      }
    }
  }, [record])

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
        onChange={onChangeSelector}
        optionLabelProp='label'
        labelInValue={true}
        defaultValue={values}
        options={options(
          prints && prints.length > 0
            ? prints.map((item) => {
                return {
                  value: `${item.printID}`,
                  label: item.name,
                  desc: item.name
                }
              })
            : []
        )}
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
    ),
    view: <>{product.productID}</>
  }

  const inputNode: React.ReactNode =
    inputTypeComponentMap[inputType] || inputTypeComponentMap['default']

  return <td {...restProps}>{editing ? <>{inputNode}</> : children}</td>
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(EditableCell)
