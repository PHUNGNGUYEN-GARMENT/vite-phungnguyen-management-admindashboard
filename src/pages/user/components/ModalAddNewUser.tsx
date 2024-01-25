/* eslint-disable react-refresh/only-export-components */
import { Button, Flex, Form, Input, Modal, Spin, Typography } from 'antd'
import { Eye, EyeOff } from 'lucide-react'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import RoleAPI from '~/api/services/RoleAPI'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import useAPIService from '~/hooks/useAPIService'
import { Role, User } from '~/typing'
import DayJS from '~/utils/date-formatter'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (itemToAddNew: User) => void
}

const ModalAddNewUser: React.FC<Props> = ({ openModal, setOpenModal, onAddNew, ...props }) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const roleService = useAPIService<Role>(RoleAPI)
  const [roles, setRoles] = useState<Role[]>([])

  const loadData = async () => {
    await roleService.getListItems(
      { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setRoles(meta.data as Role[])
        }
      }
    )
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      ...row
    })
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal
      title={<AddNewTitle title='New user' />}
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width='450px'
    >
      {loading ? (
        <Flex justify='center' className='' align='center'>
          <Spin />
        </Flex>
      ) : (
        <Form form={form} {...props}>
          <Flex vertical gap={10}>
            <Flex align='center' gap={5}>
              <SkyTableTypography required className='w-24 flex-shrink-0'>
                Username:
              </SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title=''
                required
                dataIndex='username'
                inputType='text'
                placeholder='Username...'
              />
            </Flex>
            <Flex align='center' gap={5}>
              <Typography.Text className='w-24 flex-shrink-0'>Full name:</Typography.Text>
              <EditableFormCell isEditing={true} title='' dataIndex='fullName' inputType='text' placeholder='' />
            </Flex>
            <Flex align='center' gap={5}>
              <SkyTableTypography required className='w-24 flex-shrink-0'>
                Password:
              </SkyTableTypography>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: `Please input this field!`
                  }
                ]}
                name='password'
                className='m-0 w-full p-0'
              >
                <Input
                  type={visible ? 'text' : 'password'}
                  suffix={
                    <Button onClick={() => setVisible((prev) => !prev)} type='link' className='p-2'>
                      {visible ? (
                        <Eye color='var(--foreground)' size={16} />
                      ) : (
                        <EyeOff size={16} color='var(--foreground)' />
                      )}
                    </Button>
                  }
                  allowClear
                  placeholder=''
                />
              </Form.Item>
            </Flex>
            <Flex align='center' gap={5}>
              <SkyTableTypography required className='w-24 flex-shrink-0' status={'active'}>
                Role:
              </SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title='Vai trò:'
                required
                dataIndex='roles'
                inputType='multipleselect'
                placeholder='Select role...'
                selectProps={{
                  options: roles.map((role) => {
                    return {
                      label: role.desc,
                      value: role.id,
                      key: role.id
                    }
                  })
                }}
              />
            </Flex>
            <Flex align='center' gap={5}>
              <SkyTableTypography className='w-24 flex-shrink-0'>Phone:</SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title=''
                dataIndex='phone'
                inputType='text'
                placeholder='Phone number...'
              />
            </Flex>
            <Flex align='center' gap={5}>
              <SkyTableTypography className='w-24'>Work description:</SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title=''
                dataIndex='workDescription'
                inputType='textarea'
                placeholder='Chi tiết...'
              />
            </Flex>
            <Flex align='center' gap={5}>
              <SkyTableTypography className='w-24'>Birthday:</SkyTableTypography>
              <EditableFormCell
                isEditing={true}
                title='Sinh nhật:'
                dataIndex='birthday'
                inputType='datepicker'
                placeholder='Ngày sinh...'
                initialValue={DayJS(Date.now())}
              />
            </Flex>
          </Flex>
        </Form>
      )}
    </Modal>
  )
}

export default memo(ModalAddNewUser)
