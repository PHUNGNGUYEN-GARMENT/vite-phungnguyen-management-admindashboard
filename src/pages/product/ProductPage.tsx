/* eslint-disable react-refresh/only-export-components */
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import { Button, Dropdown } from 'antd'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useRef } from 'react'
import request from 'umi-request'
import Status from '~/components/ui/Status'
import appConfig from '~/config/app.config'
import { StatusType, StepRound } from '~/typing'
import { firstLetterUppercase } from '~/utils/text'

// Basic user information
export type ProductInfoItem = {
  productID: number
  productCode: string
  quantityPO: number
  progress: StepRound[]
  state: StatusType
  dateInputNPL: string
  dateOutputFCR: string
  createdAt: string
  updatedAt: string
}

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

const ProductPage: React.FC = () => {
  const actionRef = useRef<ActionType>()

  console.log('Product page loading...')

  const selectEnumValue = {
    normal: {
      text: 'To do',
      status: 'normal'
    },
    progress: {
      text: 'Progressing',
      status: 'warning'
    },
    warn: {
      text: 'Error',
      status: 'error'
    },
    error: {
      text: 'Done',
      status: 'success'
    }
  }

  const columns: ProColumns<ProductInfoItem>[] = [
    {
      key: 'ID',
      dataIndex: 'productID',
      title: 'ID',
      width: 48,
      editable: false,
      hideInSearch: true
    },
    {
      key: 'productCode',
      dataIndex: 'productCode',
      title: 'Code',
      copyable: false,
      ellipsis: true,
      filters: true,
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
      key: 'quantityPO',
      dataIndex: 'quantityPO',
      title: 'Số lượng PO',
      copyable: false,
      ellipsis: true,
      search: false,
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
      title: 'Progress',
      children: [
        {
          key: 'sewing',
          dataIndex: 'sewing',
          disable: true,
          title: 'May',
          onFilter: true,
          ellipsis: true,
          valueType: 'select',
          valueEnum: selectEnumValue,
          render: (_dom, entity) => {
            return (
              <Status type={entity.progress[0].type}>
                {firstLetterUppercase(entity.progress[0].type)}
              </Status>
            )
          }
        },
        {
          key: 'iron',
          dataIndex: 'iron',
          disable: true,
          title: 'Ủi',
          search: false,
          onFilter: true,
          valueEnum: selectEnumValue,
          render: (_, record) => (
            <Status type={record.progress[1].type}>
              {firstLetterUppercase(record.progress[1].type)}
            </Status>
          )
        },
        {
          key: 'check',
          dataIndex: 'check',
          disable: true,
          title: 'Kiểm tra',
          search: false,
          onFilter: true,
          valueEnum: selectEnumValue,
          render: (_, record) => (
            <Status type={record.progress[2].type}>
              {firstLetterUppercase(record.progress[2].type)}
            </Status>
          )
        },
        {
          key: 'pack',
          dataIndex: 'pack',
          disable: true,
          title: 'Đóng gói',
          search: false,
          onFilter: true,
          valueEnum: selectEnumValue,
          render: (_, record) => (
            <Status type={record.progress[3].type}>
              {firstLetterUppercase(record.progress[3].type)}
            </Status>
          )
        }
      ]
    },
    {
      key: 'dateOutputFCR',
      dataIndex: 'dateOutputFCR',
      title: 'FCR',
      valueType: 'date',
      sorter: true,
      hideInSearch: true
    },
    {
      title: 'FCR',
      dataIndex: 'dateOutputFCR',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: 'Actions',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index, action, { isEditable, type }) => [
        <a
          key='editable'
          onClick={() => {
            action?.startEditable?.(record.productID)
          }}
        >
          {type}
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

  return (
    <ProTable<ProductInfoItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        console.log(params)
        // await waitTime(2000)
        return request<{
          data: ProductInfoItem[]
        }>(`${appConfig.baseUrl}/products/find`, {
          params
        })
      }}
      editable={{
        type: 'multiple'
      }}
      // columnsState={{
      //   persistenceKey: 'pro-table-singe-demos',
      //   persistenceType: 'localStorage',
      //   onChange(value) {
      //     console.log('value: ', value)
      //   }
      // }}
      rowKey='productID'
      search={{
        defaultCollapsed: false,
        collapseRender: (collapsed) => {
          return (
            <Button
              type='link'
              icon={collapsed ? <ChevronDown /> : <ChevronUp />}
              className='flex-items flex flex-row-reverse justify-center'
              onClick={() => {
                console.log()
              }}
            >
              Expand
            </Button>
          )
        },
        searchText: 'Search',
        resetText: 'Reset'
        // optionRender: (searchConfig, formProps, dom) => [
        //   <Button
        //     key='search'
        //     type='primary'
        //     onClick={() => {
        //       console.log('Searching...')
        //       formProps.form?.submit()
        //     }}
        //   >
        //     Search
        //   </Button>,
        //   // <Button
        //   //   key='reset'
        //   //   onClick={() => {
        //   //     searchConfig.form?.resetFields([
        //   //       'productID',
        //   //       'productCode',
        //   //       'state',
        //   //       'quantityPO',
        //   //       'progress'
        //   //     ])
        //   //     // const values = searchConfig?.form?.getFieldsValue()
        //   //     // console.log(formProps)
        //   //   }}
        //   // >
        //   //   Reset
        //   // </Button>,
        //   ...dom,
        //   <Button
        //     key='out'
        //     onClick={() => {
        //       searchConfig.form?.resetFields(['productID', 'productCode'])
        //       const values = searchConfig?.form?.getFieldsValue()
        //       console.log(values)
        //     }}
        //   >
        //     Return
        //   </Button>
        // ]
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
