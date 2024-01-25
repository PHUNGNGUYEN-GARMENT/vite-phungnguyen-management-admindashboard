/* eslint-disable react-refresh/only-export-components */
import { Flex, Form, Modal } from 'antd'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { Role } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: Role) => void
}

const ModalAddNewRole: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = (await form.validateFields()) as Role
    onAddNew(row)
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal
      title={<AddNewTitle title='New role' />}
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='450px'
    >
      <Form form={form} {...props}>
        <Flex vertical gap={10}>
          <Flex align='center' gap={5}>
            <SkyTableTypography required className='w-24 flex-shrink-0'>
              Role:
            </SkyTableTypography>
            <EditableFormCell
              isEditing={true}
              title=''
              required
              dataIndex='role'
              inputType='text'
              placeholder='admin, product_manager...'
            />
          </Flex>
          <Flex align='center' gap={5}>
            <SkyTableTypography required className='w-24 flex-shrink-0'>
              Short name:
            </SkyTableTypography>
            <EditableFormCell
              isEditing={true}
              title=''
              required
              dataIndex='shortName'
              inputType='text'
              placeholder='Product Manager..'
            />
          </Flex>
          <Flex align='center' gap={5}>
            <SkyTableTypography required className='w-24 flex-shrink-0'>
              Description:
            </SkyTableTypography>
            <EditableFormCell isEditing={true} title='' required dataIndex='desc' inputType='text' placeholder='..' />
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewRole)
