/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Switch, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { Plus } from 'lucide-react'
import { useSelector } from 'react-redux'
import useTable from '~/components/hooks/useTable'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import ModalAddNewImportation from '~/pages/importation/components/ModalAddNewImportation'
import useImportationTable from '~/pages/importation/hooks/useImportationTable'
import { ImportationTableDataType } from '~/pages/importation/type'
import { ProductTableDataType } from '~/pages/product/type'
import { RootState } from '~/store/store'
import {
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit
} from '~/utils/helpers'

interface Props {
  productRecord: ProductTableDataType
}

const ImportationTable: React.FC<Props> = ({ productRecord }) => {
  const table = useTable<ImportationTableDataType>([])
  const {
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    amountQuantity,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    importationService
  } = useImportationTable(table)
  const user = useSelector((state: RootState) => state.user)
  const columns: ColumnType<ImportationTableDataType>[] = [
    {
      title: 'Lô nhập',
      dataIndex: 'quantity',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantity'
              title='Lô nhập'
              inputType='number'
              required={true}
              initialValue={numberValidatorInit(record.quantity)}
              value={newRecord.quantity}
              onValueChange={(val: number) => setNewRecord({ ...newRecord, quantity: numberValidatorChange(val) })}
            >
              <span>{numberValidatorDisplay(record.quantity)}</span>
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
              isEditing={table.isEditing(record.key!)}
              dataIndex='dateImported'
              title='Ngày nhập'
              inputType='datepicker'
              required={true}
              initialValue={dateValidatorInit(record.dateImported)}
              onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateImported: dateValidatorChange(val) })}
            >
              <span>{dateValidatorDisplay(record.dateImported)}</span>
            </EditableStateCell>
          </>
        )
      }
    }
  ]

  return (
    <>
      <Flex vertical gap={10}>
        <Flex className='w-full' align='center' justify='space-between'>
          <Flex gap={10}>
            <Typography.Text type='secondary'>
              {numberValidatorDisplay(amountQuantity) + ' / ' + numberValidatorDisplay(productRecord.quantityPO)}
            </Typography.Text>
            {user.isAdmin && (
              <Switch
                checkedChildren='DateCreation'
                unCheckedChildren='DateCreation'
                defaultChecked={table.dateCreation}
                onChange={(state) => table.setDateCreation(state)}
              />
            )}
          </Flex>
          {user.isAdmin && (
            <Button
              onClick={() => setOpenModal(true)}
              className='flex w-fit items-center'
              type='primary'
              icon={<Plus size={20} />}
              disabled={amountQuantity >= productRecord.quantityPO!}
            >
              New
            </Button>
          )}
        </Flex>
        <SkyTable
          bordered
          loading={table.loading}
          columns={columns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          pagination={{ pageSize: 3 }}
          metaData={importationService.metaData}
          onPageChange={handlePageChange}
          isDateCreation={table.dateCreation}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord({
                  quantity: record?.quantity,
                  dateImported: record?.dateImported
                })
                table.handleStartEditing(record!.key!)
              }
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!)
            },
            onSave: {
              onClick: (_e, record) => {
                handleSaveClick(record!)
              }
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: true
          }}
        />
      </Flex>
      {openModal && (
        <ModalAddNewImportation
          productRecord={productRecord}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(record) => handleAddNewItem({ ...record, productID: productRecord.id! })}
          loading={false}
          setLoading={table.setLoading}
        />
      )}
    </>
  )
}

export default ImportationTable
