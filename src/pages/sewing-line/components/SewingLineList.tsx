import { App as AntApp, Form, List } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import SewingLineAPI from '~/api/services/SewingLineAPI'
import useList, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import useAPICaller from '~/hooks/useAPICaller'
import { SewingLine } from '~/typing'
import { SewingLineTableDataType } from '../type'
import ModalAddNewSewingLine from './ModalAddNewSewingLine'
import SewingLineListItem from './SewingLineListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const SewingLineList: React.FC<Props> = ({ ...props }) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const {
    createNewItem,
    getListItems,
    updateItemByPk,
    sortedListItems,
    loading,
    metaData
  } = useAPICaller<SewingLine>(SewingLineAPI)
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
  } = useList<SewingLineTableDataType>([])
  const { message } = AntApp.useApp()

  useEffect(() => {
    getListItems(defaultRequestBody, (meta) => {
      if (meta?.success) {
        handleProgressDataSource(meta)
      }
    })
  }, [])

  const handleProgressDataSource = (meta: ResponseDataType) => {
    const colors = meta.data as SewingLine[]
    setDataSource(
      colors.map((item: SewingLine) => {
        return {
          ...item,
          key: item.id
        } as TableItemWithKey<SewingLineTableDataType>
      })
    )
    console.log(
      colors.map((item: SewingLine) => {
        return {
          ...item,
          key: item.id
        } as TableItemWithKey<SewingLineTableDataType>
      })
    )
  }

  const selfHandleSaveClick = async (
    item: TableItemWithKey<SewingLineTableDataType>
  ) => {
    const row = await form.validateFields()

    updateItemByPk(
      item.id ?? Number(item.key),
      {
        ...row
      },
      (success) => {
        if (success) {
          handleStartSaveEditing(
            item.key!,
            {
              sewingLineName: row.sewingLineName
            },
            (itemToSave) => {
              if (itemToSave) {
                message.success('Updated!')
              }
            }
          )
        } else {
          message.error('Failed!')
        }
      }
    )
    form.resetFields()
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
                  field: 'sewingLineName',
                  term: value
                }
              }
              getListItems(body, (meta) => {
                if (meta?.success) {
                  handleProgressDataSource(meta)
                }
              })
            }
          }}
          onSortChange={(val) => {
            sortedListItems(val ? 'asc' : 'desc', (meta) => {
              if (meta?.success) {
                handleProgressDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            getListItems(defaultRequestBody, (meta) => {
              if (meta?.success) {
                handleProgressDataSource(meta)
              }
            })
          }}
          onAddNewClick={() => setOpenModal(true)}
        >
          <List
            className={props.className}
            itemLayout='vertical'
            size='large'
            pagination={{
              onChange: (_page) => {
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: _page,
                    pageSize: 5
                  },
                  search: {
                    field: 'sewingLineName',
                    term: form.getFieldValue('search') ?? ''
                  }
                }
                getListItems(body, (meta) => {
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
              <SewingLineListItem
                data={item}
                key={item.key}
                editingKey={editingKey}
                isEditing={isEditing(item.key!)}
                onSaveClick={() => selfHandleSaveClick(item)}
                onClickStartEditing={() => handleStartEditing(item.key!)}
                onConfirmCancelEditing={() => handleConfirmCancelEditing()}
                onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
                onConfirmDelete={() => {
                  handleStartDeleting(item.key!, (productToDelete) => {
                    updateItemByPk(
                      Number(productToDelete.key),
                      { status: 'deleted' },
                      (meta) => {
                        if (meta?.success) {
                          message.success('Created!')
                        } else {
                          message.error('Failed!')
                        }
                      }
                    )
                  })
                }}
                onStartDeleting={() => setDeleteKey(item.key!)}
              />
            )}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewSewingLine
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            createNewItem(addNewForm, (meta) => {
              if (meta?.success) {
                const newItem = meta.data as SewingLine
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

export default SewingLineList
