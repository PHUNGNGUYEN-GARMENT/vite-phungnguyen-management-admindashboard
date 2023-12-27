/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Collapse, Divider, Space, Typography } from 'antd'
import React, { memo } from 'react'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import ListItemRow from '~/components/sky-ui/SkyTable/ListItemRow'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ImportationTableDataType } from './ImportationList'

interface Props extends SkyListItemProps<ImportationTableDataType> {
  newRecord: any
  setNewRecord: (newRecord: any) => void
}

const ImportationListItem: React.FC<Props> = ({ record, newRecord, setNewRecord, ...props }) => {
  return (
    <SkyListItem
      label={`Kiện ${record.quantity}`}
      labelName='quantity'
      record={record}
      key={record.key}
      labelEditing={false}
      value={newRecord.quantity}
      defaultValue={record.quantity}
      onChange={(e) => setNewRecord({ ...newRecord, quantity: e.target.value })}
      isEditing={props.isEditing}
      isDateCreation={props.isDateCreation}
      actions={props.actions}
    >
      <Collapse
        className=''
        items={[
          {
            key: '1',
            label: (
              <Typography.Title className='m-0' level={5} type='secondary'>
                Thông tin chi tiết
              </Typography.Title>
            ),
            children: (
              <Space direction='vertical' className='w-full gap-4'>
                <Space className='flex gap-0' split={<Divider className='my-3' />} direction='vertical'>
                  <ListItemRow
                    {...props}
                    label='Số lượng'
                    isEditing={props.isEditing}
                    dataIndex='quantity'
                    inputType='number'
                    initialValue={record.quantity}
                    value={newRecord.quantity}
                    onValueChange={(val) => setNewRecord({ ...newRecord, quantity: val })}
                  >
                    <Typography.Text type='secondary' className='w-full font-medium'>
                      {record.quantity}
                    </Typography.Text>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày nhập'
                    isEditing={props.isEditing}
                    dataIndex='dateImported'
                    inputType='datepicker'
                    initialValue={DayJS(record.dateImported)}
                    value={DayJS(newRecord.dateImported)}
                    onValueChange={(val) =>
                      setNewRecord({ ...newRecord, dateImported: DayJS(val).format(DatePattern.iso8601) })
                    }
                  >
                    <Typography.Text type='secondary' className='w-full font-medium'>
                      {DayJS(record.dateImported).format(DatePattern.display)}
                    </Typography.Text>
                  </ListItemRow>
                </Space>
              </Space>
            )
          }
        ]}
      />
    </SkyListItem>
  )
}

export default memo(ImportationListItem)
