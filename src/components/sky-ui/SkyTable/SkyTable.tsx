/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd'
import type { ColumnType, TableProps } from 'antd/es/table'
import { useSelector } from 'react-redux'
import { ResponseDataType } from '~/api/client'
import { ProductTableDataType } from '~/pages/product2/type'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import ActionRow, { ActionProps } from '../ActionRow'

export interface SkyTableProps<T extends { key?: React.Key; createdAt?: string; updatedAt?: string }>
  extends TableProps<T> {
  metaData: ResponseDataType | undefined
  onPageChange: (page: number, pageSize: number) => void
  columns: ColumnType<T>[]
  isDateCreation?: boolean
  editingKey: React.Key
  actions?: ActionProps<T>
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
                onClick: (e) => props.actions?.onAdd?.onClick?.(e, record),
                disabled: props.actions?.onAdd?.disabled ?? props.editingKey !== '',
                isShow: props.actions?.onAdd ? props.actions.onAdd.isShow ?? true : false
              }}
              onSave={{
                onClick: (e) => props.actions?.onSave?.onClick?.(e, record),
                disabled: props.actions?.onSave?.disabled ?? props.editingKey !== '',
                isShow: props.actions?.onSave ? props.actions.onSave.isShow ?? true : false
              }}
              onEdit={{
                onClick: (e) => props.actions?.onEdit?.onClick?.(e, record),
                disabled: props.actions?.onEdit?.disabled ?? props.editingKey !== '',
                isShow: props.actions?.onEdit ? props.actions.onEdit.isShow ?? true : false
              }}
              onDelete={{
                onClick: (e) => props.actions?.onDelete?.onClick?.(e, record),
                disabled: props.actions?.onDelete?.disabled ?? props.editingKey !== '',
                isShow: props.actions?.onDelete ? props.actions.onDelete.isShow ?? true : false
              }}
              onConfirmCancelEditing={props.actions?.onConfirmCancelEditing}
              onConfirmCancelDeleting={props.actions?.onConfirmCancelDeleting}
              onConfirmDelete={() => props.actions?.onConfirmDelete?.(record)}
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
    ? props.actions?.isShow
      ? [...props.columns, ...dateCreationColumns, ...actionsCols]
      : [...props.columns, ...dateCreationColumns]
    : props.actions?.isShow
      ? [...props.columns, ...actionsCols]
      : [...props.columns]

  const staffColumns: ColumnType<T>[] = [...props.columns]

  return (
    <>
      <Table
        loading={props.loading}
        bordered
        columns={user.isAdmin ? adminColumns : staffColumns}
        dataSource={props.dataSource}
        rowClassName='editable-row'
        pagination={
          props.pagination ?? {
            onChange: props.onPageChange,
            current: props.metaData?.page,
            pageSize: 5,
            total: props.metaData?.total
          }
        }
        expandable={props.expandable}
      />
    </>
  )
}

export default SkyTable
