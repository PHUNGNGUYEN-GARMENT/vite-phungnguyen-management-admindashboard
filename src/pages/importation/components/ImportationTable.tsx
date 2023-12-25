/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex, Form, Typography } from 'antd'
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
              initialField={{ value: record.product?.productCode }}
            >
              <Typography.Text className='text-md flex-shrink-0 font-bold'>
                {record.product?.productCode}
              </Typography.Text>
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
              initialField={{ value: record.product?.quantityPO }}
            >
              <span>{record.product?.quantityPO}</span>
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
                value: record.productColors.find((item) => item.productID === record.product?.id)?.colorID
              }}
            >
              <Flex className='' justify='space-between' align='center' gap={10}>
                <Typography.Text>
                  {record.productColors.find((item) => item.productID === record.product?.id)?.color?.name}
                </Typography.Text>
                <ColorPicker
                  size='middle'
                  format='hex'
                  value={record.productColors.find((item) => item.productID === record.product?.id)?.color?.hexColor}
                  disabled
                />
              </Flex>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '10%',
      responsive: ['xl'],
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={false}
              dataIndex='groupID'
              title='Nhóm'
              inputType='select'
              required={false}
              initialField={{
                value: record.productGroups.find((item) => item.productID === record.product?.id)?.groupID
              }}
            >
              <span>{record.productGroups.find((item) => item.productID === record.product?.id)?.group?.name}</span>
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
              initialField={{ value: record?.quantity }}
            >
              <span>{record?.quantity}</span>
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
              initialField={{ value: record?.dateImported && DayJS(record?.dateImported) }}
            >
              <span>{record?.dateImported && DayJS(record?.dateImported).format(DatePattern.display)}</span>
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
