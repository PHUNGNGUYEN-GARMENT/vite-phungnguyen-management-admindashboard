/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnType } from 'antd/es/table'
import { useSelector } from 'react-redux'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ProtectedLayout from '~/components/layout/ProtectedLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { RootState } from '~/store/store'
import ModalAddNewSewingLine from './components/ModalAddNewSewingLine'
import useSewingLine from './hooks/useSewingLine'
import { SewingLineTableDataType } from './type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const SewingLinePage: React.FC<Props> = () => {
  const table = useTable<SewingLineTableDataType>([])

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
    sewingLineService
  } = useSewingLine(table)
  const currentUser = useSelector((state: RootState) => state.user)

  const columns: ColumnType<SewingLineTableDataType>[] = [
    {
      title: 'Tên chuyền',
      dataIndex: 'name',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<SewingLineTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='name'
            title='Tên chuyền'
            inputType='text'
            required={true}
            initialValue={record.name}
            value={newRecord.name}
            onValueChange={(val) => setNewRecord({ ...newRecord, name: val })}
          >
            <SkyTableTypography status={'active'}>{record.name}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <ProtectedLayout>
      <BaseLayout
        title='Chuyền may'
        searchValue={searchText}
        onDateCreationChange={(enable) => table.setDateCreation(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked, e) => handleSortChange(checked, e)}
        onResetClick={{
          onClick: () => handleResetClick(),
          isShow: currentUser.userRoles.includes('admin')
        }}
        onAddNewClick={{
          onClick: () => setOpenModal(true),
          isShow: currentUser.userRoles.includes('admin')
        }}
      >
        <SkyTable
          bordered
          loading={table.loading}
          columns={columns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          metaData={sewingLineService.metaData}
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
            isShow: currentUser.userRoles.includes('admin') || currentUser.userRoles.includes('cutting_group_manager')
          }}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewSewingLine openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />
      )}
    </ProtectedLayout>
  )
}

export default SewingLinePage
