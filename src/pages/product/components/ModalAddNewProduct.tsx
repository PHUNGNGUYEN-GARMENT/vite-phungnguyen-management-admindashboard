/* eslint-disable react-refresh/only-export-components */
import { DatePicker, Flex, Form, Input, InputNumber, Modal, Select, Spin, Typography } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import AddNewTitle from '~/components/ui/AddNewTitle'
import useAPICaller from '~/hooks/useAPICaller'
import { Color, Group, Print } from '~/typing'
import DayJS from '~/utils/date-formatter'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  loading: boolean
  setOpenModal: (enable: boolean) => void
  setLoading: (enable: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddNew: (itemToAddNew: any) => void
}

const ModalAddNewProduct: React.FC<Props> = ({ loading, openModal, setOpenModal, setLoading, onAddNew, ...props }) => {
  const [form] = Form.useForm()
  const colorService = useAPICaller<Color>(ColorAPI)
  const groupService = useAPICaller<Group>(GroupAPI)
  const printService = useAPICaller<Print>(PrintAPI)
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])
  console.log('Load AddNewProduct...')

  useEffect(() => {
    colorService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setColors(meta.data as Color[])
      }
    })
    groupService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setGroups(meta.data as Group[])
      }
    })
    printService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setPrints(meta.data as Print[])
      }
    })
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
          <Flex vertical gap={20} className='w-full sm:w-[350px]'>
            <Flex align='center' className='w-full'>
              <Typography.Text className='w-28 flex-shrink-0'>Mã Code:</Typography.Text>
              <Form.Item
                className='m-0 w-full'
                name='productCode'
                rules={[
                  {
                    required: true,
                    message: `Please enter product code!`
                  }
                ]}
              >
                <Input allowClear className='w-full' placeholder='Product code..' />
              </Form.Item>
            </Flex>
            <Flex align='center' className='w-full'>
              <Typography.Text className='w-28 flex-shrink-0'>Số lượng PO:</Typography.Text>
              <Form.Item
                name='quantityPO'
                className='m-0 w-full'
                rules={[
                  {
                    required: true,
                    message: `Please enter quantity PO!`
                  }
                ]}
              >
                <InputNumber className='w-full' placeholder='Quantity po..' />
              </Form.Item>
            </Flex>
            <Flex align='center' className='w-full'>
              <Typography.Text className='w-28 flex-shrink-0'>Mã màu:</Typography.Text>
              <Form.Item name='colorID' className='m-0 w-full'>
                <Select
                  placeholder='Select 1 color...'
                  options={colors.map((item) => {
                    return {
                      label: item.nameColor,
                      value: item.id,
                      key: item.hexColor
                    }
                  })}
                  optionRender={(ori, info) => {
                    return (
                      <>
                        <Flex justify='space-between' align='center' key={info.index}>
                          <Typography.Text>{ori.label}</Typography.Text>
                          <div
                            className='h-6 w-6 rounded-sm'
                            style={{
                              backgroundColor: `${ori.key}`
                            }}
                          />
                        </Flex>
                      </>
                    )
                  }}
                  className='w-full'
                />
              </Form.Item>
            </Flex>
            <Flex className='w-full' align='center'>
              <Typography.Text className='w-28 flex-shrink-0'>Nhóm</Typography.Text>
              <Form.Item name='groupID' className='m-0 w-full'>
                <Select
                  placeholder='Select group...'
                  options={groups.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                      key: item.id
                    }
                  })}
                  optionRender={(ori, info) => {
                    return (
                      <>
                        <Flex justify='space-between' align='center' key={info.index}>
                          <Typography.Text>{ori.label}</Typography.Text>
                          <div
                            className='h-6 w-6 rounded-sm'
                            style={{
                              backgroundColor: `${ori.key}`
                            }}
                          />
                        </Flex>
                      </>
                    )
                  }}
                  className='w-full'
                />
              </Form.Item>
            </Flex>
            <Flex className='w-full' align='center'>
              <Typography.Text className='w-28 flex-shrink-0'>Nơi in</Typography.Text>
              <Form.Item name='printID' className='m-0 w-full'>
                <Select
                  placeholder='Select print place...'
                  options={prints.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                      key: item.id
                    }
                  })}
                  optionRender={(ori, info) => {
                    return (
                      <>
                        <Flex justify='space-between' align='center' key={info.index}>
                          <Typography.Text>{ori.label}</Typography.Text>
                          <div
                            className='h-6 w-6 rounded-sm'
                            style={{
                              backgroundColor: `${ori.key}`
                            }}
                          />
                        </Flex>
                      </>
                    )
                  }}
                  className='w-full'
                />
              </Form.Item>
            </Flex>
            <Flex className='w-full' align='center'>
              <Typography.Text className='w-28 flex-shrink-0'>Ngày nhập NPL</Typography.Text>
              <Form.Item className='m-0 w-full' name='dateInputNPL' initialValue={DayJS(Date.now())}>
                <DatePicker className='w-full' />
              </Form.Item>
            </Flex>
            <Flex className='w-full' align='center'>
              <Typography.Text className='w-28 flex-shrink-0'>Ngày xuất FCR</Typography.Text>
              <Form.Item name='dateOutputFCR' className='m-0 w-full' initialValue={DayJS(Date.now())}>
                <DatePicker className='w-full' />
              </Form.Item>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  )
}

export default memo(ModalAddNewProduct)
