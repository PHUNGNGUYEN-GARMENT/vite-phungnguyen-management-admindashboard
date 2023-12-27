import { Typography } from 'antd'
import { BlockProps } from 'antd/es/typography/Base'
import { ItemStatusType } from '~/typing'

export interface SkyTableTypographyProps extends BlockProps {
  status?: ItemStatusType
}

const SkyTableTypography = ({ status, ...props }: SkyTableTypographyProps) => {
  return (
    <>
      <Typography.Text
        delete={status === 'deleted'}
        className='w-full font-medium'
        type={status === 'deleted' ? 'danger' : undefined}
      >
        {props.children}
      </Typography.Text>
    </>
  )
}

export default SkyTableTypography
