/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp, ColorPicker, Typography } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import { useSelector } from 'react-redux'
import { defaultRequestBody } from '~/api/client'
import { TableCellProps, TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import { default as EditableStateCell, EditableTableProps } from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import { RootState } from '~/store/store'
import { Color } from '~/typing'
import { ColorTableDataType } from '../ColorPage'
import useColor from '../hooks/useColor'
import ModalAddNewColor from './ModalAddNewColor'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ColorTable: React.FC<Props> = () => {
  const {
    isEditing,
    editingKey,
    dataSource,
    loading,
    setLoading,
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    dateCreation,
    setDateCreation,
    handleStartEditing,
    handleStartDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    openModal,
    setOpenModal,
    selfConvertDataSource,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    colorService
  } = useColor()

  const user = useSelector((state: RootState) => state.user)
  const { message } = AntApp.useApp()

  const cols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Color Name',
      dataIndex: 'name',
      width: '15%',
      editable: user.isAdmin,
      render: (_, record: TableItemWithKey<ColorTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={isEditing(record.key!)}
            dataIndex='name'
            title='Tên màu'
            inputType='text'
            required={true}
            initialValue={record.name}
            value={newRecord.name}
            onValueChange={(val) => setNewRecord({ ...newRecord, name: val })}
          >
            <Typography.Text className='text-md flex-shrink-0 font-bold'>{record.name}</Typography.Text>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Mã màu',
      dataIndex: 'hexColor',
      width: '15%',
      editable: true,
      render: (_, record: TableItemWithKey<ColorTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={isEditing(record.key!)}
            dataIndex='hexColor'
            title='Mã màu'
            inputType='colorpicker'
            required={true}
            className='w-fit'
            initialValue={record.hexColor}
            value={newRecord.hexColor}
            onValueChange={(val: AntColor) => setNewRecord({ ...newRecord, hexColor: val.toHexString() })}
          >
            <ColorPicker
              disabled={true}
              value={record.hexColor}
              defaultFormat='hex'
              defaultValue={record.hexColor}
              showText
            />
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <>
      <BaseLayout
        searchValue={searchText}
        onSearch={(value) => {
          if (value.length > 0) {
            colorService.getListItems(
              {
                ...defaultRequestBody,
                search: {
                  field: 'name',
                  term: value
                }
              },
              setLoading,
              (meta) => {
                if (meta?.success) {
                  selfConvertDataSource(meta.data as Color[])
                }
              }
            )
          }
        }}
        onSortChange={(val) => {
          colorService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta.data as Color[])
            }
          })
        }}
        onResetClick={() => {
          setSearchText('')
          colorService.getListItems(defaultRequestBody, setLoading, (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta.data as Color[])
              message.success('Reloaded!')
            }
          })
        }}
        dateCreation={dateCreation}
        onDateCreationChange={setDateCreation}
        onAddNewClick={() => setOpenModal(true)}
      >
        <SkyTable
          bordered
          loading={loading}
          columns={cols}
          dataSource={dataSource}
          rowClassName='editable-row'
          metaData={colorService.metaData}
          onPageChange={handlePageChange}
          editingKey={editingKey}
          isDateCreation={dateCreation}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord(record)
                handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!, newRecord)
            },
            onDelete: {
              onClick: (_e, record) => handleStartDeleting(record!.key!)
            },
            onConfirmCancelEditing: () => handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: true
          }}
        />
      </BaseLayout>
      {openModal && <ModalAddNewColor openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />}
    </>
  )
}

export default ColorTable
