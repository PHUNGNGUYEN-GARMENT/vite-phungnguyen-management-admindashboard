/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, Flex, Form, Input, Modal, Typography } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import React, { memo } from 'react'
import { Color } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: Color) => void
}

const ModalAddNewColor: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    const hexColor = row.hexColor
      ? typeof row.hexColor === 'string'
        ? row.hexColor
        : (row.hexColor as AntColor).toHexString()
      : ''
    onAddNew({
      nameColor: row.nameColor,
      hexColor: hexColor
    })
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal open={openModal} onOk={handleOk} onCancel={handleCancel} centered width='auto'>
      <Form form={form} {...props}>
        <Flex vertical gap={20}>
          <Typography.Title level={2}>Add new</Typography.Title>
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
                name='nameColor'
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

export default memo(ModalAddNewColor)
