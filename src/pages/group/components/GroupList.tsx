import { App as AntApp, Form, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import GroupAPI from '~/api/services/GroupAPI'
import useList, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import useAPICaller, { serviceActionUpdate } from '~/hooks/useAPICaller'
import { Group } from '~/typing'
import { GroupTableDataType } from '../type'
import GroupListItem from './GroupListItem'
import ModalAddNewGroup from './ModalAddNewGroup'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GroupList: React.FC<Props> = ({ ...props }) => {
  const service = useAPICaller<Group>(GroupAPI)
  const {
    form,
    editingKey,
    setDeleteKey,
    dataSource,
    isEditing,
    loading,
    setLoading,
    dateCreation,
    setDateCreation,
    handleConvertDataSource,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useList<GroupTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { message } = AntApp.useApp()

  useEffect(() => {
    service.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        handleConvertDataSource(meta)
      }
    })
  }, [])

  useEffect(() => {
    if (dataSource.length > 0) {
      console.log(dataSource)
    }
  }, [dataSource])

  const selfHandleSaveClick = async (item: TableItemWithKey<GroupTableDataType>) => {
    const row = await form.validateFields()
    serviceActionUpdate(
      { field: 'id', key: item.id! },
      GroupAPI,
      {
        name: row.name
      } as Group,
      setLoading,
      (data, msg) => {
        if (data?.success) {
          message.success(msg)
        } else {
          message.error(msg)
        }
        handleStartSaveEditing(item.id!, {
          ...item,
          name: row.name
        })
      }
    )
  }

  return (
    <>
      <Form form={form}>
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
          <List
            className={props.className}
            itemLayout='vertical'
            size='large'
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
            loading={loading}
            dataSource={dataSource}
            renderItem={(item) => (
              <GroupListItem
                data={item}
                key={item.key}
                editingKey={editingKey}
                isEditing={isEditing(item.key!)}
                onSaveClick={() => selfHandleSaveClick(item)}
                dateCreation={dateCreation}
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
            )}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewGroup
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            service.createNewItem(addNewForm, setLoading, (meta) => {
              if (meta?.success) {
                const itemNew = meta.data as Group
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

export default GroupList
