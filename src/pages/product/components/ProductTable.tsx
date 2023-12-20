/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex, List, Table, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { ResponseDataType } from '~/api/client'
import { TableCellProps, TableItemWithKey } from '~/components/hooks/useTable'
import ProgressBar from '~/components/ui/ProgressBar'
import { ColumnTypes } from '~/components/ui/Table/EditableCell'
import ItemAction from '~/components/ui/Table/ItemAction'
import { RootState } from '~/store/store'
import { InputType } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'
import EditableCell from './EditableCell'

interface Props extends React.HTMLAttributes<HTMLElement> {
  loading: boolean
  setLoading: (enable: boolean) => void
  metaData: ResponseDataType | undefined
  dataSource: TableItemWithKey<ProductTableDataType>[]
  dateCreation: boolean
  editingKey: React.Key
  isEditing: (key: React.Key) => boolean
  onPageChange: (page: number, pageSize: number) => void
  onConfirmDelete: (item: TableItemWithKey<ProductTableDataType>) => void
  setDeleteKey: (value: React.SetStateAction<React.Key>) => void
  onSaveClick: (item: TableItemWithKey<ProductTableDataType>) => void
  onStartEditing: (key: React.Key) => void
  onConfirmCancelEditing: () => void
  onConfirmCancelDeleting: () => void
}

const ProductTable: React.FC<Props> = ({ ...props }) => {
  const user = useSelector((state: RootState) => state.user)
  console.log('Product page loading...')

  const actionsCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Operation',
      width: '1%',
      dataIndex: 'operation',
      render: (_value: any, item: TableItemWithKey<ProductTableDataType>) => {
        return (
          <>
            <ItemAction
              isEditing={props.isEditing(item.key!)}
              editingKey={props.editingKey}
              onSaveClick={() => {
                console.log(item)
                props.onSaveClick(item)
              }}
              onClickStartEditing={() => props.onStartEditing(item.key!)}
              onConfirmCancelEditing={() => props.onConfirmCancelEditing()}
              onConfirmCancelDeleting={() => props.onConfirmCancelDeleting()}
              onConfirmDelete={() => props.onConfirmDelete(item)}
              onStartDeleting={() => props.setDeleteKey(item.key!)}
            />
          </>
        )
      }
    }
  ]

  const commonCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      editable: user.isAdmin,
      required: true,
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
            {record.productCode}
          </Typography.Text>
        )
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      editable: true,
      required: true
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      required: true,
      editable: true,
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <Flex className='' align='center' vertical gap={5}>
            <span>{record.productColor?.color?.name}</span>
            <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled showText />
          </Flex>
        )
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '10%',
      required: false,
      editable: true,
      render: (_value: any, record: ProductTableDataType) => {
        return <span>{record.productGroup?.group?.name}</span>
      }
    },
    {
      title: 'Nơi in',
      dataIndex: 'printID',
      width: '15%',
      required: false,
      editable: true,
      render: (_value: any, record: ProductTableDataType) => {
        return <span>{record.printablePlace?.print?.name}</span>
      }
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      width: '',
      render: (_value: any, record: ProductTableDataType) => {
        const progressArr: { task: string; quantity: number }[] = [
          {
            task: 'May',
            quantity: record.progress?.sewing ?? 0
          },
          {
            task: 'Ủi',
            quantity: record.progress?.iron ?? 0
          },
          {
            task: 'Kiểm',
            quantity: record.progress?.check ?? 0
          },
          {
            task: 'Hoàn thành',
            quantity: record.progress?.pack ?? 0
          }
        ]
        return (
          <Flex vertical>
            <List className='list-none'>
              {progressArr.map((item, index) => {
                return (
                  <List.Item key={index} className='m-0 p-0'>
                    <Flex className='m-0 w-full p-0'>
                      <Typography.Text className='m-0 w-16 flex-shrink-0 p-0'>{item.task}</Typography.Text>
                      <Flex className='w-full' align='center' vertical>
                        <ProgressBar count={item.quantity ?? 0} total={record.quantityPO ?? 0} />
                        <Typography.Text type='secondary' className='w-24 font-medium'>
                          {item.quantity ?? 0}/{record.quantityPO ?? 0}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </List.Item>
                )
              })}
            </List>
          </Flex>
        )
      }
    },
    {
      title: 'NPL',
      dataIndex: 'dateInputNPL',
      width: '10%',
      editable: true,
      required: true,
      render: (_value: any, record: ProductTableDataType) => {
        return <span>{DayJS(record.dateInputNPL).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'FCR',
      dataIndex: 'dateOutputFCR',
      width: '10%',
      editable: true,
      required: true,
      render: (_value: any, record: ProductTableDataType) => {
        return <span>{DayJS(record.dateOutputFCR).format(DatePattern.display)}</span>
      }
    }
  ]

  const dateCreationColumns: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '5%',
      render: (_value: any, record: ProductTableDataType) => {
        return <span>{DayJS(record.createdAt).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '5%',
      responsive: ['md'],
      render: (_value: any, record: ProductTableDataType) => {
        return <span>{DayJS(record.updatedAt).format(DatePattern.display)}</span>
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & TableCellProps)[] = props.dateCreation
    ? [...commonCols, ...dateCreationColumns, ...actionsCols]
    : [...commonCols, ...actionsCols]

  const staffColumns: (ColumnTypes[number] & TableCellProps)[] = [...commonCols]

  const mergedColumns = (cols: (ColumnTypes[number] & TableCellProps)[]): ColumnTypes => {
    return cols.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record: ProductTableDataType) => ({
          record: record,
          inputType: onCellColumnType(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          initialValue: smartInitialValue(col.dataIndex, record),
          editing: props.isEditing(record.key!),
          required: col.required,
          setLoading: props.setLoading
        })
      }
    }) as ColumnTypes
  }

  const smartInitialValue = (dataIndex: string, record: ProductTableDataType): any => {
    const valueMapping: Record<string, any> = {
      productCode: record.productCode,
      quantityPO: record.quantityPO,
      groupID: record.productGroup?.groupID,
      colorID: record.productColor?.colorID,
      printID: record.printablePlace?.printID,
      dateInputNPL: DayJS(record.dateInputNPL),
      dateOutputFCR: DayJS(record.dateOutputFCR)
    }

    return valueMapping[dataIndex]
  }

  const onCellColumnType = (dataIndex: string): InputType => {
    const typeMapping: Record<string, InputType> = {
      productCode: 'text',
      groupID: 'select',
      colorID: 'select',
      printID: 'select',
      quantityPO: 'number',
      dateInputNPL: 'datepicker',
      dateOutputFCR: 'datepicker'
    }

    return typeMapping[dataIndex] || 'text'
  }

  return (
    <>
      <Table
        loading={props.loading}
        components={{
          body: {
            cell: EditableCell
          }
        }}
        dataSource={props.dataSource}
        bordered
        // expandable={{
        //   expandedRowRender: (record) => <p className='m-0'>123456789</p>,
        //   rowExpandable: (record) => record.name !== 'Not Expandable',
        //   defaultExpandAllRows: true
        // }}
        columns={mergedColumns(user.isAdmin ? adminColumns : staffColumns)}
        rowClassName='editable-row'
        pagination={{
          onChange: props.onPageChange,
          current: props.metaData?.page,
          pageSize: 5,
          total: props.metaData?.total
        }}
      />
    </>
  )
}

export default ProductTable
