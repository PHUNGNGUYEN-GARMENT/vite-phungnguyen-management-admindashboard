/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnType } from 'antd/es/table'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { GroupTableDataType } from '../GroupPage'
import useGroup from '../hooks/useGroup'
import ModalAddNewGroup from './ModalAddNewGroup'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GroupTable: React.FC<Props> = () => {
  const table = useTable<GroupTableDataType>([])

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
    groupService
  } = useGroup(table)

  const columns: ColumnType<GroupTableDataType>[] = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<GroupTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='name'
            title='Tên nhóm'
            inputType='text'
            required={true}
            initialValue={record.name}
            value={newRecord.name}
            onValueChange={(val) => setNewRecord({ ...newRecord, name: val })}
          >
            <SkyTableTypography status={record.status}>{record.name}</SkyTableTypography>
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
          dataSource={table.dataSource}
          rowClassName='editable-row'
          metaData={groupService.metaData}
          onPageChange={handlePageChange}
          isDateCreation={table.dateCreation}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord(record)
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
      {openModal && <ModalAddNewGroup openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />}
    </>
  )
}

export default GroupTable
