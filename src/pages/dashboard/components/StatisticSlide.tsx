import { Flex, Row, Statistic, Typography } from 'antd'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import useAPIService from '~/hooks/useAPIService'
import { Product } from '~/typing'
import { cn } from '~/utils/helpers'
import StatisticCard from './StatisticCard'

interface Props extends HTMLAttributes<HTMLElement> {}

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

  return (
    <>
      <Flex className={cn(props.className)}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className='w-full justify-around'>
          <StatisticCard className='relative flex h-40 items-center overflow-hidden rounded-lg bg-gradient-to-r from-[#ffbf96] to-[#fe7096]'>
            <Flex vertical className='mx-3' gap={20}>
              <Statistic
                loading={loading}
                valueStyle={{ color: '#ffffff' }}
                title={<Typography.Text className='font-normal text-white'>Tổng mã sản phẩm</Typography.Text>}
                value={products.length}
                className='font-bold'
              />
              <Flex className='' align='center' gap={5}>
                <div className='h-1 w-1 rounded-full bg-success' />
                <Typography.Text className='text-white'>Đang hoạt động</Typography.Text>
              </Flex>
              <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white bg-opacity-50' />
              <div className='absolute -bottom-28 -right-10 h-48 w-48 rounded-full bg-white bg-opacity-50' />
            </Flex>
          </StatisticCard>
          <StatisticCard className='relative flex h-40 items-center overflow-hidden rounded-lg bg-gradient-to-r from-[#90caf9] to-[#047edf]'>
            <Flex vertical className='mx-3' gap={20}>
              <Statistic
                loading={loading}
                valueStyle={{ color: '#ffffff' }}
                title={<Typography.Text className='font-normal text-white'>Tổng mã sản phẩm</Typography.Text>}
                value={products.length}
                className='font-bold'
              />
              <Flex className='' align='center' gap={5}>
                <div className='h-1 w-1 rounded-full bg-success' />
                <Typography.Text className='text-white'>Đang hoạt động</Typography.Text>
              </Flex>
              <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white bg-opacity-50' />
              <div className='absolute -bottom-28 -right-10 h-48 w-48 rounded-full bg-white bg-opacity-50' />
            </Flex>
          </StatisticCard>
          <StatisticCard className='relative flex h-40 items-center overflow-hidden rounded-lg bg-gradient-to-r from-[#84d9d2] to-[#07cdae]'>
            <Flex vertical className='mx-3' gap={20}>
              <Statistic
                loading={loading}
                valueStyle={{ color: '#ffffff' }}
                title={<Typography.Text className='font-normal text-white'>Tổng mã sản phẩm</Typography.Text>}
                value={products.length}
                className='font-bold'
              />
              <Flex className='' align='center' gap={5}>
                <div className='h-1 w-1 rounded-full bg-success' />
                <Typography.Text className='text-white'>Đang hoạt động</Typography.Text>
              </Flex>
              <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white bg-opacity-50' />
              <div className='absolute -bottom-28 -right-10 h-48 w-48 rounded-full bg-white bg-opacity-50' />
            </Flex>
          </StatisticCard>
        </Row>
      </Flex>
    </>
  )
}

export default StatisticSlide
