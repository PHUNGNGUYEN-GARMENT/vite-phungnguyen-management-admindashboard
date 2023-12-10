import { App as AntApp, Form, List } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import React, { useEffect } from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
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
        setDataSource(
          meta.data.map((item: Color) => {
            return {
              ...item,
              key: item.id
            } as ColorTableDataType
          })
        )
      }
    })
  }, [])

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
                  setDataSource(
                    meta.data.map((item: Color) => {
                      return {
                        ...item,
                        key: item.id
                      } as ColorTableDataType
                    })
                  )
                }
              })
            }
          }}
          searchValue={searchText}
          onSearchChange={(e) => setSearchText(e.target.value)}
          onSortChange={(val) => {
            handleSorted(val ? 'asc' : 'desc', (meta) => {
              if (meta.success) {
                setDataSource(
                  meta.data.map((item: Color) => {
                    return {
                      ...item,
                      key: item.id
                    } as ColorTableDataType
                  })
                )
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            setSearchText('')
            getColorList(defaultRequestBody, (meta) => {
              if (meta?.success) {
                setDataSource(
                  meta.data.map((item: Color) => {
                    return {
                      ...item,
                      key: item.id
                    } as ColorTableDataType
                  })
                )
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
                    setDataSource(
                      meta.data.map((item: Color) => {
                        return {
                          ...item,
                          key: item.id
                        } as ColorTableDataType
                      })
                    )
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
                editingKey={editingKey}
                isEditing={isEditing(item.key!)}
                onSaveClick={() => {
                  handleStartSaveEditing(item.key!, (itemToSave) => {
                    console.log(itemToSave)
                    const hexColor = itemToSave.hexColor as AntColor
                    handleUpdateItem(
                      Number(item.key),
                      {
                        hexColor: hexColor.toHexString(),
                        nameColor: itemToSave.nameColor
                      },
                      (meta) => {
                        if (meta.success) {
                          message.success('Updated!')
                        }
                      }
                    )
                  })
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
