import { App as AntApp, Form, List } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import React, { useEffect } from 'react'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import useList from '~/components/hooks/useList'
import BaseLayout from '~/components/layout/BaseLayout'
import { Color, TableListDataType } from '~/typing'
import useColor from '../hooks/useColor'
import { ColorTableDataType } from '../type'
import ColorListItem from './ColorListItem'
import ModalAddNewColor from './ModalAddNewColor'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorList: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    loading,
    dateCreation,
    setDateCreation,
    setLoading,
    openModal,
    setOpenModal,
    searchText,
    setSearchText,
    handleAddNew,
    getColorList,
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
    handleStartDeleting,
    handleStartSaveEditing,
    handleStartEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useList<ColorTableDataType>([])
  const { message } = AntApp.useApp()
  console.log('Product page loading...')

  useEffect(() => {
    getColorList(defaultRequestBody, (meta) => {
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
          data: { ...item, key: item.id } as ColorTableDataType,
          key: item.id
        } as TableListDataType<ColorTableDataType>
      })
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
              getColorList(body, (meta) => {
                if (meta?.success) {
                  handleProgressDataSource(meta)
                }
              })
            }
          }}
          searchValue={searchText}
          onSearchChange={(e) => setSearchText(e.target.value)}
          onSortChange={(val) => {
            handleSorted(val ? 'asc' : 'desc', (meta) => {
              if (meta.success) {
                handleProgressDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            setSearchText('')
            getColorList(defaultRequestBody, (meta) => {
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
          <List
            className={props.className}
            itemLayout='vertical'
            size='large'
            pagination={{
              onChange: (page) => {
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: page,
                    pageSize: 5
                  },
                  search: {
                    field: 'nameColor',
                    term: searchText
                  }
                }
                getColorList(body, (meta) => {
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
                onSaveClick={async () => {
                  const row = await form.validateFields()
                  handleStartSaveEditing(
                    item.key!,
                    {
                      nameColor: row.nameColor,
                      hexColor: row.hexColor
                    },
                    (itemToSave) => {
                      const hexColor =
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        itemToSave.hexColor as any as AntColor
                      ColorAPI.updateItemByPk(item.data.id!, {
                        hexColor: hexColor.toHexString(),
                        nameColor: itemToSave.nameColor
                      })
                        .then((meta) => {
                          if (meta?.success) {
                            setLoading(true)
                            message.success('Updated!')
                          }
                        })
                        .catch((err) => {
                          console.log(err)
                        })
                        .finally(() => {
                          setLoading(false)
                        })
                    }
                  )
                }}
                dateCreation={dateCreation}
                onClickStartEditing={() => handleStartEditing(item.key!)}
                onConfirmCancelEditing={() => handleConfirmCancelEditing()}
                onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
                onConfirmDelete={() => {
                  setLoading(true)
                  handleStartDeleting(item.key!, (productToDelete) => {
                    handleDeleteItem(Number(productToDelete.key), (meta) => {
                      if (meta.success) {
                        setLoading(false)
                        message.success('Deleted!')
                      }
                    })
                  })
                }}
                onStartDeleting={() => setDeleteKey(item.key)}
              />
            )}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewColor
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(_form) => {
            handleAddNew(_form, (meta) => {
              if (meta.success) {
                const data = meta?.data as Color
                console.log(data)
                const newDataSource = [...dataSource]
                newDataSource.unshift({
                  ...data,
                  key: data.id
                } as TableListDataType<ColorTableDataType>)
                setDataSource(newDataSource)
                console.log(newDataSource)
                message.success('Success!', 1)
              }
            })
          }}
        />
      )}
    </>
  )
}

export default ColorList
