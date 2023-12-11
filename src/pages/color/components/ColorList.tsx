import { App as AntApp, Form, List } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import React, { useEffect } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import useList, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import { Color } from '~/typing'
import useColor from '../hooks/useColor'
import { ColorTableDataType } from '../type'
import ColorListItem from './ColorListItem'
import ModalAddNewColor from './ModalAddNewColor'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorList: React.FC<Props> = ({ ...props }) => {
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
  } = useList<ColorTableDataType>([])
  const { message } = AntApp.useApp()

  useEffect(() => {
    getDataList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        handleProgressDataSource(meta)
      }
    })
  }, [])

  const handleProgressDataSource = (meta: ResponseDataType) => {
    const colors = meta.data as Color[]
    setDataSource(
      colors.map((item: Color) => {
        return {
          ...item,
          key: item.id
        } as TableItemWithKey<ColorTableDataType>
      })
    )
  }

  const selfHandleSaveClick = async (
    item: TableItemWithKey<ColorTableDataType>
  ) => {
    const row = await form.validateFields()
    handleStartSaveEditing(
      item.key!,
      {
        nameColor: row.nameColor,
        hexColor: row.hexColor
      },
      (itemToSave) => {
        const hexColor = row.hexColor
          ? typeof row.hexColor === 'string'
            ? row.hexColor
            : (row.hexColor as AntColor).toHexString()
          : ''
        handleUpdateItem(
          item.id ?? Number(item.key),
          {
            ...itemToSave,
            hexColor: hexColor
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
                  field: 'nameColor',
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
                    field: 'nameColor',
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
              <ColorListItem
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
                message.success('Failed!')
              }
            })
          }}
        />
      )}
    </>
  )
}

export default ColorList
