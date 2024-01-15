/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Flex } from 'antd'
import { memo } from 'react'
import { cn } from '~/utils/helpers'
import { EditableStateCellProps } from './EditableStateCell'
import SkyTableTypography from './SkyTableTypography'

interface Props extends EditableStateCellProps {}

const ExpandableItemRow = ({ ...props }: Props) => {
  return (
    <Flex className={cn('w-full', props.className)} align='center' justify='start' gap={5}>
      <SkyTableTypography strong className='w-1/2'>
        {props.title}
      </SkyTableTypography>
      {props.children}
    </Flex>
  )
}

export default memo(ExpandableItemRow)
