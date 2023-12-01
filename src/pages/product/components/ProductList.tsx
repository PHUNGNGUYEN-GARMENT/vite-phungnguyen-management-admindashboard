import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Popconfirm,
  Progress,
  Switch,
  Typography
} from 'antd'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useProductList from '../hooks/useProductList'

const { Search } = Input

interface Props extends React.HTMLAttributes<HTMLElement> {
  isAdmin: boolean
  setIsAdmin: (state: boolean) => void
  loading: boolean
  setLoading: (enable: boolean) => void
}

const ProductList: React.FC<Props> = ({
  isAdmin,
  setIsAdmin,
  loading,
  setLoading,
  ...props
}) => {
  const {
    form,
    requestListData,
    metaData,
    editingKey,
    setDeleteKey,
    dataSource,
    isEditing,
    handleDelete,
    handleStartEditing,
    handleCancelEditing,
    handleSaveEditing,
    handleCancelConfirmDelete,
    querySearchData
  } = useProductList()
  console.log('Product page loading...')

  useEffect(() => {
    requestListData()
  }, [])

  useEffect(() => {
    console.log(metaData)
  }, [metaData])

  return (
    <Flex vertical gap={20}>
      <Search
        placeholder='Search code...'
        size='middle'
        enterButton
        onSearch={(value) => querySearchData(value)}
      />
      <Flex justify='space-between' align='end'>
        <Switch
          checkedChildren='Admin'
          unCheckedChildren='Admin'
          defaultChecked={false}
          checked={isAdmin}
          onChange={(val) => {
            setIsAdmin(val)
          }}
        />
        <Button
          onClick={() => {}}
          className='flex items-center'
          type='primary'
          icon={<Plus size={20} />}
        >
          New
        </Button>
      </Flex>
      <Form form={form}>
        <List
          className={props.className}
          itemLayout='vertical'
          size='large'
          pagination={{
            onChange: (page) => {
              console.log(page)
              requestListData(page, 5, setLoading)
            },
            pageSize: 5,
            total: metaData?.total
          }}
          loading={loading}
          dataSource={dataSource}
          renderItem={(item) => (
            <List.Item key={item.id} className='mb-5 rounded-sm bg-white'>
              <Flex vertical className='w-full' gap={20}>
                <Flex align='center' justify='space-between'>
                  <Typography.Title className='m-0 h-fit p-0' level={4}>
                    {item.productCode}
                  </Typography.Title>
                  {isEditing(item.id!) ? (
                    <Flex gap={5}>
                      <Button
                        type='primary'
                        onClick={() => handleSaveEditing(item.id!, setLoading)}
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
                        {/* <Typography.Link>Cancel</Typography.Link> */}
                        <Button type='dashed'>Cancel</Button>
                      </Popconfirm>
                    </Flex>
                  ) : (
                    <Flex gap={10}>
                      <Button
                        type='primary'
                        disabled={editingKey !== ''}
                        onClick={() => {
                          handleStartEditing(item.id!)
                        }}
                      >
                        Edit
                      </Button>
                      {isAdmin && (
                        <Popconfirm
                          title={`Sure to delete?`}
                          onCancel={() => handleCancelConfirmDelete()}
                          onConfirm={() => handleDelete(item.id!, setLoading)}
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
                      <Progress percent={70} />
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        1000/2000
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
                      <Progress percent={70} />
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        1000/2000
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
                      <Progress percent={70} />
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        1000/2000
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
                      <Progress percent={70} />
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        1000/2000
                      </Typography.Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </List.Item>
          )}
        />
      </Form>
    </Flex>
  )
}

export default ProductList
