/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Collapse, Flex, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { Plus } from 'lucide-react'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import { ProductTableDataType } from '~/pages/product/type'
import { Importation } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useImportation from '../hooks/useImportation'
import ModalAddNewImportation from './ModalAddNewImportation'

interface Props {
  productRecord: ProductTableDataType
}

export interface ImportationTableDataType extends Importation {
  key?: React.Key
}

const ImportationTable: React.FC<Props> = ({ productRecord }) => {
  const {
    isEditing,
    dataSource,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    importationService,
    dateCreation,
    handleStartEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    handleAddNewItem,
    newRecord,
    setNewRecord,
    amountQuantity,
    handleStartDeleting,
    handleSaveClick,
    handleConfirmDelete
  } = useImportation(productRecord)

  const columns: ColumnType<ImportationTableDataType>[] = [
    {
      title: 'Lô nhập',
      dataIndex: 'quantity',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={isEditing(record.key!)}
              dataIndex='quantity'
              title='Lô nhập'
              inputType='number'
              required={true}
              initialValue={record.quantity}
              value={newRecord.quantity}
              onValueChange={(val: number) => setNewRecord({ ...newRecord, quantity: val })}
            >
              <span>{record.quantity}</span>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'dateImported',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={isEditing(record.key!)}
              dataIndex='dateImported'
              title='Ngày nhập'
              inputType='datepicker'
              required={true}
              initialValue={DayJS(record.dateImported)}
              value={DayJS(newRecord.dateImported)}
              onValueChange={(val: any) =>
                setNewRecord({ ...newRecord, dateImported: DayJS(val).format(DatePattern.iso8601) })
              }
            >
              <span>{DayJS(record.dateImported).format(DatePattern.display)}</span>
            </EditableStateCell>
          </>
        )
      }
    }
  ]

  return (
    <>
      <Collapse
        className='w-full'
        items={[
          {
            key: '1',
            label: (
              <Typography.Title className='m-0' level={5} type='secondary'>
                Nhập khẩu
              </Typography.Title>
            ),
            children: (
              <Flex vertical gap={10}>
                <Flex className='w-full' align='center' justify='space-between'>
                  <Typography.Text type='secondary'>
                    {amountQuantity + ' / ' + productRecord.quantityPO}
                  </Typography.Text>
                  <Button
                    onClick={() => setOpenModal(true)}
                    className='flex w-fit items-center'
                    type='primary'
                    icon={<Plus size={20} />}
                    disabled={amountQuantity >= productRecord.quantityPO!}
                  >
                    New
                  </Button>
                </Flex>
                <SkyTable
                  bordered
                  loading={loading}
                  columns={columns}
                  dataSource={dataSource}
                  rowClassName='editable-row'
                  metaData={importationService.metaData}
                  pagination={false}
                  isDateCreation={dateCreation}
                  actions={{
                    onEdit: {
                      onClick: (_e, record) => {
                        handleStartEditing(record!.key!)
                      }
                    },
                    onDelete: {
                      onClick: (_e, record) => {
                        handleStartDeleting(record!.key!)
                      }
                    },
                    onSave: {
                      onClick: (_e, record) => {
                        handleSaveClick(record!, newRecord!)
                      }
                    },
                    onConfirmCancelEditing: () => handleConfirmCancelEditing(),
                    onConfirmCancelDeleting: () => handleConfirmCancelDeleting(),
                    onConfirmDelete: (record) => handleConfirmDelete(record),
                    isShow: true
                  }}
                />
              </Flex>
            )
          }
        ]}
      />
      {openModal && (
        <ModalAddNewImportation
          productRecord={productRecord}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(record) => {
            handleAddNewItem({ ...record, productID: productRecord.id! })
          }}
          loading={false}
          setLoading={setLoading}
        />
      )}
    </>
  )
}

export default ImportationTable
