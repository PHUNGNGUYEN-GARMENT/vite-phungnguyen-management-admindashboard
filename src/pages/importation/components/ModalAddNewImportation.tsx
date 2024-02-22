import { Flex, Form, Modal } from 'antd'
import React, { memo } from 'react'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { ProductTableDataType } from '~/pages/product/type'
import DayJS from '~/utils/date-formatter'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  loading: boolean
  productRecord: ProductTableDataType
  setOpenModal: (enable: boolean) => void
  setLoading: (enable: boolean) => void
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
      title={<AddNewTitle title='Thêm mới lô nhập' />}
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='auto'
    >
      <Form form={form}>
        <Flex vertical gap={10} className='w-full'>
          <Flex align='center' className='w-full'>
            <SkyTableTypography required className='w-32' status={'active'}>
              Lô nhập
            </SkyTableTypography>
            <EditableFormCell
              isEditing={true}
              title='Lô nhập'
              dataIndex='quantity'
              placeholder='Lô nhập...'
              inputType='number'
              required
            />
          </Flex>
          <Flex className='w-full' align='center'>
            <SkyTableTypography className='w-32' required status={'active'}>
              Ngày nhập
            </SkyTableTypography>
            <EditableFormCell
              isEditing={true}
              title='Ngày nhập:'
              dataIndex='dateImported'
              inputType='datepicker'
              required
              placeholder='Ngày nhập...'
              initialValue={DayJS(Date.now())}
            />
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default memo(ModalAddNewImportation)
