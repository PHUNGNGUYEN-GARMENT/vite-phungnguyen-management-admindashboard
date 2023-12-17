/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, Flex, Form, Input, Modal, Typography } from 'antd'
import React, { memo } from 'react'
import { SewingLineDelivery } from '~/typing'
import { SewingLineDeliveryTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: SewingLineDelivery) => void
}

const ModalAddNewSewingLineDelivery: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm<SewingLineDeliveryTableDataType>()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      productID: row.productID,
      sewingLineID: row.sewingLineID,
      quantityOrigin: row.quantityOrigin,
      quantitySewed: row.quantitySewed,
      expiredDate: row.expiredDate
    })
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal open={openModal} onOk={handleOk} onCancel={handleCancel} centered width='auto'>
      <Form form={form} {...props}>
        <Flex vertical gap={20}>
          <Typography.Title level={2}>Add new color</Typography.Title>
          <Flex vertical gap={10}>
            <Flex align='center' gap={5}>
              <Typography.Text className='w-24 flex-shrink-0'>Color name:</Typography.Text>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: `Please Input COLOR NAME!`
                  }
                ]}
                name='name'
                className='m-0'
              >
                <Input allowClear placeholder='Orange' />
              </Form.Item>
            </Flex>
            <Flex align='center' gap={5}>
              <Typography.Text className='w-24 flex-shrink-0'>Pick color:</Typography.Text>
              <Form.Item name='hexColor' className='m-0' initialValue='#000000'>
                <ColorPicker size='middle' showText />
              </Form.Item>
            </Flex>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewSewingLineDelivery)
