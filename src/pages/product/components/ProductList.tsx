import {
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
import ProgressBar from '~/components/ui/ProgressBar'
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
    <Form form={form}>
      <Flex vertical gap={20}>
        <Form.Item name='search'>
          <Search
            placeholder='Search code...'
            size='middle'
            enterButton
            allowClear
            onSearch={(value) => {
              if (value.length > 0) {
                querySearchData(value)
              }
            }}
          />
        </Form.Item>
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
          <Flex gap={10}>
            <Button
              onClick={() => {
                form.setFieldValue('search', '')
                requestListData()
              }}
              className='flex items-center'
              type='default'
            >
              Reset
            </Button>
            <Button
              onClick={() => {}}
              className='flex items-center'
              type='primary'
              icon={<Plus size={20} />}
            >
              New
            </Button>
          </Flex>
        </Flex>

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
                  {isEditing(item.id!) && isAdmin ? (
                    <Form.Item
                      name='productCode'
                      initialValue={item.productCode}
                    >
                      <Input size='large' />
                    </Form.Item>
                  ) : (
                    <Typography.Title className='m-0 h-fit p-0' level={4}>
                      {item.productCode}
                    </Typography.Title>
                  )}

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
                        count={item.sewing ?? 0}
                        total={item.quantityPO ?? 0}
                      />
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        {item.sewing ?? 0}/{item.quantityPO ?? 0}
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
                        count={item.iron ?? 0}
                        total={item.quantityPO ?? 0}
                      />
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        {item.iron ?? 0}/{item.quantityPO ?? 0}
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
                        count={item.check ?? 0}
                        total={item.quantityPO ?? 0}
                      />
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        {item.check ?? 0}/{item.quantityPO ?? 0}
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
                        count={item.pack ?? 0}
                        total={item.quantityPO ?? 0}
                      />
                      <Typography.Text
                        type='secondary'
                        className='w-24 font-medium'
                      >
                        {item.pack ?? 0}/{item.quantityPO ?? 0}
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
  )
}

export default ProductList
