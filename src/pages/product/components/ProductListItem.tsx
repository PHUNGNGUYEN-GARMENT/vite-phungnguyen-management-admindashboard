/* eslint-disable react-refresh/only-export-components */
import { Collapse, DatePicker, Flex, Form, Input, InputNumber, Select, Typography } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import { TableItemWithKey } from '~/components/hooks/useTable'
import ProgressBar from '~/components/ui/ProgressBar'
import ListItem from '~/components/ui/Table/ListItem'
import { Color, Group, Print } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'

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
          console.log(items)
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
      <Flex className='w-full' align='center' justify='start' gap={5}>
        <Typography.Text type='secondary' className='w-40 font-medium'>
          Màu
        </Typography.Text>
        {isEditing ? (
          <Form.Item name='colorID' className='m-0 w-full' initialValue={data.productColor?.color?.id}>
            <Select
              placeholder='Select color...'
              options={colors.map((item) => {
                return {
                  label: item.nameColor,
                  value: item.id,
                  key: item.hexColor
                }
              })}
              optionRender={(ori, info) => {
                return (
                  <>
                    <Flex justify='space-between' align='center' key={info.index}>
                      <Typography.Text>{ori.label}</Typography.Text>
                      <div
                        className='h-6 w-6 rounded-sm'
                        style={{
                          backgroundColor: `${ori.key}`
                        }}
                      />
                    </Flex>
                  </>
                )
              }}
              className='w-full'
            />
          </Form.Item>
        ) : (
          <Input value={data.productColor?.color?.nameColor} readOnly name='display-hexcolor' />
        )}
      </Flex>
      <Flex className='w-full' align='center' justify='start' gap={5}>
        <Typography.Text type='secondary' className='w-40 font-medium'>
          Số lượng PO
        </Typography.Text>
        {isEditing ? (
          <Form.Item name='quantityPO' initialValue={data.quantityPO} className='m-0 w-full'>
            <InputNumber className='w-full text-center' readOnly={!isEditing} />
          </Form.Item>
        ) : (
          <Input name='quantityPo' className='w-full' value={data.quantityPO} readOnly />
        )}
      </Flex>
      <Flex className='w-full' align='center' justify='start' gap={5}>
        <Typography.Text type='secondary' className='w-40 font-medium'>
          Ngày nhập NPL
        </Typography.Text>
        {isEditing ? (
          <Form.Item name='dateInputNPL' initialValue={DayJS(data.dateInputNPL)} className='m-0 w-full'>
            <DatePicker className='w-full' format={DatePattern.display} />
          </Form.Item>
        ) : (
          <Input
            name='dateOutputFCR'
            readOnly
            className='zoom-in-0'
            value={DayJS(data.dateInputNPL).format('DD/MM/YYYY')}
          />
        )}
      </Flex>
      <Flex className='w-full' align='center' justify='start' gap={5}>
        <Typography.Text type='secondary' className='w-40 font-medium'>
          Ngày xuất FCR
        </Typography.Text>
        {isEditing ? (
          <Form.Item name='dateOutputFCR' initialValue={DayJS(data.dateOutputFCR)} className='m-0 w-full'>
            <DatePicker className='w-full' format={DatePattern.display} />
          </Form.Item>
        ) : (
          <Input
            name='dateOutputFCR'
            readOnly
            className='zoom-in-0'
            value={DayJS(data.dateOutputFCR).format('DD/MM/YYYY')}
          />
        )}
      </Flex>
      <Flex className='w-full' align='center' justify='start' gap={5}>
        <Typography.Text type='secondary' className='w-40 font-medium'>
          Nhóm
        </Typography.Text>
        {isEditing ? (
          <Form.Item name='groupID' initialValue={data.productGroup?.groupID} className='m-0 w-full'>
            <Select
              placeholder='Select group...'
              options={groups.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                  key: item.id
                }
              })}
              optionRender={(ori, info) => {
                return (
                  <>
                    <Flex justify='space-between' align='center' key={info.index}>
                      <Typography.Text>{ori.label}</Typography.Text>
                      <div
                        className='h-6 w-6 rounded-sm'
                        style={{
                          backgroundColor: `${ori.key}`
                        }}
                      />
                    </Flex>
                  </>
                )
              }}
              className='w-full'
            />
          </Form.Item>
        ) : (
          <Input name='groupID' readOnly className='zoom-in-0' value={data.productGroup?.group?.name} />
        )}
      </Flex>
      <Flex className='w-full' align='center' justify='start' gap={5}>
        <Typography.Text type='secondary' className='w-40 font-medium'>
          Nơi in
        </Typography.Text>
        {isEditing ? (
          <Form.Item name='printID' initialValue={data.printablePlace?.print?.id} className='m-0 w-full'>
            <Select
              placeholder='Select print place...'
              options={prints.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                  key: item.id
                }
              })}
              optionRender={(ori, info) => {
                return (
                  <>
                    <Flex justify='space-between' align='center' key={info.index}>
                      <Typography.Text>{ori.label}</Typography.Text>
                      <div
                        className='h-6 w-6 rounded-sm'
                        style={{
                          backgroundColor: `${ori.key}`
                        }}
                      />
                    </Flex>
                  </>
                )
              }}
              className='w-full'
            />
          </Form.Item>
        ) : (
          <Input name='printID' readOnly className='zoom-in-0' value={data.printablePlace?.print?.name} />
        )}
      </Flex>
      <Collapse
        className=''
        // expandIcon={({ isActive }) => (
        //   <>{isActive ? <MinusCircle className='text-black text-opacity-50' size={20} /> : <PlusCircle size={20} />}</>
        // )}
        items={[
          {
            key: '1',
            label: (
              <Typography.Title className='m-0' level={5} type='secondary'>
                Tiến trình
              </Typography.Title>
            ),
            children: (
              <Flex vertical gap={5}>
                <Flex className='w-full' align='center' justify='start' gap={5}>
                  <Typography.Text type='secondary' className='w-40 font-medium'>
                    May
                  </Typography.Text>
                  <Flex className='w-full' align='center' vertical>
                    {/* <Progress percent={70} strokeColor='var(--warn)' /> */}
                    <ProgressBar count={data.progress?.sewing ?? 0} total={data.quantityPO ?? 0} />
                    <Typography.Text type='secondary' className='w-24 font-medium'>
                      {data.progress?.sewing ?? 0}/{data.quantityPO ?? 0}
                    </Typography.Text>
                  </Flex>
                </Flex>
                <Flex className='w-full' align='center' justify='start' gap={5}>
                  <Typography.Text type='secondary' className='w-40 font-medium'>
                    Ủi
                  </Typography.Text>
                  <Flex className='w-full' align='center' vertical>
                    <ProgressBar count={data.progress?.iron ?? 0} total={data.quantityPO ?? 0} />
                    <Typography.Text type='secondary' className='w-24 font-medium'>
                      {data.progress?.iron ?? 0}/{data.quantityPO ?? 0}
                    </Typography.Text>
                  </Flex>
                </Flex>
                <Flex className='w-full' align='center' justify='start' gap={5}>
                  <Typography.Text type='secondary' className='w-40 font-medium'>
                    Kiểm tra
                  </Typography.Text>
                  <Flex className='w-full' align='center' vertical>
                    <ProgressBar count={data.progress?.check ?? 0} total={data.quantityPO ?? 0} />
                    <Typography.Text type='secondary' className='w-24 font-medium'>
                      {data.progress?.check ?? 0}/{data.quantityPO ?? 0}
                    </Typography.Text>
                  </Flex>
                </Flex>
                <Flex className='w-full' align='center' justify='start' gap={5}>
                  <Typography.Text type='secondary' className='w-40 font-medium'>
                    Đóng gói
                  </Typography.Text>
                  <Flex className='w-full' align='center' vertical>
                    <ProgressBar count={data.progress?.pack ?? 0} total={data.quantityPO ?? 0} />
                    <Typography.Text type='secondary' className='w-24 font-medium'>
                      {data.progress?.pack ?? 0}/{data.quantityPO ?? 0}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Flex>
            )
          }
        ]}
      />
    </ListItem>
  )
}

export default memo(ProductListItem)
