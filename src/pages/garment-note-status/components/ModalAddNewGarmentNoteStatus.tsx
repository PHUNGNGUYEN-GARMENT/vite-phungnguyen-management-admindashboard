/* eslint-disable react-refresh/only-export-components */
import { Flex, Form, Modal } from 'antd'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { GarmentNoteStatus } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: GarmentNoteStatus) => void
}

const ModalAddNewGarmentNoteStatus: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      title: row.title
    })
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal
      title={<AddNewTitle title='Thêm mới trạng thái' />}
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='auto'
    >
      <Form form={form} {...props}>
        <Flex vertical gap={10} className='w-full sm:w-[400px]'>
          <Flex align='center' gap={5}>
            <SkyTableTypography className='w-32' required status={'active'}>
              Title:
            </SkyTableTypography>
            <EditableFormCell isEditing={true} required title='Title:' dataIndex='title' inputType='text' />
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewGarmentNoteStatus)
