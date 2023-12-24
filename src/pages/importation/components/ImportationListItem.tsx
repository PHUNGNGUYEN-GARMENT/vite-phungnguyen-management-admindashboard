/* eslint-disable react-refresh/only-export-components */
import { Collapse, Divider, Space, Typography } from 'antd'
import React, { memo } from 'react'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import ListItemRow from '~/components/sky-ui/SkyTable/ListItemRow'
import DayJS from '~/utils/date-formatter'
import { ImportationTableDataType } from '../ImportationPage'

interface Props extends SkyListItemProps<ImportationTableDataType> {
  record: ImportationTableDataType
}

const ImportationListItem: React.FC<Props> = ({ record, ...props }) => {
  return (
    <SkyListItem
      label={record.productCode}
      labelName='productCode'
      record={record}
      key={record.key}
      isDateCreation={props.isDateCreation}
      editingKey={props.editingKey}
      isEditing={props.isEditing}
      onSave={props.onSave}
      onEdit={props.onEdit}
      onDelete={props.onDelete}
      onConfirmCancelEditing={props.onConfirmCancelEditing}
      onConfirmCancelDeleting={props.onConfirmCancelDeleting}
      onConfirmDelete={props.onConfirmDelete}
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
                    label='Lô nhập'
                    isEditing={props.isEditing}
                    dataIndex='quantity'
                    inputType='number'
                    initialField={{
                      value: record.importation?.quantity
                    }}
                    value={record.importation?.quantity}
                  />
                  <ListItemRow
                    label='Ngày nhập'
                    isEditing={props.isEditing}
                    dataIndex='dateImported'
                    inputType='datepicker'
                    initialField={{
                      value: DayJS(record.importation?.dateImported)
                    }}
                    value={DayJS(record.importation?.dateImported).format('DD/MM/YYYY')}
                  />
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
