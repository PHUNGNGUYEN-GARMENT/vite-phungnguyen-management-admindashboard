import React from 'react'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import useSampleSewing from '../hooks/useCuttingGroup'
import { SampleSewingTableDataType } from '../type'
import ModalAddNewGroup from './ModalAddNewSampleSewing'
import SampleSewingListItem from './SampleSewingListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const SampleSewingList: React.FC<Props> = () => {
  const table = useTable<SampleSewingTableDataType>([])

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
    productService
  } = useSampleSewing(table)

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
          metaData={productService.metaData}
          onPageChange={handlePageChange}
          renderItem={(record) => (
            <SampleSewingListItem
              record={record}
              newRecord={newRecord}
              setNewRecord={setNewRecord}
              setLoading={table.setLoading}
              isDateCreation={table.dateCreation}
              isEditing={table.isEditing(record.key!)}
              actions={{
                onSave: {
                  onClick: () => handleSaveClick(record, newRecord!)
                },
                onEdit: {
                  onClick: () => {
                    setNewRecord(record.sampleSewing)
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
      {openModal && <ModalAddNewGroup openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />}
    </>
  )
}

export default SampleSewingList