/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Collapse, ColorPicker, Divider, Flex, Space, Typography } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import useDevice from '~/components/hooks/useDevice'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import ListItemRow from '~/components/sky-ui/SkyTable/ListItemRow'
import ImportationList from '~/pages/importation/components/ImportationList'
import ImportationTable from '~/pages/importation/components/ImportationTable'
import { Color, Group, Print } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'
import ProductProgressStatus from './ProductProgressStatus'

interface Props extends SkyListItemProps<ProductTableDataType> {
  newRecord: any
  setNewRecord: (newRecord: any) => void
}

const ProductListItem: React.FC<Props> = ({ record, newRecord, setNewRecord, ...props }) => {
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])
  const { width } = useDevice()

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
                    label='Màu'
                    isEditing={props.isEditing}
                    dataIndex='colorID'
                    inputType='select'
                    selectItems={colors.map((i) => {
                      return { label: i.name, value: i.id, optionData: i.hexColor }
                    })}
                    initialValue={record.productColor?.colorID}
                    value={newRecord.colorID}
                    onValueChange={(val) => setNewRecord({ ...newRecord, colorID: val })}
                  >
                    <Flex className='w-full' justify='space-between' align='center' gap={10}>
                      <Typography.Text type='secondary'>{record.productColor?.color?.name}</Typography.Text>
                      {record.productColor && (
                        <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
                      )}
                    </Flex>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Số lượng PO'
                    isEditing={props.isEditing}
                    dataIndex='quantityPO'
                    inputType='number'
                    initialValue={record.quantityPO}
                    value={newRecord.quantityPO}
                    onValueChange={(val) => setNewRecord({ ...newRecord, quantityPO: val })}
                  >
                    <Typography.Text type='secondary' className='w-full font-medium'>
                      {record.quantityPO}
                    </Typography.Text>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày nhập NPL'
                    isEditing={props.isEditing}
                    dataIndex='dateInputNPL'
                    inputType='datepicker'
                    initialValue={DayJS(record.dateInputNPL)}
                    value={DayJS(newRecord.dateInputNPL)}
                    onValueChange={(val) =>
                      setNewRecord({ ...newRecord, dateInputNPL: DayJS(val).format(DatePattern.iso8601) })
                    }
                  >
                    <Typography.Text type='secondary' className='w-full font-medium'>
                      {DayJS(record.dateInputNPL).format(DatePattern.display)}
                    </Typography.Text>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày xuất FCR'
                    isEditing={props.isEditing}
                    dataIndex='dateOutputFCR'
                    inputType='datepicker'
                    initialValue={DayJS(record.dateOutputFCR)}
                    value={DayJS(newRecord.dateOutputFCR)}
                    onValueChange={(val) =>
                      setNewRecord({ ...newRecord, dateOutputFCR: DayJS(val).format(DatePattern.iso8601) })
                    }
                  >
                    <Typography.Text type='secondary' className='w-full font-medium'>
                      {DayJS(record.dateOutputFCR).format(DatePattern.display)}
                    </Typography.Text>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Nhóm'
                    isEditing={props.isEditing}
                    dataIndex='groupID'
                    inputType='select'
                    initialValue={record.productGroup?.groupID}
                    selectItems={groups.map((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                        optionData: item.id
                      }
                    })}
                    value={newRecord.groupID}
                    onValueChange={(val) => setNewRecord({ ...newRecord, groupID: val })}
                  >
                    <Typography.Text type='secondary' className='w-full font-medium'>
                      {record.productGroup?.group?.name}
                    </Typography.Text>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Nơi in'
                    isEditing={props.isEditing}
                    dataIndex='printID'
                    inputType='select'
                    required={false}
                    initialValue={record.printablePlace?.printID}
                    selectItems={prints.map((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                        optionData: item.id
                      }
                    })}
                    value={newRecord.printID}
                    onValueChange={(val) => setNewRecord({ ...newRecord, printID: val })}
                  >
                    <Typography.Text type='secondary' className='w-full font-medium'>
                      {record.printablePlace?.print?.name}
                    </Typography.Text>
                  </ListItemRow>
                </Space>
                <ProductProgressStatus collapse record={record} />
                {width >= 768 && <ImportationTable productRecord={record} />}
                {width <= 768 && <ImportationList productRecord={record} />}
              </Space>
            )
          }
        ]}
      />
    </SkyListItem>
  )
}

export default memo(ProductListItem)
