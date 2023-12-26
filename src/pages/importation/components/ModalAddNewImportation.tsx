/* eslint-disable react-refresh/only-export-components */
import { DatePicker, Flex, Form, InputNumber, Modal, Typography } from 'antd'
import React, { memo } from 'react'
import DotRequired from '~/components/sky-ui/DotRequired'
import { ProductTableDataType } from '~/pages/product/type'
import DayJS, { DatePattern } from '~/utils/date-formatter'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  loading: boolean
  productRecord: ProductTableDataType
  setOpenModal: (enable: boolean) => void
  setLoading: (enable: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddNew: (itemToAddNew: any) => void
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
    <Modal
      {...props}
      title='Thêm mới lô nhập'
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='auto'
    >
      <Form form={form}>
        <Flex vertical gap={10} className='w-full'>
          <Flex align='center' className='w-full'>
            <Typography.Text className='w-28 flex-shrink-0'>
              Lô nhập <DotRequired />
            </Typography.Text>
            <Form.Item
              name='quantity'
              required
              className='m-0 w-full'
              rules={[
                {
                  required: true,
                  message: `Please enter quantity!`
                }
              ]}
            >
              <InputNumber className='w-full' placeholder='Số lượng..' />
            </Form.Item>
          </Flex>
          <Flex className='w-full' align='center'>
            <Typography.Text className='w-28 flex-shrink-0'>
              Ngày nhập <DotRequired />
            </Typography.Text>
            <Form.Item required className='m-0 w-full' name='dateImported' initialValue={DayJS(Date.now())}>
              <DatePicker format={DatePattern.display} className='w-full' />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewImportation)
