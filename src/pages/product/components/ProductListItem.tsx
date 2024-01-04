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
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
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
      dataIndex='productCode'
      record={record}
      key={record.key}
      labelEditing
      value={newRecord.productCode}
      defaultValue={record.productCode}
      onValueChange={(val) => setNewRecord({ ...newRecord, productCode: val })}
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
                    selectProps={{
                      defaultValue: record.productColor?.colorID,
                      value: newRecord.colorID,
                      options: colors.map((i) => {
                        return { label: i.name, value: i.id, optionData: i.hexColor }
                      })
                    }}
                    onValueChange={(id: number) => setNewRecord({ ...newRecord, colorID: id })}
                  >
                    <Flex justify='space-between' align='center' gap={10}>
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
                    label='Số lượng PO'
                    isEditing={props.isEditing}
                    dataIndex='quantityPO'
                    inputType='number'
                    initialValue={record.quantityPO}
                    value={newRecord.quantityPO}
                    onValueChange={(val) => setNewRecord({ ...newRecord, quantityPO: val })}
                  >
                    <SkyTableTypography status={'active'}>{record.quantityPO}</SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày nhập NPL'
                    isEditing={props.isEditing}
                    dataIndex='dateInputNPL'
                    inputType='datepicker'
                    initialValue={record.dateInputNPL ? DayJS(record.dateInputNPL) : ''}
                    onValueChange={(val) =>
                      setNewRecord({ ...newRecord, dateInputNPL: DayJS(val).format(DatePattern.iso8601) })
                    }
                  >
                    <SkyTableTypography status={'active'}>
                      {DayJS(record.dateInputNPL).format(DatePattern.display)}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày xuất FCR'
                    isEditing={props.isEditing}
                    dataIndex='dateOutputFCR'
                    inputType='datepicker'
                    initialValue={record.dateOutputFCR ? DayJS(record.dateOutputFCR) : ''}
                    onValueChange={(val) =>
                      setNewRecord({ ...newRecord, dateOutputFCR: DayJS(val).format(DatePattern.iso8601) })
                    }
                  >
                    <SkyTableTypography status={'active'}>
                      {DayJS(record.dateOutputFCR).format(DatePattern.display)}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Nhóm'
                    isEditing={props.isEditing}
                    dataIndex='groupID'
                    inputType='select'
                    selectProps={{
                      defaultValue: record.productGroup?.groupID,
                      options: groups.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                          optionData: item.id
                        }
                      }),
                      value: newRecord.groupID
                    }}
                    onValueChange={(val) => setNewRecord({ ...newRecord, groupID: val })}
                  >
                    <SkyTableTypography status={record.productGroup?.group?.status}>
                      {record.productGroup?.group?.name}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Nơi in'
                    isEditing={props.isEditing}
                    dataIndex='printID'
                    inputType='select'
                    required={false}
                    selectProps={{
                      defaultValue: record.printablePlace?.printID,
                      options: prints.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                          optionData: item.id
                        }
                      }),
                      value: newRecord.printID
                    }}
                    onValueChange={(val) => setNewRecord({ ...newRecord, printID: val })}
                  >
                    <SkyTableTypography status={record.printablePlace?.print?.status}>
                      {record.printablePlace?.print?.name}
                    </SkyTableTypography>
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
