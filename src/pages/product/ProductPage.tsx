/* eslint-disable react-refresh/only-export-components */
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import { Button, Dropdown, Input, Select, Space, Tag } from 'antd'
import { useEffect, useRef, useState } from 'react'
import request from 'umi-request'
import appConfig from '~/config/app.config'
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time)
}

const MySelect: React.FC<{
  state: {
    type: number
  }
  value?: string
  onChange?: (value: string) => void
}> = (props) => {
  const { state } = props

  const [innerOptions, setOptions] = useState<
    {
      label: React.ReactNode
      value: number
    }[]
  >([])

  useEffect(() => {
    const { type } = state || {}
    if (type === 2) {
      setOptions([
        {
          label: '星期一',
          value: 1
        },
        {
          label: '星期二',
          value: 2
        }
      ])
    } else {
      setOptions([
        {
          label: '一月',
          value: 1
        },
        {
          label: '二月',
          value: 2
        }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state)])

  return (
    <Select
      options={innerOptions}
      value={props.value}
      onChange={props.onChange}
    />
  )
}

const columns: ProColumns<API.ProductInfoItem>[] = [
  {
    title: 'ID',
    dataIndex: 'productID',
    width: 48
  },
  {
    title: '动态表单',
    key: 'direction',
    hideInTable: true,
    dataIndex: 'direction',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      if (type === 'form') {
        return null
      }
      const stateType = form.getFieldValue('state')
      if (stateType === 3) {
        return <Input />
      }
      if (stateType === 4) {
        return null
      }
      return (
        <MySelect
          {...rest}
          state={{
            type: stateType
          }}
        />
      )
    }
  },
  {
    title: 'Code',
    dataIndex: 'productCode',
    copyable: true,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Can not empty'
        }
      ]
    }
  },
  {
    title: 'Số lượng PO',
    dataIndex: 'quantityPO',
    copyable: false,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Can not empty'
        }
      ]
    }
  },
  {
    disable: true,
    title: 'Trạng thái',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
      todo: {
        text: 'To do',
        status: 'normal'
      },
      progressing: {
        text: 'Progressing',
        status: 'warning'
      },
      error: {
        text: 'Error',
        status: 'error'
      },
      processing: {
        text: 'Done',
        status: 'success',
        disabled: true
      }
    }
  },
  {
    disable: true,
    title: 'Progressing',
    dataIndex: 'progress',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_)
    },
    render: (_, record) => (
      <Space>
        <Tag>{record.progress.length}</Tag>
      </Space>
    )
  },
  {
    title: 'Ngày gửi FCR',
    key: 'showTime',
    dataIndex: 'dateOutputFCR',
    valueType: 'date',
    sorter: true,
    hideInSearch: true
  },
  {
    title: 'Ngày gửi FCR',
    dataIndex: 'dateOutputFCR',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1]
        }
      }
    }
  },
  {
    title: 'Actions',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key='editable'
        onClick={() => {
          action?.startEditable?.(record.productID)
        }}
      >
        Edit
      </a>,
      <a href={''} target='_blank' rel='noopener noreferrer' key='view'>
        Check
      </a>,
      <TableDropdown
        key='actionGroup'
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: 'Copy' },
          { key: 'delete', name: 'Delete' }
        ]}
      />
    ]
  }
]

const ProductPage: React.FC = () => {
  const actionRef = useRef<ActionType>()

  console.log('Product page loading...')

  return (
    <ProTable<API.ProductInfoItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        console.log(sort, filter)
        // await waitTime(2000)
        return request<{
          data: API.ProductInfoItem[]
        }>(`${appConfig.baseUrl}/products/find`, {
          params
        })
      }}
      editable={{
        type: 'multiple'
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value)
        }
      }}
      rowKey='productID'
      search={{
        defaultCollapsed: false,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom.reverse(),
          <Button
            key='out'
            onClick={() => {
              const values = searchConfig?.form?.getFieldsValue()
              console.log(values)
            }}
          >
            导出
          </Button>
        ]
      }}
      options={{
        setting: {
          listsHeight: 400
        }
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime]
            }
          }
          return values
        }
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page)
      }}
      dateFormatter='string'
      headerTitle='Thông tin mã hàng'
      toolBarRender={() => [
        <Button
          key='button'
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload()
          }}
          type='primary'
        >
          New
        </Button>,
        <Dropdown
          key='menu'
          menu={{
            items: [
              {
                label: '1st item',
                key: '1'
              },
              {
                label: '2nd item',
                key: '2'
              },
              {
                label: '3rd item',
                key: '3'
              }
            ]
          }}
        >
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>
      ]}
    />
  )
}

export default ProductPage
