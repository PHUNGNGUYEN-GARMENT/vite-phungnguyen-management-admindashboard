import { Form } from 'antd'
import React from 'react'
import { defaultRequestBody } from '~/api/client'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import { Product } from '~/typing'
import { ImportationTableDataType } from '../ImportationPage'
import useImportation from '../hooks/useImportation'
import ImportationListItem from './ImportationListItem'

const ImportationList: React.FC = () => {
  const {
    form,
    isEditing,
    editingKey,
    dataSource,
    loading,
    setLoading,
    dateCreation,
    setDateCreation,
    handleStartEditing,
    handleStartDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    selfConvertDataSource,
    handleSaveClick,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useImportation()

  return (
    <>
      <Form form={form}>
        <BaseLayout
          onDateCreationChange={(enable) => setDateCreation(enable)}
          onSearch={async (value) => {
            if (value.length > 0) {
              await productService.getListItems(
                {
                  ...defaultRequestBody,
                  search: {
                    field: 'productCode',
                    term: value
                  }
                },
                setLoading,
                (meta) => {
                  if (meta?.success) {
                    selfConvertDataSource(meta?.data as Product[])
                  }
                }
              )
            }
          }}
          onSortChange={async (val) => {
            await productService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            })
          }}
          onResetClick={async () => {
            form.setFieldValue('search', '')
            await productService.getListItems(defaultRequestBody, setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            })
          }}
        >
          <SkyList
            itemLayout='vertical'
            size='large'
            pagination={{
              onChange: handlePageChange,
              current: productService.metaData?.page,
              pageSize: 5,
              total: productService.metaData?.total
            }}
            loading={loading}
            dataSource={dataSource}
            metaData={productService.metaData}
            onPageChange={handlePageChange}
            editingKey={editingKey}
            renderItem={(record: ImportationTableDataType) => (
              <ImportationListItem
                record={record}
                isEditing={isEditing(record.key!)}
                isDateCreation={dateCreation}
                editingKey={editingKey}
                onSave={() => handleSaveClick(record)}
                onEdit={() => handleStartEditing(record.key!)}
                onConfirmCancelEditing={() => handleConfirmCancelEditing()}
                onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
                onConfirmDelete={() =>
                  handleConfirmDelete(record, (meta) => {
                    if (meta?.success) {
                      handleStartDeleting(record.key!, (itemDelete) => {
                        console.log(itemDelete)
                      })
                    }
                  })
                }
              />
            )}
          />
        </BaseLayout>
      </Form>
    </>
  )
}

export default ImportationList
