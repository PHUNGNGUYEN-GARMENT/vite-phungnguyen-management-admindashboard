/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Flex, Typography } from 'antd'
import React, { memo } from 'react'
import { ItemStatusType } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'
import EditableStateCell, { EditableStateCellProps } from './EditableStateCell'
import SkyTableTypography from './SkyTableTypography'

interface Props extends EditableStateCellProps {
  label?: string | React.ReactNode
  children?: React.ReactNode
  status?: ItemStatusType
  render?: string | React.ReactNode
}

const ListItemRow = ({ ...props }: Props) => {
  return (
    <Flex className={cn('w-full', props.className)} align='center' justify='start' gap={5}>
      {typeof props.label !== 'string' ? (
        props.label
      ) : (
        <Typography.Text className='w-full font-semibold'>{props.label}</Typography.Text>
      )}
      <EditableStateCell {...props} title={props.title ? (typeof props.label === 'string' ? props.label : '') : ''}>
        {props.children ? (
          props.children
        ) : (
          <SkyTableTypography status={props.status}>
            {props.render
              ? props.render
              : props.inputType !== 'datepicker'
                ? props.value
                : DayJS(props.value).format(DatePattern.display)}
          </SkyTableTypography>
        )}
      </EditableStateCell>
    </Flex>
  )
}

export default memo(ListItemRow)
