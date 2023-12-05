/* eslint-disable react-refresh/only-export-components */
import {
  App as AntApp,
  Button,
  ColorPicker,
  Flex,
  Form,
  Input,
  List,
  Popconfirm,
  Typography
} from 'antd'
import { ColorValueType } from 'antd/es/color-picker/interface'
import React, { memo, useState } from 'react'
import { ResponseDataType } from '~/api/client'
import { Color } from '~/typing'

interface Props {
  item: Color
  editing: boolean
  isAdmin: boolean | undefined
  dateCreation: boolean
  editingKey: React.Key
  deleteKey: React.Key
  setEditingKey: (key: React.Key) => void
  setDeleteKey: (key: React.Key) => void
  setLoading: (enable: boolean) => void
  handleStartSaveEditing: (
    key: React.Key,
    onSuccess: (data: Color) => void
  ) => void
  handleUpdateItem: (
    id: number,
    ColorToUpdate: Color,
    onSuccess?: (data: ResponseDataType) => void
  ) => void
  handleStartDelete: (key: React.Key, onSuccess: (data: Color) => void) => void
  handleDeleteItem: (
    id: number,
    onSuccess?: (meta: ResponseDataType) => void
  ) => void
}

const ColorListItem: React.FC<Props> = ({
  item,
  editing,
  isAdmin,
  handleStartSaveEditing,
  handleUpdateItem,
  handleStartDelete,
  handleDeleteItem,
  setEditingKey,
  setDeleteKey,
  setLoading,
  editingKey,
  dateCreation
}) => {
  const [form] = Form.useForm()
  const { message } = AntApp.useApp()
  const [colorPicker, setColorPicker] = useState<
    | {
        value: ColorValueType
        hex: string
      }
    | undefined
  >(undefined)
  console.log('Hello')

  return (
    <>
      <Form form={form}>
        <List.Item key={item.id} className='mb-5 rounded-sm bg-white'>
          <Flex vertical className='w-full' gap={10}>
            <Flex align='center' justify='space-between'>
              {editing && isAdmin ? (
                <Form.Item name='nameColor' initialValue={item.nameColor}>
                  <Input size='large' />
                </Form.Item>
              ) : (
                <Typography.Title copyable className='m-0 h-fit p-0' level={4}>
                  {item.nameColor}
                </Typography.Title>
              )}

              {editing ? (
                <Flex gap={5}>
                  <Button
                    type='primary'
                    onClick={() =>
                      handleStartSaveEditing(item.id!, (productToSave) => {
                        handleUpdateItem(
                          Number(item.id),
                          productToSave,
                          (meta) => {
                            if (meta.success) {
                              message.success('Updated!')
                            }
                          }
                        )
                      })
                    }
                  >
                    Save
                  </Button>
                  <Popconfirm
                    title={`Sure to cancel?`}
                    okButtonProps={{
                      size: 'middle'
                    }}
                    cancelButtonProps={{
                      size: 'middle'
                    }}
                    placement='topLeft'
                    onConfirm={() => {
                      setEditingKey('')
                    }}
                  >
                    <Button type='dashed'>Cancel</Button>
                  </Popconfirm>
                </Flex>
              ) : (
                <Flex gap={10}>
                  {isAdmin && (
                    <Button
                      type='primary'
                      disabled={editingKey !== ''}
                      onClick={() => {
                        setEditingKey(item.id!)
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {isAdmin && (
                    <Popconfirm
                      title={`Sure to delete?`}
                      onCancel={() => setDeleteKey('')}
                      onConfirm={() => {
                        setLoading(true)
                        handleStartDelete(item.id!, (productToDelete) => {
                          handleDeleteItem(productToDelete.id!, (meta) => {
                            if (meta.success) {
                              setLoading(false)
                              message.success('Deleted!')
                            }
                          })
                        })
                      }}
                    >
                      <Button
                        type='dashed'
                        onClick={() => setDeleteKey(item.id!)}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  )}
                </Flex>
              )}
            </Flex>
            <Flex align='center' justify='start' gap={5}>
              <Typography.Text type='secondary' className='w-40 font-medium'>
                Mã màu
              </Typography.Text>
              <Form.Item
                name='hexColor'
                initialValue={item.hexColor}
                className='m-0 w-full'
              >
                <Input
                  className='w-full'
                  value={colorPicker?.hex}
                  readOnly={editingKey !== item.id}
                  suffix={
                    <ColorPicker
                      defaultValue={colorPicker?.value}
                      value={colorPicker?.value}
                      onChange={(val, hex) => {
                        setColorPicker({
                          value: val,
                          hex: hex
                        })
                      }}
                      size='middle'
                      disabled={editingKey !== item.id}
                    />
                  }
                />
              </Form.Item>
            </Flex>
            {dateCreation && (
              <Flex vertical gap={10}>
                <Flex align='center' justify='start' gap={5}>
                  <Typography.Text
                    type='secondary'
                    className='w-40 font-medium'
                  >
                    Created at
                  </Typography.Text>

                  <Input
                    name='createdAt'
                    className='w-full'
                    defaultValue={item.createdAt}
                    readOnly
                  />
                </Flex>
                <Flex align='center' justify='start' gap={5}>
                  <Typography.Text
                    type='secondary'
                    className='w-40 font-medium'
                  >
                    Created at
                  </Typography.Text>

                  <Input
                    name='createdAt'
                    className='w-full'
                    defaultValue={item.createdAt}
                    readOnly
                  />
                </Flex>
              </Flex>
            )}
          </Flex>
        </List.Item>
      </Form>
    </>
  )
}

export default memo(ColorListItem)
