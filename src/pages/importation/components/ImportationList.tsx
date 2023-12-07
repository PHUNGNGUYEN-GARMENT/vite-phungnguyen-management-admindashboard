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
import ImportationAPI from '~/api/services/ImportationAPI'
import ProductAPI from '~/api/services/ProductAPI'
import useList, { ListDataType } from '~/hooks/useList'
import { setAdminAction, setRoleAction } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { Importation, Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useImportation from '../hooks/useImportation'

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
    handleSaveUpdateItem,
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
    handleStartDeleteItem,
    handleStartSaveEditing
  } = useList<Importation>([])
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { message } = AntApp.useApp()
  console.log('Group page loading...')

  useEffect(() => {
    dispatch(setRoleAction('importation'))

    Promise.all([
      ProductAPI.getItems(defaultRequestBody),
      ImportationAPI.getItems(defaultRequestBody)
    ])
      .then(([metaProduct, metaImportation]) => {
        if (metaProduct?.success && metaImportation?.success) {
          const products: Product[] = metaProduct.data
          const importations: Importation[] = metaImportation.data

          const dataSource = products.map((product) => {
            const productImportation = importations.find(
              (importation) => importation.productID === product.id
            )

            return {
              data: {
                ...productImportation,
                product
              },
              key: product.id!
            }
          })
          setDataSource(
            importations.length > 0
              ? dataSource
              : dataSource.map((item) => ({
                  ...item,
                  data: { product: item.data.product } as Importation
                }))
          )
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu cần
        console.error(error)
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
                      meta.data.map((item: Importation) => {
                        return {
                          ...item,
                          key: item.id
                        } as ListDataType<Importation>
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
                          } as ListDataType<Importation>
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
                          } as ListDataType<Importation>
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
                        } as ListDataType<Importation>
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
              <List.Item key={item.key} className='mb-5 rounded-sm bg-white'>
                <Flex vertical className='w-full' gap={10}>
                  <Flex align='center' justify='space-between'>
                    <Flex gap={10} align='center' className='relative'>
                      <Typography.Title
                        copyable
                        className='m-0 h-fit p-0'
                        level={4}
                      >
                        {item.data.product?.productCode}
                      </Typography.Title>

                      {item.data.product?.status === 'deleted' && (
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

                    {isEditing(item.key!) ? (
                      <Flex gap={5}>
                        <Button
                          type='primary'
                          onClick={async () => {
                            const row: Importation = await form.validateFields()
                            handleSaveUpdateItem(
                              Number(item.key!),
                              row,
                              (meta) => {
                                if (meta?.success) {
                                  message.success('Success')
                                }
                              }
                            )
                          }}
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
                            form.setFieldValue('quantity', item.data.quantity)
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
                              setEditingKey(item.key!)
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
                              // handleStartDelete(item.id!, (productToDelete) => {
                              //   handleDeleteItem(
                              //     productToDelete.id!,
                              //     (meta) => {
                              //       if (meta.success) {
                              //         setLoading(false)
                              //         message.success('Deleted!')
                              //       }
                              //     }
                              //   )
                              // })
                            }}
                          >
                            <Button
                              type='dashed'
                              disabled={editingKey !== ''}
                              onClick={() => setDeleteKey(item.key!)}
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
                        defaultValue={item.data.product?.productColor?.hexColor}
                        size='middle'
                        disabled
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
                    <Flex
                      className='w-full gap-2'
                      align='center'
                      justify='start'
                    >
                      {isEditing(item.key) ? (
                        <Form.Item
                          name='quantity'
                          initialValue={item.data.quantity}
                          className='m-0 w-full'
                          rules={[
                            {
                              required: true,
                              message: `Please Input this field!`
                            }
                          ]}
                        >
                          <InputNumber
                            className='relative w-full'
                            size='middle'
                            placeholder='Số lượng'
                            readOnly={editingKey !== item.key}
                          />
                        </Form.Item>
                      ) : (
                        <Input
                          name='quantity'
                          defaultValue={item.data.quantity}
                          className='relative w-full'
                          size='middle'
                          placeholder='Số lượng'
                          readOnly
                        />
                      )}
                      <Input
                        name='quantity-placeholder'
                        className='w-16'
                        size='middle'
                        disabled
                        defaultValue='Kiện'
                      />
                    </Flex>
                  </Flex>

                  <Flex align='center' justify='start' gap={5}>
                    <Typography.Text
                      type='secondary'
                      className='w-40 font-medium'
                    >
                      Ngày nhập
                    </Typography.Text>
                    {isEditing(item.key!) ? (
                      <Form.Item
                        className='m-0 w-full'
                        initialValue={DayJS(item.data.dateImported)}
                        name='dateImported'
                      >
                        <DatePicker
                          className='w-full'
                          format={DatePattern.display}
                        />
                      </Form.Item>
                    ) : (
                      <Input
                        name='dateImported'
                        readOnly
                        className='zoom-in-0'
                        placeholder='Ngày nhập khẩu'
                        defaultValue={
                          item.data.dateImported &&
                          DayJS(item.data.dateImported).format(
                            DatePattern.display
                          )
                        }
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
                          defaultValue={DayJS(item.data.createdAt).format(
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
                          defaultValue={DayJS(item.data.updatedAt).format(
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
