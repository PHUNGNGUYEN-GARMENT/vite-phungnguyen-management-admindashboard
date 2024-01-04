/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Collapse, ColorPicker, Divider, Flex, Space, Typography } from 'antd'
import React, { memo } from 'react'
import useTable from '~/components/hooks/useTable'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import ListItemRow from '~/components/sky-ui/SkyTable/ListItemRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { GarmentAccessoryNote } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useGarmentAccessory from '../hooks/useGarmentAccessory'
import { GarmentAccessoryTableDataType } from '../type'

interface Props extends SkyListItemProps<GarmentAccessoryTableDataType> {
  newRecord: GarmentAccessoryTableDataType
  setNewRecord: (newRecord: GarmentAccessoryTableDataType) => void
}

const GarmentAccessoryListItem: React.FC<Props> = ({ record, newRecord, setNewRecord, ...props }) => {
  const table = useTable<GarmentAccessoryTableDataType>([])
  const { accessoryNotes } = useGarmentAccessory(table)

  return (
    <SkyListItem
      label={record.productCode}
      dataIndex='productCode'
      record={record}
      key={record.key}
      defaultValue={record.productCode}
      onValueChange={(e) => setNewRecord({ ...newRecord, productCode: e.target.value })}
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
                    isEditing={false}
                    dataIndex='colorID'
                    label='Màu'
                    inputType='colorselector'
                    required={false}
                  >
                    <Flex className='' justify='space-between' align='center' gap={10}>
                      <SkyTableTypography status={record.productColor?.color?.status}>
                        {record.productColor?.color?.name}
                      </SkyTableTypography>
                      {record.productColor && (
                        <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
                      )}
                    </Flex>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Cắt được'
                    isEditing={props.isEditing}
                    dataIndex='amountCutting'
                    inputType='number'
                    initialValue={record.garmentAccessory ? record.garmentAccessory?.amountCutting : ''}
                    value={newRecord && (newRecord.garmentAccessory?.amountCutting ?? 0)}
                    onValueChange={(val) =>
                      setNewRecord({
                        ...newRecord,
                        garmentAccessory: { ...newRecord.garmentAccessory, amountCutting: val }
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.garmentAccessory ? record.garmentAccessory?.amountCutting : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Còn lại'
                    isEditing={false}
                    dataIndex='remainingAmount'
                    inputType='number'
                  >
                    <SkyTableTypography status={record.status}>
                      {record.garmentAccessory?.amountCutting &&
                        record.garmentAccessory.amountCutting > 0 &&
                        (record.quantityPO ?? 0) - (record.garmentAccessory?.amountCutting ?? 0)}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày giao chuyền'
                    isEditing={props.isEditing}
                    dataIndex='passingDeliveryDate'
                    inputType='datepicker'
                    initialValue={
                      record.garmentAccessory
                        ? record.garmentAccessory.passingDeliveryDate &&
                          DayJS(record.garmentAccessory.passingDeliveryDate)
                        : undefined
                    }
                    onValueChange={(val) =>
                      setNewRecord({
                        ...newRecord,
                        garmentAccessory: {
                          ...newRecord.garmentAccessory,
                          passingDeliveryDate: val ? DayJS(val).format(DatePattern.iso8601) : null
                        }
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.garmentAccessory
                        ? record.garmentAccessory.passingDeliveryDate &&
                          DayJS(record.garmentAccessory.passingDeliveryDate).format(DatePattern.display)
                        : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ghi chú'
                    isEditing={props.isEditing}
                    dataIndex='accessoryNotes'
                    inputType='multipleselect'
                    selectProps={{
                      options: accessoryNotes.map((item) => {
                        return {
                          value: item.id,
                          label: item.title
                        }
                      }),
                      defaultValue:
                        record.garmentAccessoryNotes &&
                        record.garmentAccessoryNotes.map((item) => {
                          return {
                            value: item.accessoryNote?.id,
                            label: item.accessoryNote?.title
                          }
                        })
                    }}
                    onValueChange={(val: number[]) =>
                      setNewRecord({
                        ...newRecord,
                        garmentAccessoryNotes: val.map((item) => {
                          return { accessoryNoteID: item, noteStatus: 'enough' } as GarmentAccessoryNote
                        })
                      })
                    }
                  >
                    <Space size='small' wrap>
                      {record.garmentAccessoryNotes &&
                        record.garmentAccessoryNotes.map((item, index) => {
                          return (
                            <SkyTableTypography
                              className='my-[2px] h-6 rounded-sm bg-black bg-opacity-[0.06] px-2 py-1'
                              key={index}
                              status={item.status}
                            >
                              {item.accessoryNote?.title}
                            </SkyTableTypography>
                          )
                        })}
                    </Space>
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

export default memo(GarmentAccessoryListItem)
