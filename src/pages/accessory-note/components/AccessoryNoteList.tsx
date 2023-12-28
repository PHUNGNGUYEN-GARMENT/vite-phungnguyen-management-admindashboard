import React from 'react'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import useAccessoryNote from '../hooks/useAccessoryNote'
import { AccessoryNoteTableDataType } from '../type'
import AccessoryNoteListItem from './AccessoryNoteListItem'
import ModalAddNewAccessoryNote from './ModalAddNewAccessoryNote'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const AccessoryNoteList: React.FC<Props> = () => {
  const table = useTable<AccessoryNoteTableDataType>([])

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
  } = useAccessoryNote(table)

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
        <SkyList
          itemLayout='vertical'
          size='large'
          loading={table.loading}
          dataSource={table.dataSource}
          metaData={accessoryNoteService.metaData}
          onPageChange={handlePageChange}
          renderItem={(record) => (
            <AccessoryNoteListItem
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
          )}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewAccessoryNote openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />
      )}
    </>
  )
}

export default AccessoryNoteList
