/* eslint-disable react-refresh/only-export-components */
import {
  ColorPicker,
  Flex,
  Form,
  FormInstance,
  Input,
  Modal,
  Typography
} from 'antd'
import React, { memo } from 'react'
import { Color } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (form: FormInstance<Color>) => void
}

const ModalAddNewColor: React.FC<Props> = ({
  openModal,
  setOpenModal,
  onAddNew,
  ...props
}) => {
  const [form] = Form.useForm()

  return (
    <Modal
      open={openModal}
      onOk={() => onAddNew(form)}
      centered
      width='auto'
      onCancel={() => {
        setOpenModal(false)
      }}
    >
      <Form form={form} {...props}>
        <Flex vertical gap={20}>
          <Typography.Title level={2}>Add new color</Typography.Title>
          <Flex vertical gap={10}>
            <Flex align='center' gap={5}>
              <Typography.Text className='w-24 flex-shrink-0'>
                Color name:
              </Typography.Text>
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
              <Typography.Text className='w-24 flex-shrink-0'>
                Pick color:
              </Typography.Text>
              <Form.Item name='hexColor' className='m-0' initialValue='#ff6b00'>
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
