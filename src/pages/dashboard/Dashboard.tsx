import type { ProFormInstance } from '@ant-design/pro-components'
import {
  ProForm,
  ProFormCascader,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormList,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import { TreeSelect, message } from 'antd'
import moment from 'dayjs'
import { useRef } from 'react'

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0'
      }
    ]
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0'
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1'
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2'
      }
    ]
  }
]

const Dashboard = () => {
  const formRef = useRef<
    ProFormInstance<{
      name: string
      company?: string
      useMode?: string
    }>
  >()
  return (
    <ProForm<{
      name: string
      company?: string
      useMode?: string
    }>
      onFinish={async (values) => {
        await waitTime(2000)
        console.log(values)
        const val1 = await formRef.current?.validateFields()
        console.log('validateFields:', val1)
        const val2 = await formRef.current?.validateFieldsReturnFormatValue?.()
        console.log('validateFieldsReturnFormatValue:', val2)
        message.success('提交成功')
      }}
      formRef={formRef}
      params={{ id: '100' }}
      formKey='base-form-use-demo'
      dateFormatter={(value, valueType) => {
        console.log('---->', value, valueType)
        return value.format('YYYY/MM/DD HH:mm:ss')
      }}
      request={async () => {
        await waitTime(1500)
        return {
          name: '蚂蚁设计有限公司',
          useMode: 'chapter'
        }
      }}
      autoFocusFirstInput
    >
      <ProForm.Group>
        <ProFormText
          width='md'
          name='name'
          required
          dependencies={[['contract', 'name']]}
          addonBefore={<a>Before label</a>}
          addonAfter={<a>After label</a>}
          label='ProFormText'
          tooltip='最长为 24 位'
          placeholder='ProFormText'
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormText width='md' name='company' label='ProFormText' placeholder='ProFormText' />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit name='count' label='ProForm.Group' width='lg' />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name={['contract', 'name']} width='md' label='ProFormText' placeholder='ProFormText' />
        <ProFormDateRangePicker width='md' name={['contract', 'createTime']} label='ProFormDateRangePicker' />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={[
            {
              value: 'chapter',
              label: 'chapter'
            }
          ]}
          readonly
          width='xs'
          cacheForSwr
          name='useMode'
          label='ProFormSelect'
        />
        <ProFormSelect.SearchSelect
          width='xs'
          options={[
            {
              value: 'time',
              label: 'time',
              type: 'time',
              options: [
                {
                  value: 'time1',
                  label: 'time1'
                },
                {
                  value: 'time2',
                  label: 'time2'
                }
              ]
            }
          ]}
          name='unusedMode'
          label='ProFormSelect.SearchSelect'
        />
        <ProFormMoney
          width='md'
          name='money'
          label='ProFormMoney'
          fieldProps={{
            numberPopoverRender: true
          }}
        />
      </ProForm.Group>
      <ProFormText width='sm' name='id' label='id' />
      <ProFormText name='project' width='md' disabled label='ProFormText' initialValue='xxxx项目' />
      <ProFormTextArea colProps={{ span: 24 }} name='address' label='address' />
      <ProFormText width='xs' name='mangerName' disabled label='ProFormText' initialValue='启途' />
      <ProFormCascader
        width='md'
        request={async () => [
          {
            value: 'zhejiang',
            label: 'zhejiang',
            children: [
              {
                value: 'hangzhou',
                label: 'hangzhou',
                children: [
                  {
                    value: 'xihu',
                    label: 'xihu'
                  }
                ]
              }
            ]
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [
              {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                  {
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men'
                  }
                ]
              }
            ]
          }
        ]}
        name='areaList'
        label='ProFormCascader'
        initialValue={['zhejiang', 'hangzhou', 'xihu']}
        addonAfter={'qixian'}
      />
      <ProFormTreeSelect
        initialValue={['0-0-0']}
        label='ProFormTreeSelect'
        width={600}
        fieldProps={{
          fieldNames: {
            label: 'title'
          },
          treeData,
          treeCheckable: true,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          placeholder: 'Please select'
        }}
      />
      <ProFormDatePicker
        name='date'
        transform={(value) => {
          return {
            date: moment(value).unix()
          }
        }}
      />
      <ProFormList name='datas'>
        {() => {
          return (
            <>
              <ProFormDatePicker
                name='date'
                transform={(value) => {
                  return {
                    date: moment(value).unix()
                  }
                }}
              />

              <ProFormList name='innerDatas'>
                {() => {
                  return (
                    <>
                      <ProFormDatePicker
                        name='date'
                        transform={(value) => {
                          return {
                            date: moment(value).unix()
                          }
                        }}
                      />
                      <ProFormList name='innerDatas'>
                        {() => {
                          return (
                            <>
                              <ProFormDatePicker
                                name='date'
                                transform={(value) => {
                                  return {
                                    date: moment(value).unix()
                                  }
                                }}
                              />
                              <ProFormList name='innerDatas'>
                                {() => {
                                  return (
                                    <>
                                      <ProFormDatePicker
                                        name='date'
                                        transform={(value) => {
                                          return {
                                            date: moment(value).unix()
                                          }
                                        }}
                                      />
                                    </>
                                  )
                                }}
                              </ProFormList>
                            </>
                          )
                        }}
                      </ProFormList>
                    </>
                  )
                }}
              </ProFormList>
            </>
          )
        }}
      </ProFormList>
    </ProForm>
  )
}

export default Dashboard
