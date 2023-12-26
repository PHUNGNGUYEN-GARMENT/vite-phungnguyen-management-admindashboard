import { App as AntApp, List } from 'antd'
import React from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import BaseLayout from '~/components/layout/BaseLayout'
import { Color } from '~/typing'
import useColor from '../hooks/useColor'
import ColorListItem from './ColorListItem'
import ModalAddNewColor from './ModalAddNewColor'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorList: React.FC<Props> = ({ ...props }) => {
  const {
    isEditing,
    editingKey,
    dataSource,
    loading,
    setLoading,
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    dateCreation,
    setDateCreation,
    handleStartEditing,
    handleStartDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    openModal,
    setOpenModal,
    selfConvertDataSource,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    colorService
  } = useColor()
  const { message } = AntApp.useApp()

  return (
    <>
      <BaseLayout
        searchValue={searchText}
        onSearch={(value) => {
          if (value.length > 0) {
            colorService.getListItems(
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
                  selfConvertDataSource(meta.data as Color[])
                }
              }
            )
          }
        }}
        onSortChange={(val) => {
          colorService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta.data as Color[])
            }
          })
        }}
        onResetClick={() => {
          setSearchText('')
          colorService.getListItems(defaultRequestBody, setLoading, (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta.data as Color[])
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
