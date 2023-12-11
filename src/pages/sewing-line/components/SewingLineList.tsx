import { App as AntApp, Form, List } from 'antd'
import React, { useEffect } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import useList from '~/components/hooks/useList'
import { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import { SewingLine } from '~/typing'
import useSewingLine from '../hooks/useSewingLine'
import { SewingLineTableDataType } from '../type'
import ModalAddNewSewingLine from './ModalAddNewSewingLine'
import SewingLineListItem from './SewingLineListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const SewingLineList: React.FC<Props> = ({ ...props }) => {
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
  } = useSewingLine()
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
    getDataList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        console.log(meta)
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
  }

  const selfHandleSaveClick = async (
    item: TableItemWithKey<SewingLineTableDataType>
  ) => {
    const row = await form.validateFields()

    handleUpdateItem(
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
                    field: 'sewingLineName',
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
              <SewingLineListItem
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
        <ModalAddNewSewingLine
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            handleAddNewItem(addNewForm, (meta) => {
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
