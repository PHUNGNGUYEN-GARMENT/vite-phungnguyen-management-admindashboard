/* eslint-disable @typescript-eslint/no-explicit-any */
import { List, ListProps } from 'antd'
import { ResponseDataType } from '~/api/client'

export interface SkyListProps<T extends { key?: React.Key }> extends ListProps<T> {
  metaData: ResponseDataType | undefined
  onPageChange?: (page: number, pageSize: number) => void
  isDateCreation?: boolean
}

const SkyList = <T extends { key?: React.Key }>({ ...props }: SkyListProps<T>) => {
  return (
    <>
      <List
        className={props.className}
        itemLayout='vertical'
        size='large'
        loading={props.loading}
        pagination={{
          onChange: props.onPageChange,
          current: props.metaData?.page,
          pageSize: 5,
          total: props.metaData?.total
        }}
        renderItem={props.renderItem}
        dataSource={props.dataSource}
      />
    </>
  )
}

export default SkyList
