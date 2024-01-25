/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnsType } from 'antd/es/table'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { UserRoleType } from '~/typing'
import { textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import ModalAddNewRole from './components/ModalAddNewRole'
import useRole from './hooks/useRole'
import { RoleTableDataType } from './type'

const RolePage = () => {
  const table = useTable<RoleTableDataType>([])
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
    roleService
  } = useRole(table)

  const columns = {
    role: (record: RoleTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='role'
          title='Role'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.role)}
          value={newRecord.role}
          onValueChange={(val) => setNewRecord({ ...newRecord, role: textValidatorChange(val) as UserRoleType })}
        >
          <SkyTableTypography strong status={'active'}>
            {textValidatorDisplay(record.role)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    shortName: (record: RoleTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='shortName'
          title='Short name'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.shortName)}
          value={newRecord.shortName}
          onValueChange={(val) => setNewRecord({ ...newRecord, shortName: textValidatorChange(val) })}
        >
          <SkyTableTypography status={'active'}>{textValidatorDisplay(record.shortName)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    desc: (record: RoleTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='desc'
          title='Description'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.desc)}
          value={newRecord.desc}
          onValueChange={(val) => setNewRecord({ ...newRecord, desc: textValidatorChange(val) })}
        >
          <SkyTableTypography status={'active'}>{textValidatorDisplay(record.desc)}</SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<RoleTableDataType> = [
    {
      title: 'Role',
      dataIndex: 'role',
      width: '10%',
      render: (_value: any, record: RoleTableDataType) => {
        return columns.role(record)
      }
    },
    {
      title: 'Short name',
      dataIndex: 'shortName',
      width: '10%',
      render: (_value: any, record: RoleTableDataType) => {
        return columns.shortName(record)
      }
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      width: '10%',
      render: (_value: any, record: RoleTableDataType) => {
        return columns.desc(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        searchPlaceHolder='Search..'
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
          columns={tableColumns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          metaData={roleService.metaData}
          onPageChange={handlePageChange}
          isDateCreation={table.dateCreation}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord({ ...record })
                table.handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!)
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
      {openModal && <ModalAddNewRole openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />}
    </>
  )
}

export default RolePage
