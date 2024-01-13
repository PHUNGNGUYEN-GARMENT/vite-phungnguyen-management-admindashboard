/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Collapse, Divider, Space, Typography } from 'antd'
import React, { memo } from 'react'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import ListItemRow from '~/components/sky-ui/SkyTable/ListItemRow'
import {
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit
} from '~/utils/helpers'
import { ImportationTableDataType } from '../type'

interface Props extends SkyListItemProps<ImportationTableDataType> {
  newRecord: any
  setNewRecord: (newRecord: any) => void
}

const ImportationListItem: React.FC<Props> = ({ record, newRecord, setNewRecord, ...props }) => {
  return (
    <SkyListItem
      label={`Kiện ${numberValidatorDisplay(record.quantity)}`}
      record={record}
      dataIndex='quantity'
      key={record.key}
      inputType='number'
      isEditing={props.isEditing}
      isDateCreation={props.isDateCreation}
      actions={props.actions}
    >
      <Collapse
        items={[
          {
            key: '1',
            label: (
              <Typography.Title className='m-0' level={5} type='secondary'>
                Thông tin chi tiết
              </Typography.Title>
            ),
            children: (
              <Space className='flex w-full gap-0' split={<Divider className='my-3' />} direction='vertical'>
                <ListItemRow
                  label='Số lượng'
                  isEditing={props.isEditing}
                  dataIndex='quantity'
                  inputType='number'
                  initialValue={numberValidatorInit(record.quantity)}
                  value={newRecord.quantity}
                  onValueChange={(val) => setNewRecord({ ...newRecord, quantity: numberValidatorChange(val) })}
                >
                  <Typography.Text type='secondary' className='w-full font-medium'>
                    {numberValidatorDisplay(record.quantity)}
                  </Typography.Text>
                </ListItemRow>
                <ListItemRow
                  label='Ngày nhập'
                  isEditing={props.isEditing}
                  dataIndex='dateImported'
                  inputType='datepicker'
                  initialValue={dateValidatorInit(record.dateImported)}
                  onValueChange={(val) => setNewRecord({ ...newRecord, dateImported: dateValidatorChange(val) })}
                >
                  <Typography.Text type='secondary' className='w-full font-medium'>
                    {dateValidatorDisplay(record.dateImported)}
                  </Typography.Text>
                </ListItemRow>
              </Space>
            )
          }
        ]}
      />
    </SkyListItem>
  )
}

export default memo(ImportationListItem)
