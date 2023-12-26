/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd'
import type { ColumnType, TableProps } from 'antd/es/table'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ResponseDataType } from '~/api/client'
import { ProductTableDataType } from '~/pages/product/type'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'
import ActionRow, { ActionProps } from '../ActionRow'

export interface SkyTableProps<T extends { key?: React.Key; createdAt?: string; updatedAt?: string }>
  extends TableProps<T> {
  metaData: ResponseDataType | undefined
  onPageChange?: (page: number, pageSize: number) => void
  columns: ColumnType<T>[]
  isDateCreation?: boolean
  actions?: ActionProps<T>
}

const SkyTable = <T extends { key?: React.Key; createdAt?: string; updatedAt?: string }>({
  ...props
}: SkyTableProps<T>) => {
  const user = useSelector((state: RootState) => state.user)
  const [editingKey, setEditingKey] = useState<React.Key | undefined>(undefined)

  const isEditing = (key?: React.Key): boolean => {
    return editingKey === key
  }

  const actionsCols: ColumnType<T>[] = [
    {
      title: 'Operation',
      width: '1%',
      dataIndex: 'operation',
      render: (_value: any, record: T) => {
        return (
          <>
            <ActionRow
              isEditing={isEditing(record.key)}
              onAdd={{
                onClick: (e) => props.actions?.onAdd?.onClick?.(e, record),
                disabled: props.actions?.onAdd?.disabled ?? isEditing(record.key),
                isShow: props.actions?.onAdd ? props.actions.onAdd.isShow ?? true : false
              }}
              onSave={{
                onClick: (e) => props.actions?.onSave?.onClick?.(e, record),
                disabled: props.actions?.onSave?.disabled ?? isEditing(record.key),
                isShow: props.actions?.onSave ? props.actions.onSave.isShow ?? true : false
              }}
              onEdit={{
                onClick: (e) => {
                  setEditingKey(record.key)
                  props.actions?.onEdit?.onClick?.(e, record)
                },
                disabled: props.actions?.onEdit?.disabled ?? isEditing(record.key),
                isShow: props.actions?.onEdit ? props.actions.onEdit.isShow ?? true : false
              }}
              onDelete={{
                onClick: (e) => props.actions?.onDelete?.onClick?.(e, record),
                disabled: props.actions?.onDelete?.disabled ?? isEditing(record.key),
                isShow: props.actions?.onDelete ? props.actions.onDelete.isShow ?? true : false
              }}
              onConfirmCancelEditing={(e) => {
                setEditingKey('')
                props.actions?.onConfirmCancelEditing?.(e)
              }}
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
        {...props}
        className={props.className}
        loading={props.loading}
        bordered
        columns={user.isAdmin ? adminColumns : staffColumns}
        dataSource={props.dataSource}
        rowClassName={cn('editable-row', props.rowClassName)}
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

// export const mergedColumns = <T extends { key?: React.Key }>(
//   cols: {
//     title: string
//     dataIndex: string
//     required: boolean
//     type: InputType
//     width?: string | number | undefined
//   }[],
//   editingKey: React.Key,
//   newRecord: any,
//   setNewRecord: (newRecord: any) => void
// ): ColumnType<T>[] => {
//   return cols.map((item) => {
//     return {
//       title: item.title,
//       dataIndex: item.dataIndex,
//       width: item.width,
//       render: (_value: any, record: T) => {
//         return (
//           <EditableStateCell
//             isEditing={editingKey === record.key}
//             dataIndex={item.dataIndex}
//             title={item.title}
//             inputType={item.type}
//             required={item.required}
//             initialValue={{
//               [item.dataIndex]: record
//             }}
//             value={newRecord.productCode}
//             onValueChange={(val) => setNewRecord({ ...newRecord, [item.dataIndex]: val })}
//           >
//             <Typography.Text className='text-md flex-shrink-0 font-bold'>{record.productCode}</Typography.Text>
//           </EditableStateCell>
//         )
//       }
//     }
//   })
// }

export default SkyTable
