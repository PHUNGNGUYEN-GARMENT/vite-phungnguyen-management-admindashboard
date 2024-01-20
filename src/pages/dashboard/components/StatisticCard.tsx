import { Col, ColProps, Flex } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'

interface Props extends ColProps {}

const StatisticCard: React.FC<Props> = ({ ...props }) => {
  return (
    <>
      <Col {...props} span={6} className={cn('gutter-row px-2', props.className)}>
        <Flex className=''>{props.children}</Flex>
      </Col>
    </>
  )
}

export default StatisticCard
