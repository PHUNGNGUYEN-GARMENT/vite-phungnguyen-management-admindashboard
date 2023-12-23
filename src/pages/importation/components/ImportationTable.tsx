/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { useSelector } from 'react-redux'
import { TableModelProps } from '~/components/hooks/useTable'
import EditableCellNew from '~/components/sky-ui/Table/EditableCellNew'
import ItemAction from '~/components/sky-ui/Table/ItemAction'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ImportationTableDataType } from '../ImportationPage'

const ImportationTable: React.FC<TableModelProps<ImportationTableDataType>> = ({ ...props }) => {
  const user = useSelector((state: RootState) => state.user)
  console.log('Importation page loading...')

  const actionsCols: ColumnType<ImportationTableDataType>[] = [
    {
      title: 'Operation',
      width: '1%',
      dataIndex: 'operation',
      render: (_value: any, item: ImportationTableDataType) => {
        return (
          <>
            <ItemAction
              isEditing={props.isEditing(item.key!)}
              editingKey={props.editingKey}
              onSaveClick={() => {
                console.log(item)
                props.onSaveClick(item)
              }}
              deleteDisabled={item.importation?.id === undefined}
              onClickStartEditing={() => props.onStartEditing(item.key!)}
              onConfirmCancelEditing={() => props.onConfirmCancelEditing()}
              onConfirmCancelDeleting={() => props.onConfirmCancelDeleting()}
              onConfirmDelete={() => props.onConfirmDelete(item)}
              onStartDeleting={() => props.setDeleteKey(item.key!)}
            />
          </>
        )
      }
    }
  ]

  const commonCols: ColumnType<ImportationTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='productCode'
              title='Mã hàng'
              inputType='text'
              required={true}
              initialField={{ value: record.productCode }}
            >
              <Typography.Text className='text-md flex-shrink-0 font-bold'>{record.productCode}</Typography.Text>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Lô nhập',
      dataIndex: 'quantity',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='quantity'
              title='Lô nhập'
              inputType='number'
              required={true}
              initialField={{ value: record.importation?.quantity }}
            >
              <span>{record.importation?.quantity}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Nhày nhập',
      dataIndex: 'dateImported',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: ImportationTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={props.isEditing(record.key!)}
              dataIndex='dateImported'
              title='NPL'
              inputType='datepicker'
              required={true}
              initialField={{ value: DayJS(record.importation?.dateImported) }}
            >
              <span>
                {record.importation?.dateImported &&
                  DayJS(record.importation?.dateImported).format(DatePattern.display)}
              </span>
            </EditableCellNew>
          </>
        )
      }
    }
  ]

  const dateCreationColumns: ColumnType<ImportationTableDataType>[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '5%',
      render: (_value: any, record: ImportationTableDataType) => {
        return <span>{DayJS(record.createdAt).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '5%',
      responsive: ['md'],
      render: (_value: any, record: ImportationTableDataType) => {
        return <span>{DayJS(record.updatedAt).format(DatePattern.display)}</span>
      }
    }
  ]

  const adminColumns: ColumnType<ImportationTableDataType>[] = props.dateCreation
    ? [...commonCols, ...dateCreationColumns, ...actionsCols]
    : [...commonCols, ...actionsCols]

  const staffColumns: ColumnType<ImportationTableDataType>[] = [...commonCols]

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
      />
    </>
  )
}

export default ImportationTable
