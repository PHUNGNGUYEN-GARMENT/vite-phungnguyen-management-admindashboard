/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Collapse, Flex, Switch, Typography } from 'antd'
import { Plus } from 'lucide-react'
import { useSelector } from 'react-redux'
import useTable from '~/components/hooks/useTable'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import { ProductTableDataType } from '~/pages/product/type'
import { RootState } from '~/store/store'
import { Importation } from '~/typing'
import useImportation from '../hooks/useImportation'
import ImportationListItem from './ImportationListItem'
import ModalAddNewImportation from './ModalAddNewImportation'

interface Props {
  productRecord: ProductTableDataType
}

export interface ImportationTableDataType extends Importation {
  key?: React.Key
}

const ImportationList: React.FC<Props> = ({ productRecord }) => {
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
  } = useImportation(productRecord, table)
  const user = useSelector((state: RootState) => state.user)

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
                  <Flex gap={10}>
                    <Typography.Text type='secondary'>
                      {amountQuantity + ' / ' + productRecord.quantityPO}
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
                <SkyList
                  itemLayout='vertical'
                  size='large'
                  loading={table.loading}
                  dataSource={table.dataSource}
                  metaData={importationService.metaData}
                  onPageChange={handlePageChange}
                  renderItem={(record: ImportationTableDataType) => (
                    <>
                      <ImportationListItem
                        record={record}
                        newRecord={newRecord}
                        setNewRecord={setNewRecord}
                        isDateCreation={table.dateCreation}
                        isEditing={table.isEditing(record.key!)}
                        actions={{
                          onSave: {
                            onClick: () => {
                              setNewRecord(record)
                              handleSaveClick(record, newRecord)
                            }
                          },
                          onEdit: {
                            onClick: () => {
                              setNewRecord(record)
                              table.handleStartEditing(record!.key!)
                            }
                          },
                          onDelete: {
                            onClick: () => table.handleStartDeleting(record.key!)
                          },
                          onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
                          onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
                          onConfirmDelete: () => handleConfirmDelete(record)
                        }}
                      />
                    </>
                  )}
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
          onAddNew={(record) => handleAddNewItem({ ...record, productID: productRecord.id! })}
          loading={false}
          setLoading={table.setLoading}
        />
      )}
    </>
  )
}

export default ImportationList
