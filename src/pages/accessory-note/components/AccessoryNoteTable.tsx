import { App as AntApp, Form, Table, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import AccessoryNoteAPI from '~/api/services/AccessoryNoteAPI'
import useTable, { TableCellProps, TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ItemAction from '~/components/ui/Table/ItemAction'
import useAPIService, { serviceActionUpdate } from '~/hooks/useAPIService'
import { RootState } from '~/store/store'
import { AccessoryNote } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { AccessoryNoteTableDataType } from '../type'
import EditableCell, { EditableTableProps } from './EditableCell'
import ModalAddNewAccessoryNote from './ModalAddNewAccessoryNote'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const AccessoryNoteTable: React.FC<Props> = ({ ...props }) => {
  const service = useAPIService<AccessoryNote>(AccessoryNoteAPI)
  const {
    form,
    loading,
    isEditing,
    setLoading,
    dataSource,
    editingKey,
    setDeleteKey,
    dateCreation,
    setDateCreation,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleConvertDataSource,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<AccessoryNoteTableDataType>([])
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

  const selfHandleSaveClick = async (item: TableItemWithKey<AccessoryNoteTableDataType>) => {
    const row = await form.validateFields()
    serviceActionUpdate(
      { field: 'id', key: item.id! },
      AccessoryNoteAPI,
      {
        title: row.title,
        summary: row.summary
      } as AccessoryNote,
      setLoading,
      (data, msg) => {
        if (data?.success) {
          message.success(msg)
        } else {
          message.error(msg)
        }
        handleStartSaveEditing(item.id!, {
          ...item,
          title: row.title,
          summary: row.summary
        })
      }
    )
  }

  const actionsCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Operation',
      width: '15%',
      dataIndex: 'operation',
      render: (_, item: TableItemWithKey<AccessoryNoteTableDataType>) => {
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
      title: 'Title',
      dataIndex: 'title',
      width: '15%',
      editable: user.isAdmin,
      render: (_, record: AccessoryNoteTableDataType) => {
        return (
          <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
            {record.title}
          </Typography.Text>
        )
      }
    }
  ]

  const dateCreationColumns: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '10%',
      render: (_, record: AccessoryNoteTableDataType) => {
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
      render: (_, record: AccessoryNoteTableDataType) => {
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
        onCell: (record: AccessoryNoteTableDataType) => ({
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
        <ModalAddNewAccessoryNote
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            service.createNewItem(addNewForm, setLoading, (meta) => {
              if (meta?.success) {
                const itemNew = meta.data as AccessoryNote
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

export default AccessoryNoteTable
