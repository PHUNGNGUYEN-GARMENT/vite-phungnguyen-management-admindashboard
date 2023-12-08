import {
  App as AntApp,
  Button,
  Flex,
  Form,
  Input,
  List,
  Popconfirm,
  Switch,
  Typography
} from 'antd'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import { setAdminAction } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { Print } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import usePrint from '../hooks/usePrint'
import usePrintList from '../hooks/usePrintList'
import ModalAddNewPrint from './ModalAddNewPrint'
import { PrintTableDataType } from './PrintTable'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const { Search } = Input

const PrintList: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    searchText,
    setSearchText,
    dateCreation,
    setDateCreation,
    handleAddNew,
    getDataList,
    handleUpdateItem,
    handleDeleteItem,
    handleSorted
  } = usePrint()
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
  } = usePrintList()
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { message } = AntApp.useApp()
  console.log('Group page loading...')

  useEffect(() => {
    getDataList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        setDataSource(
          meta.data.map((item: Print) => {
            return {
              ...item,
              key: item.id
            } as PrintTableDataType
          })
        )
      }
    })
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
                      meta.data.map((item: Print) => {
                        return {
                          ...item,
                          key: item.id
                        } as PrintTableDataType
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
                        meta.data.map((item: Print) => {
                          return {
                            ...item,
                            key: item.id
                          } as PrintTableDataType
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
                        meta.data.map((item: Print) => {
                          return {
                            ...item,
                            key: item.id
                          } as PrintTableDataType
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

              {user.isAdmin && (
                <Button
                  onClick={() => {
                    setOpenModal(true)
                  }}
                  className='flex items-center'
                  type='primary'
                  icon={<Plus size={20} />}
                >
                  New
                </Button>
              )}
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
                    field: 'name',
                    term: searchText
                  }
                }
                getDataList(body, (meta) => {
                  if (meta?.success) {
                    setDataSource(
                      meta.data.map((item: Print) => {
                        return {
                          ...item,
                          key: item.id
                        } as PrintTableDataType
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
                    {isEditing(item.id!) && user.isAdmin ? (
                      <Form.Item name='name' initialValue={item.name}>
                        <Input size='large' />
                      </Form.Item>
                    ) : (
                      <Typography.Title
                        copyable
                        className='m-0 h-fit p-0'
                        level={4}
                      >
                        {item.name}
                      </Typography.Title>
                    )}

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
                            setEditingKey('')
                          }}
                        >
                          <Button type='dashed'>Cancel</Button>
                        </Popconfirm>
                      </Flex>
                    ) : (
                      <Flex gap={10}>
                        {user.isAdmin && (
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
                  {/* <Flex align='center' justify='start' gap={5}>
                    <Typography.Text
                      type='secondary'
                      className='w-40 font-medium'
                    >
                      Mã màu
                    </Typography.Text>
                    {isEditing(item.id!) ? (
                      <Form.Item
                        name={`hexColor/${item.id!}`}
                        initialValue={item.hexColor}
                        className='m-0 w-full'
                      >
                        <ColorPicker
                          size='middle'
                          className='w-full'
                          defaultFormat='hex'
                          disabled={editingKey !== item.id}
                          showText
                        />
                      </Form.Item>
                    ) : (
                      <Flex className='w-full' align='center' justify='start'>
                        <ColorPicker
                          className='w-full'
                          defaultValue={item.hexColor}
                          size='middle'
                          disabled={editingKey !== item.id}
                          showText
                        />
                      </Flex>
                    )}
                  </Flex> */}
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
      {openModal && (
        <ModalAddNewPrint
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(_form) => {
            handleAddNew(_form, (meta) => {
              if (meta.success) {
                const data = meta?.data as Print
                console.log(data)
                const newDataSource = [...dataSource]
                newDataSource.unshift(data)
                setDataSource(newDataSource)
                message.success('Success!', 1)
              }
            })
          }}
        />
      )}
    </>
  )
}

export default PrintList