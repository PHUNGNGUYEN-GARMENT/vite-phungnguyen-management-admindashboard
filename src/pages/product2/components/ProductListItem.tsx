/* eslint-disable react-refresh/only-export-components */
import { Collapse, Divider, Space, Typography } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import ListItemRow from '~/components/sky-ui/Table/ListItemRow'
import { Color, Group, Print } from '~/typing'
import DayJS from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'
import ProductProgressStatus from './ProductProgressStatus'

interface Props extends SkyListItemProps<ProductTableDataType> {
  record: ProductTableDataType
}

const ProductListItem: React.FC<Props> = ({ record, ...props }) => {
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

  useEffect(() => {
    if (props.isEditing) {
      ColorAPI.getItems(defaultRequestBody).then((meta) => {
        if (meta?.success) {
          const items = meta.data as Color[]
          setColors(items)
        }
      })
      GroupAPI.getItems(defaultRequestBody).then((meta) => {
        if (meta?.success) {
          const items = meta.data as Group[]
          setGroups(items)
        }
      })
      PrintAPI.getItems(defaultRequestBody).then((meta) => {
        if (meta?.success) {
          const items = meta.data as Print[]
          setPrints(items)
        }
      })
    }
  }, [props.isEditing])

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
                    label='Màu'
                    isEditing={props.isEditing}
                    dataIndex='colorID'
                    inputType='select'
                    initialField={{
                      value: record.productColor?.colorID,
                      selectItems: colors.map((i) => {
                        return { label: i.name, value: i.id, optionData: i.hexColor }
                      })
                    }}
                    value={record.productColor?.color?.name}
                  />
                  <ListItemRow
                    label='Số lượng PO'
                    isEditing={props.isEditing}
                    dataIndex='quantityPO'
                    inputType='number'
                    initialField={{
                      value: record.quantityPO
                    }}
                    value={record.quantityPO}
                  />
                  <ListItemRow
                    label='Ngày nhập NPL'
                    isEditing={props.isEditing}
                    dataIndex='dateInputNPL'
                    inputType='datepicker'
                    initialField={{
                      value: DayJS(record.dateInputNPL)
                    }}
                    value={DayJS(record.dateInputNPL).format('DD/MM/YYYY')}
                  />
                  <ListItemRow
                    label='Ngày xuất FCR'
                    isEditing={props.isEditing}
                    dataIndex='dateOutputFCR'
                    inputType='datepicker'
                    initialField={{
                      value: DayJS(record.dateOutputFCR)
                    }}
                    value={DayJS(record.dateOutputFCR).format('DD/MM/YYYY')}
                  />
                  <ListItemRow
                    label='Nhóm'
                    isEditing={props.isEditing}
                    dataIndex='groupID'
                    inputType='select'
                    initialField={{
                      value: record.productGroup?.groupID,
                      selectItems: groups.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                          optionData: item.id
                        }
                      })
                    }}
                    value={record.productGroup?.group?.name}
                  />
                  <ListItemRow
                    label='Nơi in'
                    isEditing={props.isEditing}
                    dataIndex='printID'
                    inputType='select'
                    required={false}
                    initialField={{
                      value: record.printablePlace?.printID,
                      selectItems: prints.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                          optionData: item.id
                        }
                      })
                    }}
                    value={record.printablePlace?.print?.name}
                  />
                </Space>
                <ProductProgressStatus collapse record={record} />
              </Space>
            )
          }
        ]}
      />
    </SkyListItem>
  )
}

export default memo(ProductListItem)
