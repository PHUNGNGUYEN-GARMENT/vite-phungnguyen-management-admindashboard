/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd'
import type { ColumnType, TableProps } from 'antd/es/table'
import { useSelector } from 'react-redux'
import { ResponseDataType } from '~/api/client'
import { ProductTableDataType } from '~/pages/product2/type'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import ActionRow, { ActionButtonProps } from '../ActionRow'

export interface SkyTableProps<T extends { key?: React.Key; createdAt?: string; updatedAt?: string }>
  extends TableProps<T> {
  metaData: ResponseDataType | undefined
  onPageChange: (page: number, pageSize: number) => void
  columns: ColumnType<T>[]
  isDateCreation?: boolean
  editingKey: React.Key
  disableEditing?: boolean
  disableDeleting?: boolean
  onAdd?: ActionButtonProps<T>
  onSave: ActionButtonProps<T>
  onEdit: ActionButtonProps<T>
  onDelete?: ActionButtonProps<T>
  onConfirmCancelEditing: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelDeleting: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmDelete: (record: T) => void
}

const SkyTable = <T extends { key?: React.Key; createdAt?: string; updatedAt?: string }>({
  ...props
}: SkyTableProps<T>) => {
  const user = useSelector((state: RootState) => state.user)

  const actionsCols: ColumnType<T>[] = [
    {
      title: 'Operation',
      width: '1%',
      dataIndex: 'operation',
      render: (_value: any, record: T) => {
        return (
          <>
            <ActionRow
              isEditing={record.key === props.editingKey}
              editingKey={props.editingKey}
              onAdd={{
                onClick: (e) => props.onAdd?.onClick(e, record),
                disabled: props.disableEditing ?? props.editingKey !== '',
                isShow: props.onAdd?.isShow ?? true
              }}
              onSave={{
                onClick: (e) => props.onSave?.onClick(e, record),
                disabled: props.onSave?.disabled,
                isShow: props.onSave?.isShow ?? true
              }}
              onEdit={{
                onClick: (e) => props.onEdit?.onClick(e, record),
                disabled: props.disableEditing ?? props.editingKey !== '',
                isShow: props.onEdit?.isShow ?? true
              }}
              onDelete={{
                onClick: (e) => props.onDelete?.onClick(e, record),
                disabled: props.disableDeleting ?? props.editingKey !== '',
                isShow: props.onDelete?.isShow ?? true
              }}
              onConfirmCancelEditing={props.onConfirmCancelEditing}
              onConfirmCancelDeleting={props.onConfirmCancelDeleting}
              onConfirmDelete={() => props.onConfirmDelete(record)}
            />
          </>
        )
      }
    }
  ]

  const dateCreationColumns: ColumnType<T>[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '5%',
      render: (_value: any, record: T) => {
        return <span>{DayJS(record.createdAt).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '5%',
      responsive: ['md'],
      render: (_value: any, record: ProductTableDataType) => {
        return <span>{DayJS(record.updatedAt).format(DatePattern.display)}</span>
      }
    }
  ]

  const adminColumns: ColumnType<T>[] = props.isDateCreation
    ? [...props.columns, ...dateCreationColumns, ...actionsCols]
    : [...props.columns, ...actionsCols]

  const staffColumns: ColumnType<T>[] = [...props.columns]

  return (
    <>
      <Table
        loading={props.loading}
        bordered
        columns={user.isAdmin ? adminColumns : staffColumns}
        dataSource={props.dataSource}
        rowClassName='editable-row'
        pagination={{
          onChange: props.onPageChange,
          current: props.metaData?.page,
          pageSize: 5,
          total: props.metaData?.total
        }}
        expandable={props.expandable}
      />
    </>
  )
}

export default SkyTable
