/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex, Form, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { defaultRequestBody } from '~/api/client'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableCellNew from '~/components/sky-ui/SkyTable/EditableCellNew'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import { Product } from '~/typing'
import { ImportationTableDataType } from '../ImportationPage'
import useImportation from '../hooks/useImportation'

const ImportationTable: React.FC = () => {
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
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    selfConvertDataSource,
    handleSaveClick,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useImportation()

  const columns: ColumnType<ImportationTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={false}
              dataIndex='productCode'
              title='Mã hàng'
              inputType='text'
              required={true}
              initialField={{ value: record.productCode }}
            >
              <Typography.Text className='text-md flex-shrink-0 font-bold'>{record.productCode}</Typography.Text>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={false}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
              initialField={{ value: record.quantityPO }}
            >
              <span>{record.quantityPO}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={false}
              dataIndex='colorID'
              title='Màu'
              inputType='select'
              required={false}
              initialField={{
                value: record.productColor?.colorID
              }}
            >
              <Flex className='' justify='space-between' align='center' gap={10}>
                <Typography.Text>{record.productColor?.color?.name}</Typography.Text>
                <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
              </Flex>
            </EditableCellNew>
          </>
        )
      }
    }
  ]

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
          <SkyTable
            bordered
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            rowClassName='editable-row'
            metaData={productService.metaData}
            onPageChange={handlePageChange}
            editingKey={editingKey}
            isDateCreation={dateCreation}
            actions={{
              onEdit: {
                onClick: (_e, record) => {
                  handleStartEditing(record!.key!)
                }
              },
              onAdd: {
                onClick: (_e, record) => {
                  console.log(record)
                  // handleStartAddNew(record!)
                },
                isShow: true
              },
              onSave: {
                onClick: (_e, record) => handleSaveClick(record!)
              },
              isShow: true
            }}
            onConfirmCancelEditing={handleConfirmCancelEditing}
            onConfirmCancelDeleting={handleConfirmCancelDeleting}
            onConfirmDelete={(record) => handleConfirmDelete(record)}
            expandable={{
              expandedRowRender: (record) => {
                return (
                  <SkyTable
                    bordered
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    rowClassName='editable-row'
                    metaData={productService.metaData}
                    pagination={false}
                    onPageChange={handlePageChange}
                    editingKey={editingKey}
                    showHeader={false}
                    isDateCreation={dateCreation}
                    onConfirmCancelEditing={handleConfirmCancelEditing}
                    onConfirmCancelDeleting={handleConfirmCancelDeleting}
                    onConfirmDelete={(record) => handleConfirmDelete(record)}
                  />
                )
              },
              columnWidth: '0.001%'
            }}
          />
        </BaseLayout>
      </Form>
    </>
  )
}

export default ImportationTable
