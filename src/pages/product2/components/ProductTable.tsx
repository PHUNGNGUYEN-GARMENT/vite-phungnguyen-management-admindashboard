/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex, Table, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import EditableCellNew from '~/components/sky-ui/Table/EditableCellNew'
import ItemAction from '~/components/sky-ui/Table/ItemAction'
import ListItemRow from '~/components/sky-ui/Table/ListItemRow'
import useAPIService from '~/hooks/useAPIService'
import { RootState } from '~/store/store'
import { Color, Group, Print } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'
import ProductProgressStatus from './ProductProgressStatus'

interface Props extends React.HTMLAttributes<HTMLElement> {
  loading: boolean
  setLoading: (enable: boolean) => void
  metaData: ResponseDataType | undefined
  dataSource: ProductTableDataType[]
  dateCreation: boolean
  editingKey: React.Key
  isEditing: (key: React.Key) => boolean
  onPageChange: (page: number, pageSize: number) => void
  onConfirmDelete: (item: ProductTableDataType) => void
  setDeleteKey: (value: React.SetStateAction<React.Key>) => void
  onSaveClick: (item: ProductTableDataType) => void
  onStartEditing: (key: React.Key) => void
  onConfirmCancelEditing: () => void
  onConfirmCancelDeleting: () => void
}

const ProductTable: React.FC<Props> = ({ ...props }) => {
  const user = useSelector((state: RootState) => state.user)
  console.log('Product page loading...')

  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Print>(PrintAPI)

  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (props.editingKey !== '') {
        await colorService.getListItems(defaultRequestBody, props.setLoading, (meta) => {
          if (meta?.success) {
            setColors(meta.data as Color[])
          }
        })
        await groupService.getListItems(defaultRequestBody, props.setLoading, (meta) => {
          if (meta?.success) {
            setGroups(meta.data as Group[])
          }
        })
        await printService.getListItems(defaultRequestBody, props.setLoading, (meta) => {
          if (meta?.success) {
            setPrints(meta.data as Print[])
          }
        })
      }
    }
    loadData()
  }, [props.editingKey])

  const actionsCols: ColumnType<ProductTableDataType>[] = [
    {
      title: 'Operation',
      width: '1%',
      dataIndex: 'operation',
      render: (_value: any, item: ProductTableDataType) => {
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

  const commonCols: ColumnType<ProductTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='productCode'
              title='Mã hàng'
              inputType='text'
              required={true}
              initialField={{ value: record.productCode }}
            >
              <Typography.Text className='text-md flex-shrink-0 font-bold'>{record.productCode}</Typography.Text>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
              initialField={{ value: record.quantityPO }}
            >
              <span>{record.quantityPO}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='colorID'
              title='Màu'
              inputType='select'
              required={true}
              initialField={{
                value: record.productColor?.colorID,
                selectItems: colors.map((i) => {
                  return { label: i.name, value: i.id, optionData: i.hexColor }
                })
              }}
            >
              <Flex className='' justify='space-between' align='center' gap={10}>
                <Typography.Text>{record.productColor?.color?.name}</Typography.Text>
                <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
              </Flex>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '10%',
      responsive: ['xl'],
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='groupID'
              title='Nhóm'
              inputType='select'
              required={true}
              initialField={{
                value: record.productGroup?.groupID,
                selectItems: groups.map((i) => {
                  return { label: i.name, value: i.id, optionData: i.id }
                })
              }}
            >
              <span>{record.productGroup?.group?.name}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Nơi in',
      dataIndex: 'printID',
      width: '10%',
      responsive: ['xxl'],
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='printID'
              title='Nơi in'
              inputType='select'
              required={true}
              initialField={{
                value: record.printablePlace?.printID,
                selectItems: prints.map((i) => {
                  return { label: i.name, value: i.id, optionData: i.id }
                })
              }}
            >
              <span>{record.printablePlace?.print?.name}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Tiến trình',
      dataIndex: 'progress',
      responsive: ['xxl'],
      width: 'auto',
      render: (_value: any, record: ProductTableDataType) => {
        return <ProductProgressStatus collapse={false} record={record} />
      }
    },
    {
      title: 'NPL',
      dataIndex: 'dateInputNPL',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='dateInputNPL'
              title='NPL'
              inputType='datepicker'
              required={true}
              initialField={{ value: DayJS(record.dateInputNPL) }}
            >
              <span>{DayJS(record.dateInputNPL).format(DatePattern.display)}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'FCR',
      dataIndex: 'dateOutputFCR',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='dateOutputFCR'
              title='FCR'
              inputType='datepicker'
              required={true}
              initialField={{ value: DayJS(record.dateOutputFCR) }}
            >
              <span>{DayJS(record.dateOutputFCR).format(DatePattern.display)}</span>
            </EditableCellNew>
          </>
        )
      }
    }
  ]

  const dateCreationColumns: ColumnType<ProductTableDataType>[] = [
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

  const adminColumns: ColumnType<ProductTableDataType>[] = props.dateCreation
    ? [...commonCols, ...dateCreationColumns, ...actionsCols]
    : [...commonCols, ...actionsCols]

  const staffColumns: ColumnType<ProductTableDataType>[] = [...commonCols]

  return (
    <>
      <Table
        loading={props.loading}
        bordered
        columns={user.isAdmin ? adminColumns : staffColumns}
        dataSource={props.dataSource}
        rowClassName='editable-row'
        pagination={{
          onChange: props.onPageChange,
          current: props.metaData?.page,
          pageSize: 5,
          total: props.metaData?.total
        }}
        expandable={{
          expandedRowRender: (record: ProductTableDataType) => {
            return (
              <Flex className='w-1/2' vertical gap={20}>
                <ListItemRow
                  label='Nhóm'
                  isEditing={props.isEditing(record.key!)}
                  dataIndex='groupID'
                  inputType='select'
                  initialField={{
                    value: record.productGroup?.groupID,
                    selectItems: groups.map((i) => {
                      return { label: i.name, value: i.id, optionData: i.id }
                    })
                  }}
                  className='xl:hidden'
                  value={record.productGroup?.group?.name}
                />
                <ListItemRow
                  label='Nơi in'
                  isEditing={props.isEditing(record.key!)}
                  dataIndex='printID'
                  inputType='select'
                  initialField={{
                    value: record.printablePlace?.printID,
                    selectItems: prints.map((i) => {
                      return { label: i.name, value: i.id, optionData: i.id }
                    })
                  }}
                  className='2xl:hidden'
                  value={record.printablePlace?.print?.name}
                />
                <ProductProgressStatus collapse className='w-full 2xl:hidden' record={record} />
              </Flex>
            )
          },
          columnWidth: '1%',
          showExpandColumn: innerWidth < 1536
        }}
      />
    </>
  )
}

export default ProductTable
