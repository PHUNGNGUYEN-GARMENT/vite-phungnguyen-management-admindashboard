/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp, ColorPicker, Form, Table, Typography } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import useTable, { TableCellProps, TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableCell, { EditableTableProps } from '~/components/sky-ui/SkyTable/EditableCell'
import ItemAction from '~/components/sky-ui/SkyTable/ItemAction'
import useAPIService, { serviceActionUpdate } from '~/hooks/useAPIService'
import { RootState } from '~/store/store'
import { Color } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ColorTableDataType } from '../type'
import ModalAddNewColor from './ModalAddNewColor'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorTable: React.FC<Props> = ({ ...props }) => {
  const service = useAPIService<Color>(ColorAPI)
  const {
    form,
    loading,
    setLoading,
    editingKey,
    setDeleteKey,
    dataSource,
    isEditing,
    dateCreation,
    setDateCreation,
    handleConvertDataSource,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ColorTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const user = useSelector((state: RootState) => state.user)
  const { message } = AntApp.useApp()

  useEffect(() => {
    service.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        handleConvertDataSource(meta)
      }
    })
  }, [])

  const selfHandleSaveClick = async (item: TableItemWithKey<ColorTableDataType>) => {
    const row = await form.validateFields()
    const hexColor = row.hexColor
      ? typeof row.hexColor === 'string'
        ? row.hexColor
        : (row.hexColor as AntColor).toHexString()
      : ''
    serviceActionUpdate(
      { field: 'id', key: item.id! },
      ColorAPI,
      {
        name: row.name,
        hexColor: hexColor
      } as Color,
      setLoading,
      (data, msg) => {
        if (data?.success) {
          message.success(msg)
        } else {
          message.error(msg)
        }
        handleStartSaveEditing(item.id!, {
          ...item,
          name: row.name,
          hexColor: hexColor
        })
      }
    )
  }

  const smartInitialValue = (dataIndex: string, record: ColorTableDataType): unknown => {
    switch (dataIndex) {
      case 'name':
        return record.name
      case 'hexColor':
        return record.hexColor
      default:
        return record.id
    }
  }

  const actionsCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Operation',
      width: '15%',
      dataIndex: 'operation',
      render: (_, item: TableItemWithKey<ColorTableDataType>) => {
        return (
          <>
            <ItemAction
              isEditing={isEditing(item.key!)}
              editingKey={editingKey}
              onSaveClick={() => selfHandleSaveClick(item)}
              onClickStartEditing={() => handleStartEditing(item.key!)}
              onConfirmCancelEditing={() => handleConfirmCancelEditing()}
              onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
              onConfirmDelete={() => {
                service.updateItemByPk(item.id!, { status: 'deleted' }, setLoading, (meta) => {
                  if (meta) {
                    if (meta.success) {
                      handleStartDeleting(item.id!, () => {})
                      message.success('Deleted!')
                    }
                  } else {
                    message.error('Failed!')
                  }
                })
              }}
              onStartDeleting={() => setDeleteKey(item.key!)}
            />
          </>
        )
      }
    }
  ]

  const commonCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Color Name',
      dataIndex: 'name',
      width: '15%',
      editable: user.isAdmin,
      render: (_, record: TableItemWithKey<ColorTableDataType>) => {
        return (
          <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
            {record.name}
          </Typography.Text>
        )
      }
    },
    {
      title: 'Mã màu',
      dataIndex: 'hexColor',
      width: '15%',
      editable: true,
      render: (_, record: TableItemWithKey<ColorTableDataType>) => {
        return <ColorPicker defaultValue={record ? record.hexColor : ''} showText disabled defaultFormat='hex' />
      }
    }
  ]

  const dateCreationColumns: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '10%',
      render: (_, record: TableItemWithKey<ColorTableDataType>) => {
        return (
          <>
            <span>{DayJS(record ? record.createdAt : '').format(DatePattern.display)}</span>
          </>
        )
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '10%',
      render: (_, record: TableItemWithKey<ColorTableDataType>) => {
        return (
          <>
            <span>{DayJS(record ? record.updatedAt : '').format(DatePattern.display)}</span>
          </>
        )
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & TableCellProps)[] = dateCreation
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
        onCell: (record: ColorTableDataType) => ({
          record,
          inputType: onCellColumnType(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          initialValue: smartInitialValue(col.dataIndex, record),
          editing: isEditing(record.key!)
        })
      }
    }) as ColumnTypes
  }

  const onCellColumnType = (dataIndex: string): string => {
    switch (dataIndex) {
      case 'name':
        return 'text'
      default:
        return 'colorpicker'
    }
  }

  return (
    <>
      <Form {...props} form={form} component={false}>
        <BaseLayout
          onSearch={(value) => {
            if (value.length > 0) {
              service.getListItems(
                {
                  ...defaultRequestBody,
                  search: {
                    field: 'name',
                    term: value
                  }
                },
                setLoading,
                (meta) => {
                  if (meta?.success) {
                    handleConvertDataSource(meta)
                  }
                }
              )
            }
          }}
          onSortChange={(val) => {
            service.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
              if (meta?.success) {
                handleConvertDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            service.getListItems(defaultRequestBody, setLoading, (meta) => {
              if (meta?.success) {
                handleConvertDataSource(meta)
                message.success('Reloaded!')
              }
            })
          }}
          dateCreation={dateCreation}
          onDateCreationChange={setDateCreation}
          onAddNewClick={() => setOpenModal(true)}
        >
          <Table
            components={{
              body: {
                cell: EditableCell
              }
            }}
            loading={loading}
            bordered
            dataSource={dataSource}
            columns={mergedColumns(user.isAdmin ? adminColumns : staffColumns)}
            rowClassName='editable-row'
            pagination={{
              onChange: (_page) => {
                service.setPage(_page)
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: _page,
                    pageSize: 5
                  },
                  search: {
                    field: 'name',
                    term: form.getFieldValue('search') ?? ''
                  }
                }
                service.getListItems(body, setLoading, (meta) => {
                  if (meta?.success) {
                    handleConvertDataSource(meta)
                  }
                })
              },
              current: service.metaData?.page,
              pageSize: 5,
              total: service.metaData?.total
            }}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewColor
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            service.createNewItem(addNewForm, setLoading, (meta) => {
              if (meta?.success) {
                const itemNew = meta.data as Color
                handleStartAddNew({ key: Number(itemNew.id), ...itemNew })
                message.success('Created!')
                setOpenModal(false)
              } else {
                message.error('Failed!')
              }
            })
          }}
        />
      )}
    </>
  )
}

export default ColorTable
