/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex, List, Table, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import ProgressBar from '~/components/ui/ProgressBar'
import EditableCellNew from '~/components/ui/Table/EditableCellNew'
import ItemAction from '~/components/ui/Table/ItemAction'
import ListableExpandedRow from '~/components/ui/Table/ListableExpandedRow'
import useAPIService from '~/hooks/useAPIService'
import { RootState } from '~/store/store'
import { Color, Group, Print } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'

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
              editing={props.isEditing(record.key!)}
              dataIndex='productCode'
              title='Mã hàng'
              inputType='text'
              record={record}
              index={0}
              required={true}
              initialField={{ value: record.productCode }}
            >
              <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
                {record.productCode}
              </Typography.Text>
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
              editing={props.isEditing(record.key!)}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              record={record}
              index={0}
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
              editing={props.isEditing(record.key!)}
              dataIndex='colorID'
              title='Màu'
              inputType='select'
              record={record}
              index={0}
              required={true}
              initialField={{ value: record.productColor?.colorID, data: colors }}
            >
              <Flex className='' align='center' vertical gap={5}>
                <span>{record.productColor?.color?.name}</span>
                <ColorPicker
                  size='middle'
                  format='hex'
                  value={record.productColor?.color?.hexColor}
                  disabled
                  showText
                />
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
      responsive: ['md'],
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              editing={props.isEditing(record.key!)}
              dataIndex='groupID'
              title='Nhóm'
              inputType='select'
              record={record}
              index={0}
              required={true}
              initialField={{ value: record.productGroup?.groupID, data: groups }}
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
      responsive: ['xl'],
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              editing={props.isEditing(record.key!)}
              dataIndex='printID'
              title='Nơi in'
              inputType='select'
              record={record}
              index={0}
              required={true}
              initialField={{ value: record.printablePlace?.printID, data: prints }}
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
      responsive: ['lg'],
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              editing={props.isEditing(record.key!)}
              dataIndex='dateInputNPL'
              title='NPL'
              inputType='datepicker'
              record={record}
              index={0}
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
              editing={props.isEditing(record.key!)}
              dataIndex='dateOutputFCR'
              title='FCR'
              inputType='datepicker'
              record={record}
              index={0}
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
        dataSource={props.dataSource}
        bordered
        expandable={{
          expandedRowRender: (record: ProductTableDataType) => {
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
              <ListableExpandedRow
                items={[
                  {
                    ...record,
                    key: Number(record.printablePlace?.id),
                    title: 'Nơi in / thêu',
                    editable: true,
                    isEditing: props.isEditing(record.key!),
                    desc: record.printablePlace?.print?.name,
                    responsive: ['xl'],
                    inputType: 'select'
                  },
                  {
                    ...record,
                    key: Number(record.id),
                    title: 'Ngày nhập NPL',
                    editable: true,
                    isEditing: props.isEditing(record.key!),
                    desc: DayJS(record.dateInputNPL).format(DatePattern.display),
                    responsive: ['lg'],
                    inputType: 'datepicker'
                  },
                  {
                    ...record,
                    key: Number(record.id),
                    editable: false,
                    desc: (
                      <>
                        <Flex vertical className='w-full 2xl:hidden'>
                          <Typography.Text className='w-40 font-bold'>Tiến trình</Typography.Text>
                          <List className='w-full list-none'>
                            {progressArr.map((item, index) => {
                              return (
                                <List.Item key={index} className='m-0 w-full p-0'>
                                  <Flex className='m-0 w-full p-0'>
                                    <Typography.Text className='m-0 w-16 flex-shrink-0 p-0'>
                                      {item.task}
                                    </Typography.Text>
                                    <Flex className='w-full' align='center' vertical>
                                      <ProgressBar count={item.quantity ?? 0} total={record.quantityPO ?? 0} />
                                      <Typography.Text type='secondary' className='w-24 font-medium'>
                                        {item.quantity ?? 0} / {record.quantityPO ?? 0}
                                      </Typography.Text>
                                    </Flex>
                                  </Flex>
                                </List.Item>
                              )
                            })}
                          </List>
                        </Flex>
                      </>
                    ),
                    responsive: ['xxl'],
                    inputType: 'datepicker'
                  }
                ]}
                isEditing={props.isEditing(record.key!)}
                loading={props.loading}
              />
            )
          },
          columnWidth: '1%',
          showExpandColumn: true
        }}
        columns={user.isAdmin ? adminColumns : staffColumns}
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
