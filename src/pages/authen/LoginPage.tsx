/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { App as AntApp, Button, Flex, Form, Input, Typography } from 'antd'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { defaultRequestBody } from '~/api/client'
import AuthAPI from '~/api/services/AuthAPI'
import UserRoleAPI from '~/api/services/UserRoleAPI'
import logo from '~/assets/logo.svg'
import useAPIService from '~/hooks/useAPIService'
import useLocalStorage from '~/hooks/useLocalStorage'
import { setUserAction, setUserRoleAction } from '~/store/actions-creator'
import { User, UserRole, UserRoleType } from '~/typing'

interface Props extends HTMLAttributes<HTMLElement> {}

type LayoutType = Parameters<typeof Form>[0]['layout']

const LoginPage: React.FC<Props> = ({ ...props }) => {
  const [form] = Form.useForm()
  const { message } = AntApp.useApp()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [accessTokenLocalStorage, setAccessTokenLocalStorage] = useLocalStorage('accessToken', '')
  const [, setUserRolesLocalStorage] = useLocalStorage<UserRoleType[]>('userRoles', [])
  const userRoleService = useAPIService<UserRole>(UserRoleAPI)
  const [loading, setLoading] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal')

  useEffect(() => {
    if (accessTokenLocalStorage) {
      navigate('/')
    }
  }, [accessTokenLocalStorage])

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout)
  }

  const onFinish = async (user: { username: string; password: string; remember: boolean }) => {
    try {
      setLoading(true)
      // Create a new request to login user
      await AuthAPI.login(user).then((meta) => {
        if (!meta?.success) {
          throw new Error(meta?.message)
        }
        const userLogged = meta.data as User
        if (userLogged) {
          // Save to local storage
          setAccessTokenLocalStorage(userLogged.accessToken)
          // Save to redux state
          dispatch(setUserAction(userLogged))
          // Create request to get all user roles
          userRoleService.getListItems(
            {
              ...defaultRequestBody,
              paginator: { page: 1, pageSize: -1 },
              filter: { field: 'userID', items: [userLogged.id!], status: 'active' }
            },
            setLoading,
            (meta2, msg) => {
              if (!meta2?.success) throw new Error(msg)
              const userRoles = meta2.data as UserRole[]
              console.log(userRoles)
              setUserRolesLocalStorage(
                userRoles
                  .filter((userRole) => userRole.userID === userLogged.id)
                  .map((userRole) => {
                    return userRole.role?.role as UserRoleType
                  })
              )
              dispatch(
                setUserRoleAction(
                  userRoles.map((userRole) => {
                    return userRole.role?.role as UserRoleType
                  })
                )
              )
            }
          )
        }
        // Send message app
        message.success('Success!')
        // Navigation to '/' (Home page) if login success
        navigate('/')
      })
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const formItemLayout =
    formLayout === 'vertical'
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 }
        }
      : null

  const buttonItemLayout =
    formLayout === 'vertical'
      ? {
          wrapperCol: { span: 14, offset: 4 }
        }
      : null

  return (
    <Flex {...props} className='relative h-screen bg-background' align='center' justify='center'>
      <Flex
        vertical
        gap={20}
        align='center'
        className='absolute top-1/2 w-[450px] -translate-y-1/2 rounded-lg bg-white p-10 shadow-lg'
      >
        <Flex align='center' className='relative h-fit w-full' justify='center'>
          <img src={logo} alt='logo' className='h-24 w-24 object-contain' />
        </Flex>

        <Flex vertical align='center'>
          <Typography.Title className='uppercase' level={1}>
            Login
          </Typography.Title>
          <Typography.Text type='secondary'>Please login to your account</Typography.Text>
        </Flex>
        <Form
          form={form}
          {...formItemLayout}
          layout={formLayout}
          name='basic'
          initialValues={{ layout: formLayout }}
          onValuesChange={onFormLayoutChange}
          onFinish={onFinish}
          className='w-full'
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Flex className='w-full' vertical gap={20}>
            <Flex className='w-full' vertical gap={16}>
              <Form.Item
                label='Username'
                name='username'
                className='m-0 p-0'
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input
                  placeholder='Username'
                  className='w-full'
                  type='text'
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label='Password'
                name='password'
                className='m-0 w-full'
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  placeholder='Password'
                  className='w-full'
                  type='password'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  allowClear
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Flex>

            <Form.Item {...buttonItemLayout} className='w-full'>
              <Button htmlType='submit' className='w-full' type='primary' loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  )
}

export default LoginPage
