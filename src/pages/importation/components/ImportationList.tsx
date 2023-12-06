import {
  App as AntApp,
  Button,
  ColorPicker,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Popconfirm,
  Switch,
  Typography
} from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import { setAdminAction, setRoleAction } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { Importation } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useImportation from '../hooks/useImportation'
import useImportationList from '../hooks/useImportationList'
import { ImportationTableDataType } from './ImportationTable'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const { Search } = Input

const ImportationList: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    loading,
    setLoading,
    searchText,
    setSearchText,
    dateCreation,
    setDateCreation,
    getDataList,
    handleUpdateItem,
    handleDeleteItem,
    handleSorted
  } = useImportation()
  const {
    form,
    editingKey,
    setEditingKey,
    setDeleteKey,
    dataSource,
    setDataSource,
    isEditing,
    handleStartDelete,
    handleStartSaveEditing
  } = useImportationList()
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { message } = AntApp.useApp()
  console.log('Group page loading...')

  useEffect(() => {
    getDataList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        setDataSource(
          meta.data.map((item: Importation) => {
            return {
              ...item,
              key: item.id
            } as ImportationTableDataType
          })
        )
      }
    })
    dispatch(setRoleAction('importation'))
  }, [])

  return (
    <>
      <Form form={form}>
        <Flex vertical gap={20}>
          <Search
            name='search'
            placeholder='Search code...'
            size='middle'
            enterButton
            allowClear
            onSearch={(value) => {
              if (value.length > 0) {
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  search: {
                    field: 'name',
                    term: value
                  }
                }
                getDataList(body, (meta) => {
                  if (meta?.success) {
                    setDataSource(
                      meta.data.map((item: Importation) => {
                        return {
                          ...item,
                          key: item.id
                        } as ImportationTableDataType
                      })
                    )
                  }
                })
              }
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Flex justify='space-between' align='center'>
            <Flex gap={10} align='center'>
              <Flex vertical gap={10}>
                <Switch
                  checkedChildren='Admin'
                  unCheckedChildren='Admin'
                  defaultChecked={false}
                  checked={user.isAdmin}
                  onChange={(val) => {
                    dispatch(setAdminAction(val))
                  }}
                />
                <Switch
                  checkedChildren='Access'
                  unCheckedChildren='Access'
                  defaultChecked={false}
                  checked={user.role === 'importation'}
                  onChange={(val) => {
                    dispatch(setRoleAction(val ? 'importation' : 'admin'))
                  }}
                />
              </Flex>
              <Switch
                checkedChildren='Date Creation'
                unCheckedChildren='Date Creation'
                defaultChecked={dateCreation}
                onChange={(val) => {
                  setDateCreation(val)
                }}
              />
              <Switch
                checkedChildren='Sorted'
                unCheckedChildren='Sorted'
                defaultChecked={false}
                onChange={(val) => {
                  handleSorted(val ? 'asc' : 'desc', (meta) => {
                    if (meta.success) {
                      setDataSource(
                        meta.data.map((item: Importation) => {
                          return {
                            ...item,
                            key: item.id
                          } as ImportationTableDataType
                        })
                      )
                    }
                  })
                }}
              />
            </Flex>
            <Flex gap={10} align='center'>
              <Button
                onClick={() => {
                  form.setFieldValue('search', '')
                  setSearchText('')
                  getDataList(defaultRequestBody, (meta) => {
                    if (meta?.success) {
                      setDataSource(
                        meta.data.map((item: Importation) => {
                          return {
                            ...item,
                            key: item.id
                          } as ImportationTableDataType
                        })
                      )
                      message.success('Reloaded!')
                    }
                  })
                }}
                className='flex items-center'
                type='default'
              >
                Reset
              </Button>
            </Flex>
          </Flex>

          <List
            className={props.className}
            itemLayout='vertical'
            size='large'
            pagination={{
              onChange: (page) => {
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: page,
                    pageSize: 5
                  },
                  search: {
                    field: 'id',
                    term: searchText
                  }
                }
                getDataList(body, (meta) => {
                  if (meta?.success) {
                    setDataSource(
                      meta.data.map((item: Importation) => {
                        return {
                          ...item,
                          key: item.id
                        } as ImportationTableDataType
                      })
                    )
                  }
                })
              },
              current: metaData?.page,
              pageSize: 5,
              total: metaData?.total
            }}
            loading={loading}
            dataSource={dataSource}
            renderItem={(item) => (
              <List.Item key={item.id} className='mb-5 rounded-sm bg-white'>
                <Flex vertical className='w-full' gap={10}>
                  <Flex align='center' justify='space-between'>
                    <Flex gap={10} align='center' className='relative'>
                      <Typography.Title
                        copyable
                        className='m-0 h-fit p-0'
                        level={4}
                      >
                        {item.product?.productCode}
                      </Typography.Title>

                      {item.product?.status === 'deleted' && (
                        <Typography.Title
                          code
                          className='m-0 p-0'
                          type='danger'
                          level={5}
                        >
                          Deleted
                        </Typography.Title>
                      )}
                    </Flex>

                    {isEditing(item.id!) ? (
                      <Flex gap={5}>
                        <Button
                          type='primary'
                          onClick={() =>
                            handleStartSaveEditing(item.id!, (itemToSave) => {
                              console.log(itemToSave)
                              handleUpdateItem(
                                Number(item.id),
                                itemToSave,
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
                            form.setFieldValue('quantity', item.quantity)
                            setEditingKey('')
                          }}
                        >
                          <Button type='dashed'>Cancel</Button>
                        </Popconfirm>
                      </Flex>
                    ) : (
                      <Flex gap={10}>
                        {(user.isAdmin || user.role === 'importation') && (
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
                        {user.isAdmin && (
                          <Popconfirm
                            title={`Sure to delete?`}
                            onCancel={() => setDeleteKey('')}
                            onConfirm={() => {
                              setLoading(true)
                              handleStartDelete(item.id!, (productToDelete) => {
                                handleDeleteItem(
                                  productToDelete.id!,
                                  (meta) => {
                                    if (meta.success) {
                                      setLoading(false)
                                      message.success('Deleted!')
                                    }
                                  }
                                )
                              })
                            }}
                          >
                            <Button
                              type='dashed'
                              disabled={editingKey !== ''}
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
                    <Typography.Text
                      type='secondary'
                      className='w-40 font-medium'
                    >
                      Mã màu
                    </Typography.Text>
                    <Flex className='w-full' align='center' justify='start'>
                      <ColorPicker
                        className='w-full'
                        defaultValue={item.product?.productCode}
                        size='middle'
                        disabled={editingKey !== item.id}
                        showText
                      />
                    </Flex>
                  </Flex>

                  <Flex align='center' justify='start' gap={5}>
                    <Typography.Text
                      type='secondary'
                      className='w-40 font-medium'
                    >
                      Lô nhập
                    </Typography.Text>
                    <Flex className='w-full' align='center' justify='start'>
                      <Form.Item
                        name={`quantity/${item.id}`}
                        initialValue={item.quantity}
                        className='m-0 w-full'
                      >
                        <InputNumber
                          className='w-full pr-12'
                          size='middle'
                          readOnly={editingKey !== item.id}
                          suffix={<span>Kiện</span>}
                        />
                      </Form.Item>
                    </Flex>
                  </Flex>

                  <Flex align='center' justify='start' gap={5}>
                    <Typography.Text
                      type='secondary'
                      className='w-40 font-medium'
                    >
                      Ngày nhập
                    </Typography.Text>
                    {isEditing(item.id!) ? (
                      <Form.Item
                        className='m-0 w-full'
                        name='dateOutputFCR'
                        initialValue={DayJS(item.dateImported)}
                      >
                        <DatePicker
                          className='w-full'
                          format={DatePattern.display}
                        />
                      </Form.Item>
                    ) : (
                      <Input
                        name='dateOutputFCR'
                        readOnly
                        className='zoom-in-0'
                        value={DayJS(item.dateImported).format(
                          DatePattern.display
                        )}
                      />
                    )}
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
                          defaultValue={DayJS(item.createdAt).format(
                            DatePattern.display
                          )}
                          readOnly
                        />
                      </Flex>
                      <Flex align='center' justify='start' gap={5}>
                        <Typography.Text
                          type='secondary'
                          className='w-40 font-medium'
                        >
                          Updated at
                        </Typography.Text>

                        <Input
                          name='updatedAt'
                          className='w-full'
                          defaultValue={DayJS(item.updatedAt).format(
                            DatePattern.display
                          )}
                          readOnly
                        />
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </List.Item>
            )}
          />
        </Flex>
      </Form>
    </>
  )
}

export default ImportationList
