import { List } from 'antd'
import React from 'react'
import { TableItemWithKey, TableModelProps } from '~/components/hooks/useTable'
import { ImportationTableDataType } from '../ImportationPage'

const ImportationList: React.FC<TableModelProps<ImportationTableDataType>> = ({ ...props }) => {
  console.log('Importation list...')
  return (
    <>
      <List
        className={props.className}
        itemLayout='vertical'
        size='large'
        pagination={{
          onChange: props.onPageChange,
          current: props.metaData?.page,
          pageSize: 5,
          total: props.metaData?.total
        }}
        loading={props.loading}
        dataSource={props.dataSource}
        renderItem={(item: TableItemWithKey<ImportationTableDataType>) => (
          <ProductListItem
            data={item}
            key={item.key}
            dateCreation={props.dateCreation}
            editingKey={props.editingKey}
            isEditing={props.isEditing(item.key!)}
            onSaveClick={() => {
              console.log(item)
              props.onSaveClick(item)
            }}
            onClickStartEditing={() => props.onStartEditing(item.key!)}
            onConfirmCancelEditing={() => props.onConfirmCancelEditing()}
            onConfirmCancelDeleting={() => props.onConfirmCancelDeleting()}
            onConfirmDelete={() => props.onConfirmDelete(item)}
            onStartDeleting={() => props.setDeleteKey(item.key!)}
          />
        )}
      />
    </>
  )
}

export default ImportationList
