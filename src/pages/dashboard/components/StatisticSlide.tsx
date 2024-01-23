import { Col, ColProps, Flex, Row, Statistic, Typography } from 'antd'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import useAPIService from '~/hooks/useAPIService'
import { Product } from '~/typing'
import { cn } from '~/utils/helpers'

interface Props extends HTMLAttributes<HTMLElement> {}

interface CartType extends ColProps {
  value: number
  type: 'red' | 'yellow' | 'blue' | 'green' | 'grey'
  status?: 'danger' | 'secondary' | 'success' | 'waring'
}

const StatisticSlide: React.FC<Props> = ({ ...props }) => {
  const productService = useAPIService<Product>(ProductAPI)

  const [loading, setLoading] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      await productService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: 1, pageSize: -1 }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) {
            throw new Error(meta?.message)
          } else {
            setProducts(meta.data as Product[])
          }
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const Card: React.FC<CartType> = ({ type, status, value, ...props }) => {
    const resultMessage = (() => {
      switch (type) {
        case 'red':
          return 'Error'
        case 'blue':
          return 'Active'
        case 'yellow':
          return 'Warning'
        case 'green':
          return 'Live'
        default:
          return 'Deleted'
      }
    })()

    return (
      <Col span={6} {...props} className={cn('relative', props.className)}>
        <Flex
          vertical
          gap={20}
          align='center'
          justify='center'
          className={cn('flex items-center overflow-hidden rounded-lg bg-gradient-to-r p-5', {
            'from-[#ffbf96] to-[#ed114b]': type === 'red',
            'from-[#dde48e] to-[#c3c31b]': type === 'yellow',
            'from-[#90caf9] to-[#047edf]': type === 'blue',
            'from-[#84d985] to-[#02d514]': type === 'green',
            'from-[#6d6d6d] to-[#000000]': type === 'grey'
          })}
        >
          <Statistic
            loading={loading}
            valueStyle={{ color: '#ffffff' }}
            title={<Typography.Text className='font-normal text-white'>{props.title}</Typography.Text>}
            value={value}
            className='h-full w-full font-bold'
          />
          <Flex gap={5} className='h-full w-full' align='center'>
            <div
              className={cn('h-2 w-2 rounded-full', {
                'bg-error': status ? status === 'danger' : type === 'red',
                'bg-warning': status ? status === 'waring' : type === 'yellow',
                'bg-success': status ? status === 'success' : type === 'blue',
                'bg-green-500': status ? status === 'danger' : type === 'green',
                'bg-black': type === 'grey'
              })}
            />
            <Typography.Text code className='text-white'>
              {resultMessage}
            </Typography.Text>
          </Flex>
          <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white bg-opacity-50' />
          <div className='absolute -bottom-28 -right-10 h-48 w-48 rounded-full bg-white bg-opacity-50' />
        </Flex>
      </Col>
    )
  }

  return (
    <>
      <Flex vertical className={cn(props.className)}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className='w-full justify-around'>
          <Card
            value={products.filter((item) => item.status === 'active').length}
            type='blue'
            title='Tổng mã sản phẩm'
          />
          <Card value={123} type='red' title='Tổng mã đang lỗi' />
          <Card value={123} type='green' title='Tổng người dùng' />
          <Card
            value={products.filter((item) => item.status === 'deleted').length}
            type='grey'
            title='Tổng mã đã xoá'
          />
        </Row>
      </Flex>
    </>
  )
}

export default StatisticSlide
