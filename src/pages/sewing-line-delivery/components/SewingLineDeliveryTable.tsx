import { App as AntApp, ColorPicker, Form, Table, Typography } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ItemAction from '~/components/sky-ui/Table/ItemAction'
import { RootState } from '~/store/store'
import { Color } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useColor from '../hooks/useSewingLineDelivery'
import { ColorTableDataType } from '../type'
import EditableCell, { EditableTableProps } from './EditableCell'
import ModalAddNewColor from './ModalAddNewSewingLineDelivery'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorTable: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    loading,
    setPage,
    dateCreation,
    setDateCreation,
    setLoading,
    openModal,
    setOpenModal,
    handleAddNewItem,
    getDataList,
    handleUpdateItem,
    handleDeleteItem,
    handleSorted
  } = useColor()
  const {
    form,
    editingKey,
    setDeleteKey,
    dataSource,
    setDataSource,
    isEditing,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ColorTableDataType>([])
  const user = useSelector((state: RootState) => state.user)
  const { message } = AntApp.useApp()

  useEffect(() => {
    getDataList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        selfHandleProgressDataSource(meta)
      }
    })
  }, [])

  const selfHandleProgressDataSource = (meta: ResponseDataType) => {
    const colors = meta.data as Color[]
    setDataSource(
      colors.map((item: Color) => {
        return {
          ...item,
          key: item.id
        } as ColorTableDataType
      })
    )
  }

  const selfHandleSaveClick = async (record: TableItemWithKey<ColorTableDataType>) => {
    const row = await form.validateFields()
    const hexColor = row.hexColor
      ? typeof row.hexColor === 'string'
        ? row.hexColor
        : (row.hexColor as AntColor).toHexString()
      : ''
    handleStartSaveEditing(
      record.key!,
      {
        ...row,
        hexColor: hexColor
      },
      (status) => {
        if (status) {
          handleUpdateItem(
            record.id ?? Number(record.key!),
            {
              ...row,
              hexColor: hexColor
            },
            (success) => {
              if (success) {
                message.success('Updated!')
              } else {
                message.error('Failed!')
              }
            }
          )
        }
      }
    )
  }

  const selfHandleConfirmDelete = (item: TableItemWithKey<ColorTableDataType>) => {
    setLoading(true)
    handleStartDeleting(item.key!, (productToDelete) => {
      handleDeleteItem(Number(productToDelete), (success) => {
        if (success) {
          message.success('Deleted!')
        } else {
          message.error('Failed!')
        }
      })
    })
  }

  const actionsCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Operation',
      width: '15%',
      dataIndex: 'operation',
      render: (_, record: ColorTableDataType) => {
        return (
          <>
            <ItemAction
              isEditing={isEditing(record.key!)}
              editingKey={editingKey}
              onSaveClick={() => selfHandleSaveClick(record)}
              onClickStartEditing={() => handleStartEditing(record.key!)}
              onConfirmCancelEditing={() => handleConfirmCancelEditing()}
              onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
              onConfirmDelete={() => selfHandleConfirmDelete(record)}
              onStartDeleting={() => setDeleteKey(record.key!)}
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
      render: (_, record: ColorTableDataType) => {
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
      render: (_, record: ColorTableDataType) => {
        return <ColorPicker defaultValue={record ? record.hexColor : ''} showText disabled defaultFormat='hex' />
      }
    }
  ]

  const dateCreationColumns: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '10%',
      render: (_, record: ColorTableDataType) => {
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
      render: (_, record: ColorTableDataType) => {
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

  const mergedColumns = (
    cols: (ColumnTypes[number] & {
      editable?: boolean
      dataIndex: string
    })[]
  ): ColumnTypes => {
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
              const body: RequestBodyType = {
                ...defaultRequestBody,
                search: {
                  field: 'name',
                  term: value
                }
              }
              getDataList(body, (meta) => {
                if (meta?.success) {
                  selfHandleProgressDataSource(meta)
                }
              })
            }
          }}
          onSortChange={(val) => {
            handleSorted(val ? 'asc' : 'desc', (meta) => {
              if (meta?.success) {
                selfHandleProgressDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            getDataList(defaultRequestBody, (meta) => {
              if (meta?.success) {
                selfHandleProgressDataSource(meta)
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
                setPage(_page)
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
                getDataList(body, (meta) => {
                  if (meta?.success) {
                    selfHandleProgressDataSource(meta)
                  }
                })
              },
              current: metaData?.page,
              pageSize: 5,
              total: metaData?.total
            }}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewColor
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            console.log(addNewForm)
            handleStartAddNew({ key: dataSource.length + 1, ...addNewForm })
            handleAddNewItem(addNewForm, (success) => {
              if (success) {
                message.success('Created!')
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
