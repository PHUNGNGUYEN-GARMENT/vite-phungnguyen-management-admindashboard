import { Flex, Typography } from 'antd'
import React, { memo } from 'react'
import { Product } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  product: Product | undefined
  setProduct: (product: Product) => void
  dateSewingNPL: string
  setDateSewingNPL: (dateSewingNPL: string) => void
}

// eslint-disable-next-line no-empty-pattern, react-refresh/only-export-components
const AddNewSampleSewing: React.FC<Props> = () => {
  return (
    <Flex vertical gap={20}>
      <Typography.Title level={2}>Add new sample sewing</Typography.Title>
      <Flex align='center' gap={5}>
        <Typography.Text className='w-24 flex-shrink-0'>
          Print place:
        </Typography.Text>
      </Flex>
    </Flex>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(AddNewSampleSewing)
