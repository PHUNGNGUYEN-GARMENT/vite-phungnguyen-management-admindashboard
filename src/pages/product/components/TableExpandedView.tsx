/* eslint-disable @typescript-eslint/no-explicit-any */
import { List, ListProps } from 'antd'
import { ItemWithKeyAndTitleType } from '~/components/ui/Table/ListableExpandedRowItem'

interface Props<T extends ItemWithKeyAndTitleType> extends ListProps<T> {
  items: T[]
  loading: boolean
  isEditing?: boolean
}

const ProductTableExpandedView = <T extends ItemWithKeyAndTitleType>({ ...props }: Props<T>) => {
  return (
    <List
      {...props}
      className={props.className}
      itemLayout='vertical'
      size='large'
      pagination={false}
      loading={props.loading}
      dataSource={props.items}
      renderItem={(item: T, index: number) => (
        <>
          {props.children ? (
            props.children
          ) : (
            <ListableExpandedRowItem key={index} isEditing={props.isEditing} item={item} />
          )}
        </>
      )}
    />
  )
}

export default ProductTableExpandedView
