/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { defaultRequestBody } from '~/api/client'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableCellNew from '~/components/sky-ui/SkyTable/EditableCellNew'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import { Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
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
    handleStartAddNew,
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
              isEditing={isEditing(record.key!)}
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
      title: 'Lô nhập',
      dataIndex: 'quantity',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={isEditing(record.key!)}
              dataIndex='quantity'
              title='Lô nhập'
              inputType='number'
              required={true}
              initialField={{ value: record.importation?.quantity }}
            >
              <span>{record.importation?.quantity}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'dateImported',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={isEditing(record.key!)}
              dataIndex='dateImported'
              title='NPL'
              inputType='datepicker'
              required={true}
              initialField={{ value: record.importation?.dateImported && DayJS(record.importation?.dateImported) }}
            >
              <span>
                {record.importation?.dateImported &&
                  DayJS(record.importation?.dateImported).format(DatePattern.display)}
              </span>
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
            onEdit={{
              onClick: (_e, record) => {
                handleStartEditing(record!.key!)
              }
            }}
            onAdd={{
              onClick: (_e, record) => {
                console.log(record)
                // handleStartAddNew(record!)
              },
              isShow: false
            }}
            onSave={{
              onClick: (_e, record) => handleSaveClick(record!)
            }}
            onConfirmCancelEditing={handleConfirmCancelEditing}
            onConfirmCancelDeleting={handleConfirmCancelDeleting}
            onConfirmDelete={(record) => handleConfirmDelete(record)}
          />
        </BaseLayout>
      </Form>
    </>
  )
}

export default ImportationTable
