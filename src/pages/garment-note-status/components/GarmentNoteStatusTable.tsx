/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnType } from 'antd/es/table'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import useGarmentNoteStatus from '../hooks/useGarmentNoteStatus'
import { GarmentNoteStatusTableDataType } from '../type'
import ModalAddNewGarmentNoteStatus from './ModalAddNewGarmentNoteStatus'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GarmentNoteStatusTable: React.FC<Props> = () => {
  const table = useTable<GarmentNoteStatusTableDataType>([])

  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    accessoryNoteService
  } = useGarmentNoteStatus(table)

  const columns: ColumnType<GarmentNoteStatusTableDataType>[] = [
    {
      title: 'Tên trạng thái',
      dataIndex: 'title',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<GarmentNoteStatusTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='title'
            title='Tên trạng thái'
            inputType='text'
            required={true}
            initialValue={record.title}
            value={newRecord?.title}
            onValueChange={(val) => setNewRecord({ ...newRecord, title: val })}
          >
            <SkyTableTypography status={record.status}>{record.title}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <>
      <BaseLayout
        searchValue={searchText}
        onDateCreationChange={(enable) => table.setDateCreation(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked, e) => handleSortChange(checked, e)}
        onResetClick={() => handleResetClick()}
        onAddNewClick={() => setOpenModal(true)}
      >
        <SkyTable
          bordered
          loading={table.loading}
          columns={columns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          metaData={accessoryNoteService.metaData}
          onPageChange={handlePageChange}
          isDateCreation={table.dateCreation}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord(record!)
                table.handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!, newRecord)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!)
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: true
          }}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewGarmentNoteStatus openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />
      )}
    </>
  )
}

export default GarmentNoteStatusTable
