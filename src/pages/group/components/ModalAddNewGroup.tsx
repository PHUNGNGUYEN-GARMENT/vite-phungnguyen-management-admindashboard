/* eslint-disable react-refresh/only-export-components */
import { Flex, Form, Input, Modal, Typography } from 'antd'
import React, { memo } from 'react'
import { Group } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: Group) => void
}

const ModalAddNewGroup: React.FC<Props> = ({
  openModal,
  setOpenModal,
  onAddNew,
  ...props
}) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      name: row.name
    })
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='auto'
    >
      <Form form={form} {...props}>
        <Flex vertical gap={20}>
          <Typography.Title level={2}>Add new group</Typography.Title>
          <Flex vertical gap={10}>
            <Flex align='center' gap={5}>
              <Typography.Text className='w-24 flex-shrink-0'>
                Group name:
              </Typography.Text>
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
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewGroup)
