import { App as AntApp, Form, List } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import React, { useEffect, useState } from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import useAPIService, { serviceActionUpdate } from '~/hooks/useAPIService'
import { Color } from '~/typing'
import { ColorTableDataType } from '../type'
import ColorListItem from './ColorListItem'
import ModalAddNewColor from './ModalAddNewColor'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorList: React.FC<Props> = ({ ...props }) => {
  const service = useAPIService<Color>(ColorAPI)
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
  } = useTable<ColorTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
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

  return (
    <>
      <Form form={form}>
        <BaseLayout
          onDateCreationChange={(enable) => setDateCreation(enable)}
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
              }
            })
          }}
          onAddNewClick={() => setOpenModal(true)}
        >
          <List
            className={props.className}
            itemLayout='vertical'
            size='default'
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
              <ColorListItem
                data={item}
                key={item.key}
                dateCreation={dateCreation}
                editingKey={editingKey}
                isEditing={isEditing(item.key!)}
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
            )}
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

export default ColorList
