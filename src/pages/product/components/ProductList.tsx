import {
  App as AntApp,
  Button,
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
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import ProgressBar from '~/components/ui/ProgressBar'
import { setAdminAction } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useProduct from '../hooks/useProduct'
import useProductList from '../hooks/useProductList'
import ModalAddNewProduct from './ModalAddNewProduct'
import { ProductTableDataType } from './ProductTable'

const { Search } = Input

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ProductList: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    searchText,
    setSearchText,
    handleAddNew,
    getProductList,
    handleUpdateItem,
    handleDeleteItem,
    handleSorted
  } = useProduct()
  const {
    form,
    editingKey,
    setDeleteKey,
    dataSource,
    setDataSource,
    isEditing,
    handleStartDelete,
    handleStartSaveEditing,
    handleStartEditing,
    handleCancelEditing,
    handleCancelConfirmDelete
  } = useProductList()
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { message } = AntApp.useApp()
  console.log('Product page loading...')

  useEffect(() => {
    getProductList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        setDataSource(
          meta.data.map((item: Product) => {
            return {
              ...item,
              key: item.id
            } as ProductTableDataType
          })
        )
      }
    })
  }, [])

  return (
    <>
      <Form form={form} {...props}>
        <Flex vertical gap={20}>
          <Form.Item name='search'>
            <Search
              placeholder='Search code...'
              size='middle'
              enterButton
              allowClear
              onSearch={(value) => {
                if (value.length > 0) {
                  const body: RequestBodyType = {
                    ...defaultRequestBody,
                    searchTerm: value
                  }
                  getProductList(body, (meta) => {
                    if (meta?.success) {
                      setDataSource(
                        meta.data.map((item: Product) => {
                          return {
                            ...item,
                            key: item.id
                          } as ProductTableDataType
                        })
                      )
                    }
                  })
                }
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Item>
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
                checkedChildren='Sorted'
                unCheckedChildren='Sorted'
                defaultChecked={false}
                onChange={(val) => {
                  handleSorted(val ? 'asc' : 'desc', (meta) => {
                    if (meta.success) {
                      setDataSource(
                        meta.data.map((item: Product) => {
                          return {
                            ...item,
                            key: item.id
                          } as ProductTableDataType
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
                  getProductList(defaultRequestBody, (meta) => {
                    if (meta?.success) {
                      setDataSource(
                        meta.data.map((item: Product) => {
                          return {
                            ...item,
                            key: item.id
                          } as ProductTableDataType
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
                  searchTerm: searchText
                }
                getProductList(body, (meta) => {
                  if (meta?.success) {
                    setDataSource(
                      meta.data.map((item: Product) => {
                        return {
                          ...item,
                          key: item.id
                        } as ProductTableDataType
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
                <Flex vertical className='w-full' gap={20}>
                  <Flex align='center' justify='space-between'>
                    {isEditing(item.id!) && user.isAdmin ? (
                      <Form.Item
                        name='productCode'
                        initialValue={item.productCode}
                      >
                        <Input size='large' />
                      </Form.Item>
                    ) : (
                      <Typography.Title
                        copyable
                        className='m-0 h-fit p-0'
                        level={4}
                      >
                        {item.productCode}
                      </Typography.Title>
                    )}

                    {isEditing(item.id!) ? (
                      <Flex gap={5}>
                        <Button
                          type='primary'
                          onClick={() =>
                            handleStartSaveEditing(
                              item.id!,
                              (productToSave) => {
                                handleUpdateItem(
                                  Number(item.id),
                                  productToSave,
                                  (meta) => {
                                    if (meta.success) {
                                      message.success('Updated!')
                                    }
                                  }
                                )
                              }
                            )
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
                            handleCancelEditing()
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
                              handleStartEditing(item.id!)
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        {user.isAdmin && (
                          <Popconfirm
                            title={`Sure to delete?`}
                            onCancel={() => handleCancelConfirmDelete()}
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
                      Số lượng PO
                    </Typography.Text>
                    {isEditing(item.id!) ? (
                      <Form.Item
                        name='quantityPO'
                        initialValue={item.quantityPO}
                        className='m-0 w-full'
                      >
                        <InputNumber
                          className='w-full text-center'
                          readOnly={editingKey !== item.id}
                        />
                      </Form.Item>
                    ) : (
                      <Input
                        name='quantityPo'
                        className='w-full'
                        defaultValue={item.quantityPO}
                        readOnly
                      />
                    )}
                  </Flex>
                  <Flex align='center' justify='start' gap={5}>
                    <Typography.Text
                      type='secondary'
                      className='w-40 font-medium'
                    >
                      Ngày xuất FCR
                    </Typography.Text>
                    {isEditing(item.id!) ? (
                      <Form.Item
                        className='m-0 w-full'
                        name='dateOutputFCR'
                        initialValue={DayJS(item.dateOutputFCR)}
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
                        value={DayJS(item.dateOutputFCR).format('DD/MM/YYYY')}
                      />
                    )}
                  </Flex>
                  <Flex vertical gap={5}>
                    <Flex gap={5}>
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        May
                      </Typography.Text>
                      <Flex className='w-full' align='center' vertical>
                        {/* <Progress percent={70} strokeColor='var(--warn)' /> */}
                        <ProgressBar
                          count={item.progress?.sewing ?? 0}
                          total={item.quantityPO ?? 0}
                        />
                        <Typography.Text
                          type='secondary'
                          className='w-24 font-medium'
                        >
                          {item.progress?.sewing ?? 0}/{item.quantityPO ?? 0}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                    <Flex gap={5}>
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        Ủi
                      </Typography.Text>
                      <Flex className='w-full' align='center' vertical>
                        <ProgressBar
                          count={item.progress?.iron ?? 0}
                          total={item.quantityPO ?? 0}
                        />
                        <Typography.Text
                          type='secondary'
                          className='w-24 font-medium'
                        >
                          {item.progress?.iron ?? 0}/{item.quantityPO ?? 0}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                    <Flex gap={5}>
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        Kiểm tra
                      </Typography.Text>
                      <Flex className='w-full' align='center' vertical>
                        <ProgressBar
                          count={item.progress?.check ?? 0}
                          total={item.quantityPO ?? 0}
                        />
                        <Typography.Text
                          type='secondary'
                          className='w-24 font-medium'
                        >
                          {item.progress?.check ?? 0}/{item.quantityPO ?? 0}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                    <Flex gap={5}>
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        Đóng gói
                      </Typography.Text>
                      <Flex className='w-full' align='center' vertical>
                        <ProgressBar
                          count={item.progress?.pack ?? 0}
                          total={item.quantityPO ?? 0}
                        />
                        <Typography.Text
                          type='secondary'
                          className='w-24 font-medium'
                        >
                          {item.progress?.pack ?? 0}/{item.quantityPO ?? 0}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </List.Item>
            )}
          />
        </Flex>
      </Form>
      {openModal && (
        <ModalAddNewProduct
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(_form) => {
            handleAddNew(_form, (meta) => {
              if (meta.success) {
                const data = meta?.data as Product
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

export default ProductList
