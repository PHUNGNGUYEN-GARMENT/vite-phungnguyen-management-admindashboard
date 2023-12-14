/* eslint-disable react-refresh/only-export-components */
import { Flex, Form, Input, Modal, Typography } from 'antd'
import React, { memo } from 'react'
import { Importation } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: Importation) => void
}

const ModalAddNewImportation: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      quantity: row.quantity,
      dateImported: row.dateImported
    })
    setOpenModal(false)
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal {...props} title='Add new' open={openModal} onOk={handleOk} onCancel={handleCancel} centered width='auto'>
      <Form form={form}>
        <Flex vertical gap={10} className='w-full'>
          <Flex align='center' gap={5} className='w-auto'>
            <Typography.Text className='w-12 flex-shrink-0'>Nơi in:</Typography.Text>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Please input this field!`
                }
              ]}
              name='name'
              className='m-0'
            >
              <Input className='w-52' allowClear placeholder='Tên' />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewImportation)
