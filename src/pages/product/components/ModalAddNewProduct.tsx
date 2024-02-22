import { Flex, Form, Modal, Spin } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import useAPIService from '~/hooks/useAPIService'
import { Color, Group, Print } from '~/typing'
import DayJS from '~/utils/date-formatter'

export interface ProductAddNewProps {
  productCode?: string | null
  quantityPO?: number | null
  colorID?: number | null
  groupID?: number | null
  printID?: number | null
  dateInputNPL?: string
  dateOutputFCR?: string | null
}

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  loading: boolean
  setOpenModal: (enable: boolean) => void
  setLoading: (enable: boolean) => void
  onAddNew: (recordToAddNew: ProductAddNewProps) => void
}

const ModalAddNewProduct: React.FC<Props> = ({ loading, openModal, setOpenModal, setLoading, onAddNew, ...props }) => {
  const [form] = Form.useForm()
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Print>(PrintAPI)
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])
  console.log('Load AddNewProduct...')

  useEffect(() => {
    const loadData = async () => {
      await colorService.getListItems(
        { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setColors(meta.data as Color[])
          }
        }
      )
      await groupService.getListItems(
        { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setGroups(meta.data as Group[])
          }
        }
      )
      await printService.getListItems(
        { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setPrints(meta.data as Print[])
          }
        }
      )
    }
    loadData()
  }, [])

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew(row)
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal
      title={<AddNewTitle title='Add new' />}
      open={openModal}
      onOk={handleOk}
      centered
      width='auto'
      onCancel={handleCancel}
    >
      <Spin spinning={loading} tip='loading'>
        <Form form={form} {...props}>
          <Flex vertical gap={20} className='w-full sm:w-[400px]'>
            <Flex align='center' className='w-full'>
              <SkyTableTypography required className='w-32' status={'active'}>
                Mã Code
              </SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title='Mã Code'
                placeholder='Mã Code...'
                dataIndex='productCode'
                inputType='text'
                required
              />
            </Flex>
            <Flex align='center' className='w-full'>
              <SkyTableTypography required className='w-32' status={'active'}>
                Số lượng PO
              </SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title='Số lượng PO'
                dataIndex='quantityPO'
                placeholder='Số lượng PO...'
                inputType='number'
                required
              />
            </Flex>
            <Flex align='center' className='w-full'>
              <SkyTableTypography className='w-32' status={'active'}>
                Mã màu:
              </SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title='Mã màu:'
                dataIndex='colorID'
                inputType='colorselector'
                placeholder='Chọn mã màu...'
                selectProps={{
                  options: colors.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                      key: item.hexColor
                    }
                  })
                }}
              />
            </Flex>
            <Flex className='w-full' align='center'>
              <SkyTableTypography className='w-32' status={'active'}>
                Nhóm:
              </SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title='Nhóm:'
                dataIndex='groupID'
                inputType='select'
                placeholder='Chọn nhóm...'
                selectProps={{
                  options: groups.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                      key: item.id
                    }
                  })
                }}
              />
            </Flex>
            <Flex className='w-full' align='center'>
              <SkyTableTypography className='w-32' status={'active'}>
                Nơi in:
              </SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title='Nơi in:'
                dataIndex='printID'
                inputType='select'
                placeholder='Chọn nơi in...'
                selectProps={{
                  options: prints.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                      key: item.id
                    }
                  })
                }}
              />
            </Flex>
            <Flex className='w-full' align='center'>
              <SkyTableTypography className='w-32' required status={'active'}>
                Ngày nhập NPL:
              </SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title='Ngày nhập NPL:'
                dataIndex='dateInputNPL'
                inputType='datepicker'
                required
                placeholder='Ngày nhập NPL...'
                initialValue={DayJS(Date.now())}
              />
            </Flex>
            <Flex className='w-full' align='center'>
              <SkyTableTypography className='w-32' required status={'active'}>
                Ngày xuất FCR:
              </SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title='Ngày xuất FCR:'
                dataIndex='dateOutputFCR'
                inputType='datepicker'
                required
                placeholder='Ngày xuất FCR...'
                initialValue={DayJS(Date.now())}
              />
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  )
}

export default memo(ModalAddNewProduct)
