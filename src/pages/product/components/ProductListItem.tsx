import { Flex, Typography } from 'antd'
import React, { memo } from 'react'
import { Product } from '~/typing'
import { cn } from '~/utils/helpers'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: Product
}

const ProductListItem: React.FC<Props> = ({ data, ...props }) => {
  return (
    <Flex vertical className={cn('w-full bg-white', props.className)}>
      <Typography.Title level={5}>{data.productCode}</Typography.Title>
    </Flex>
  )
}

export default memo(ProductListItem)
