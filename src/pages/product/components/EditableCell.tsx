/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Flex, Form, Input, InputNumber, Select, Typography } from 'antd'
import { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import { EditableCellProps } from '~/components/ui/Table/EditableCell'
import useAPIService from '~/hooks/useAPIService'
import { Color, Group, Print } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'

const EditableCell: React.FC<EditableCellProps<ProductTableDataType>> = ({ ...props }) => {
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Print>(PrintAPI)

  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

  useEffect(() => {
    const loadData = async () => {
      await colorService.getListItems(defaultRequestBody, props.setLoading, (meta) => {
        if (meta?.success) {
          const items = meta.data as Color[]
          setColors(items)
        }
      })
      await groupService.getListItems(defaultRequestBody, props.setLoading, (meta) => {
        if (meta?.success) {
          const items = meta.data as Group[]
          setGroups(items)
        }
      })
      await printService.getListItems(defaultRequestBody, props.setLoading, (meta) => {
        if (meta?.success) {
          const items = meta.data as Print[]
          setPrints(items)
        }
      })
    }
    if (props.editing) {
      loadData()
    }
  }, [props.editing])

  const inputNode = ((): React.ReactNode => {
    switch (props.dataIndex) {
      case 'productCode':
        return <Input value={props.initialValue} name='product-code' className='w-full' />
      case 'quantityPO':
        return <InputNumber value={props.initialValue} className='w-full' />
      case 'dateOutputFCR':
        return <DatePicker value={props.initialValue} className='w-full' format={DatePattern.display} />
      case 'dateInputNPL':
        return <DatePicker className='w-full' format={DatePattern.display} />
      case 'colorID':
        return (
          <Select
            placeholder='Select...'
            options={colors.map((item) => {
              return {
                label: item.name,
                value: item.id,
                key: item.id
              }
            })}
            value={props.initialValue}
            optionRender={(ori, info) => {
              return (
                <>
                  <Flex justify='space-between' align='center' key={info.index}>
                    <Typography.Text>{ori.label}</Typography.Text>
                    <div
                      className='h-6 w-6 rounded-sm'
                      style={{
                        backgroundColor: `${ori.key}`
                      }}
                    />
                  </Flex>
                </>
              )
            }}
            className='w-full'
          />
        )
      case 'groupID':
        return (
          <Select
            placeholder='Select...'
            options={groups.map((item) => {
              return {
                label: item.name,
                value: item.id,
                key: item.id
              }
            })}
            value={props.initialValue}
            optionRender={(ori, info) => {
              return (
                <>
                  <Flex justify='space-between' align='center' key={info.index}>
                    <Typography.Text>{ori.label}</Typography.Text>
                    <div
                      className='h-6 w-6 rounded-sm'
                      style={{
                        backgroundColor: `${ori.key}`
                      }}
                    />
                  </Flex>
                </>
              )
            }}
            className='w-full'
          />
        )
      case 'printID':
        return (
          <Select
            placeholder='Select...'
            options={prints.map((item) => {
              return {
                label: item.name,
                value: item.id,
                key: item.id
              }
            })}
            value={props.initialValue}
            optionRender={(ori, info) => {
              return (
                <>
                  <Flex justify='space-between' align='center' key={info.index}>
                    <Typography.Text>{ori.label}</Typography.Text>
                    <div
                      className='h-6 w-6 rounded-sm'
                      style={{
                        backgroundColor: `${ori.key}`
                      }}
                    />
                  </Flex>
                </>
              )
            }}
            className='w-full'
          />
        )
      default:
        return <Input name='input-form' />
    }
  })()

  return (
    <td>
      {props.editing ? (
        <Form.Item
          name={props.dataIndex}
          initialValue={props.initialValue}
          style={{ margin: 0 }}
          rules={[
            {
              required: props.required,
              message: `Please Input ${props.title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        props.children
      )}
    </td>
  )
}

export default memo(EditableCell)
