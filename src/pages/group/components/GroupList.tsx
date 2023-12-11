import { App as AntApp, Form, List } from 'antd'
import React, { useEffect } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import useList, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import { Group } from '~/typing'
import useGroup from '../hooks/useGroup'
import { GroupTableDataType } from '../type'
import GroupListItem from './GroupListItem'
import ModalAddNewGroup from './ModalAddNewGroup'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GroupList: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    setPage,
    loading,
    dateCreation,
    setDateCreation,
    setLoading,
    openModal,
    setOpenModal,
    handleAddNewItem,
    getDataList,
    handleDeleteItem,
    handleUpdateItem,
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
  } = useList<GroupTableDataType>([])
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
        } as TableItemWithKey<GroupTableDataType>
      })
    )
  }

  const selfHandleSaveClick = async (
    item: TableItemWithKey<GroupTableDataType>
  ) => {
    const row = await form.validateFields()
    handleStartSaveEditing(
      item.key!,
      {
        name: row.name
      },
      (itemToSave) => {
        handleUpdateItem(
          item.id ?? Number(item.key),
          {
            ...itemToSave,
            name: row.name
          },
          (success) => {
            if (success) {
              message.success('Created!')
            } else {
              message.success('Failed!')
            }
          }
        )
      }
    )
  }

  return (
    <>
      <Form form={form}>
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
                  setLoading(true)
                  handleStartDeleting(item.key!, (productToDelete) => {
                    handleDeleteItem(Number(productToDelete.key), (success) => {
                      if (success) {
                        message.success('Created!')
                      } else {
                        message.success('Failed!')
                      }
                    })
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
            handleAddNewItem(addNewForm, (meta) => {
              if (meta?.success) {
                const newItem = meta.data as Group
                handleStartAddNew({
                  key: newItem.id,
                  ...addNewForm
                })
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

export default GroupList
