import type { SelectProps } from 'antd'
import { Calendar, Flex, Input, InputNumber, Modal, Select, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { memo, useState } from 'react'
import { Print, Product } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  product: Product
  prints: Print[]
  openModal: boolean
  setProduct: (product: Product) => void
  setPrints: (prints: Print[]) => void
  setOpenModal: (status: boolean) => void
}

// eslint-disable-next-line no-empty-pattern, react-refresh/only-export-components
const AddNewProduct: React.FC<Props> = ({ ...props }) => {
  

  console.log('Load AddNewProduct...')

  return (
    <Modal
      open={props.openModal}
      onOk={() => {
        // handleAddNewItemData(product)
        // setOpenModal(false)
        console.log(selfProduct)
      }}
      centered
      width='auto'
      onCancel={() => props.setOpenModal(false)}
    >
      <Flex vertical gap={20} className='w-full sm:w-[500px] md:w-[600px] lg:w-[900px]'>
        <Typography.Title level={2}>Add new product</Typography.Title>
        <Flex vertical={false} gap={20} className='w-full'>
          <Flex align='center' gap={5} className='w-full'>
            <Typography.Text className='w-20 flex-shrink-0'>Mã Code:</Typography.Text>
            <Input
              value={selfProduct.productCode}
              onChange={(e) => setSelfProduct({ ...selfProduct, productCode: e.target.value })}
              allowClear
              className='w-full'
              placeholder='Product code..'
            />
          </Flex>
          <Flex align='center' gap={5} className='w-full'>
            <Typography.Text className='w-20 flex-shrink-0'>Số lượng PO:</Typography.Text>
            <InputNumber
              className='w-full'
              value={selfProduct.quantityPO}
              onChange={(value) => {
                console.log(value)
                if (value) {
                  setSelfProduct({ ...selfProduct, quantityPO: value })
                }
              }}
              placeholder='Quantity po..'
            />
          </Flex>
        </Flex>
        <Flex align='center' gap={5} className='w-full'>
          <Typography.Text className='w-24 flex-shrink-0'>Nơi in - Thêu:</Typography.Text>
          <Select
            mode='multiple'
            allowClear
            placeholder='Please select'
            defaultValue={['a10', 'c12']}
            onChange={handleChange}
            options={options}
            className='w-full'
            style={{
              width: '100%'
            }}
          />
        </Flex>
        <Flex vertical={false} gap={30} className='flex w-full flex-col items-center justify-center lg:flex-row'>
          <Flex vertical>
            <Typography.Text className='w-24 flex-shrink-0'>Ngày nhập NPL:</Typography.Text>
            <Calendar
              fullscreen={false}
              value={dateInputNPLValue}
              onSelect={onSelectDateInputNPL}
              onPanelChange={onPanelChangeDateInputNPL}
            />
          </Flex>
          <Flex vertical>
            <Typography.Text className='w-24 flex-shrink-0'>Ngày xuất FCR:</Typography.Text>
            <Calendar
              fullscreen={false}
              value={dateOutputFCRValue}
              onSelect={onSelectDateOutputFCR}
              onPanelChange={onPanelChangeDateOutputFCR}
            />
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(AddNewProduct)
