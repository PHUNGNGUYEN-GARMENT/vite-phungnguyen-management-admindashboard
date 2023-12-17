/* eslint-disable @typescript-eslint/no-explicit-any */
import { List } from 'antd'
import React from 'react'
import { ResponseDataType } from '~/api/client'
import { TableItemWithKey } from '~/components/hooks/useTable'
import { ProductTableDataType } from '../type'
import ProductListItem from './ProductListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {
  loading: boolean
  setLoading: (enable: boolean) => void
  metaData: ResponseDataType | undefined
  dataSource: TableItemWithKey<ProductTableDataType>[]
  dateCreation: boolean
  editingKey: React.Key
  isEditing: (key: React.Key) => boolean
  onPageChange: (page: number, pageSize: number) => void
  onConfirmDelete: (item: TableItemWithKey<ProductTableDataType>) => void
  setDeleteKey: (value: React.SetStateAction<React.Key>) => void
  onSaveClick: (item: TableItemWithKey<ProductTableDataType>) => void
  onStartEditing: (key: React.Key) => void
  onConfirmCancelEditing: () => void
  onConfirmCancelDeleting: () => void
}

const ProductList: React.FC<Props> = ({ ...props }) => {
  console.log('Load ProductList')
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
        renderItem={(item: TableItemWithKey<ProductTableDataType>) => (
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

export default ProductList
