/* eslint-disable react-refresh/only-export-components */
import { Collapse, Divider, Space, Typography } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import { TableItemWithKey } from '~/components/hooks/useTable'
import ListItem from '~/components/ui/Table/ListItem'
import ListItemRow from '~/components/ui/Table/ListItemRow'
import { Color, Group, Print } from '~/typing'
import DayJS from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'
import ProductProgressStatus from './ProductProgressStatus'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: TableItemWithKey<ProductTableDataType>
  isEditing: boolean
  editingKey: React.Key
  dateCreation: boolean
  onSaveClick?: React.MouseEventHandler<HTMLElement> | undefined
  onClickStartEditing?: React.MouseEventHandler<HTMLElement> | undefined
  onConfirmCancelEditing?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmCancelDeleting?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmDelete?: (e?: React.MouseEvent<HTMLElement>) => void
  onStartDeleting?: (key: React.Key) => void
}

const ProductListItem: React.FC<Props> = ({
  data,
  isEditing,
  editingKey,
  dateCreation,
  onSaveClick,
  onClickStartEditing,
  onConfirmCancelEditing,
  onConfirmCancelDeleting,
  onConfirmDelete,
  onStartDeleting,
  ...props
}) => {
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

  useEffect(() => {
    if (isEditing) {
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
  }, [isEditing])

  return (
    <ListItem
      itemId={data.key ?? data.id!}
      isEditing={isEditing}
      createdAt={data.createdAt}
      updatedAt={data.updatedAt}
      editingKey={editingKey}
      dateCreation={dateCreation}
      onSaveClick={onSaveClick}
      onClickStartEditing={onClickStartEditing}
      onConfirmCancelEditing={onConfirmCancelEditing}
      onConfirmCancelDeleting={onConfirmCancelDeleting}
      onConfirmDelete={onConfirmDelete}
      onStartDeleting={onStartDeleting}
      label={data.productCode}
      name='productCode'
      {...props}
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
                    isEditing={isEditing}
                    dataIndex='colorID'
                    inputType='select'
                    initialField={{
                      value: data.productColor?.colorID,
                      selectItems: colors.map((i) => {
                        return { label: i.name, value: i.id, optionData: i.hexColor }
                      })
                    }}
                    value={data.productColor?.color?.name}
                  />
                  <ListItemRow
                    label='Số lượng PO'
                    isEditing={isEditing}
                    dataIndex='quantityPO'
                    inputType='number'
                    initialField={{
                      value: data.quantityPO
                    }}
                    value={data.quantityPO}
                  />
                  <ListItemRow
                    label='Ngày nhập NPL'
                    isEditing={isEditing}
                    dataIndex='dateInputNPL'
                    inputType='datepicker'
                    initialField={{
                      value: DayJS(data.dateInputNPL)
                    }}
                    value={DayJS(data.dateInputNPL).format('DD/MM/YYYY')}
                  />
                  <ListItemRow
                    label='Ngày xuất FCR'
                    isEditing={isEditing}
                    dataIndex='dateOutputFCR'
                    inputType='datepicker'
                    initialField={{
                      value: DayJS(data.dateOutputFCR)
                    }}
                    value={DayJS(data.dateOutputFCR).format('DD/MM/YYYY')}
                  />
                  <ListItemRow
                    label='Nhóm'
                    isEditing={isEditing}
                    dataIndex='groupID'
                    inputType='select'
                    initialField={{
                      value: data.productGroup?.groupID,
                      selectItems: groups.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                          optionData: item.id
                        }
                      })
                    }}
                    value={data.productGroup?.group?.name}
                  />
                  <ListItemRow
                    label='Nơi in'
                    isEditing={isEditing}
                    dataIndex='printID'
                    inputType='select'
                    initialField={{
                      value: data.printablePlace?.printID,
                      selectItems: prints.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                          optionData: item.id
                        }
                      })
                    }}
                    value={data.printablePlace?.print?.name}
                  />
                </Space>
                <ProductProgressStatus record={data} />
              </Space>
            )
          }
        ]}
      />
    </ListItem>
  )
}

export default memo(ProductListItem)
