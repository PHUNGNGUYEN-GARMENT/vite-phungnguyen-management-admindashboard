import { App as AntApp, Form, Table, Typography } from 'antd'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ItemAction from '~/components/layout/Item/ItemAction'
import { RootState } from '~/store/store'
import { Group } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useGroup from '../hooks/useGroup'
import { GroupTableDataType } from '../type'
import EditableCell, { EditableTableProps } from './EditableCell'
import ModalAddNewGroup from './ModalAddNewGroup'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GroupTable: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    loading,
    setPage,
    dateCreation,
    setDateCreation,
    openModal,
    setOpenModal,
    handleAddNewItem,
    getDataList,
    handleUpdateItem,
    handleDeleteItem,
    handleSorted
  } = useGroup()
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
  } = useTable<GroupTableDataType>([])
  const user = useSelector((state: RootState) => state.user)
  const { message } = AntApp.useApp()

  useEffect(() => {
    getDataList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        handleProgressDataSource(meta)
      }
    })
  }, [])

  const handleProgressDataSource = (meta: ResponseDataType) => {
    const groups = meta.data as Group[]
    setDataSource(
      groups.map((item: Group) => {
        return {
          ...item,
          key: item.id
        } as GroupTableDataType
      })
    )
  }

  const selfHandleSaveClick = async (
    record: TableItemWithKey<GroupTableDataType>
  ) => {
    const row = await form.validateFields()
    handleStartSaveEditing(
      record.key!,
      {
        ...row,
        name: row.name
      },
      (status) => {
        if (status) {
          handleUpdateItem(
            record.id ?? Number(record.key!),
            {
              ...row,
              ame: row.name
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

  const selfHandleConfirmDelete = (
    item: TableItemWithKey<GroupTableDataType>
  ) => {
    handleStartDeleting(item.key!, (deleteKey) => {
      handleDeleteItem(Number(deleteKey), (success) => {
        if (success) {
          message.success('Deleted!')
        } else {
          message.error('Failed!')
        }
      })
    })
  }

  const actionsCols: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Operation',
      width: '15%',
      dataIndex: 'operation',
      render: (_, record: GroupTableDataType) => {
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

  const commonCols: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '15%',
      editable: user.isAdmin,
      render: (_, record: GroupTableDataType) => {
        return (
          <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
            {record.name}
          </Typography.Text>
        )
      }
    }
  ]

  const dateCreationColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '10%',
      render: (_, record: GroupTableDataType) => {
        return (
          <>
            <span>
              {DayJS(record ? record.createdAt : '').format(
                DatePattern.display
              )}
            </span>
          </>
        )
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '10%',
      render: (_, record: GroupTableDataType) => {
        return (
          <>
            <span>
              {DayJS(record ? record.updatedAt : '').format(
                DatePattern.display
              )}
            </span>
          </>
        )
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = dateCreation
    ? [...commonCols, ...dateCreationColumns, ...actionsCols]
    : [...commonCols, ...actionsCols]

  const staffColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [...commonCols]

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
        onCell: (record: GroupTableDataType) => ({
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
      case 'nameColor':
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
                  handleProgressDataSource(meta)
                }
              })
            }
          }}
          onSortChange={(val) => {
            handleSorted(val ? 'asc' : 'desc', (meta) => {
              if (meta?.success) {
                handleProgressDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            getDataList(defaultRequestBody, (meta) => {
              if (meta?.success) {
                handleProgressDataSource(meta)
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
                    handleProgressDataSource(meta)
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
        <ModalAddNewGroup
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

export default GroupTable
