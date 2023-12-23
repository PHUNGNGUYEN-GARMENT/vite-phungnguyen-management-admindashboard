/* eslint-disable react-refresh/only-export-components */
import { Flex, Form, Input, Modal, Typography } from 'antd'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import { SewingLine } from '~/typing'
import { SewingLineTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: SewingLine) => void
}

const ModalAddNewSewingLine: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm<SewingLineTableDataType>()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      sewingLineName: row.sewingLineName
    })
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal
      title={<AddNewTitle title='Add new' />}
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='auto'
    >
      <Form form={form} {...props}>
        <Flex vertical gap={10}>
          <Flex align='center' gap={5}>
            <Typography.Text className='w-24 flex-shrink-0'>Sewing line:</Typography.Text>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Please Input SEWING LINE!`
                }
              ]}
              name='sewingLineName'
              className='m-0'
            >
              <Input allowClear placeholder='Orange' />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewSewingLine)
