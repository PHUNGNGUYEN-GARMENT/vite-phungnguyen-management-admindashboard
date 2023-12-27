import React from 'react'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import { SewingLineTableDataType } from '../SewingLinePage'
import useSewingLine from '../hooks/useSewingLine'
import ModalAddNewSewingLine from './ModalAddNewSewingLine'
import SewingLineListItem from './SewingLineListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const SewingLineList: React.FC<Props> = () => {
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
          metaData={sewingLineService.metaData}
          onPageChange={handlePageChange}
          renderItem={(record) => (
            <SewingLineListItem
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
        <ModalAddNewSewingLine openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />
      )}
    </>
  )
}

export default SewingLineList
