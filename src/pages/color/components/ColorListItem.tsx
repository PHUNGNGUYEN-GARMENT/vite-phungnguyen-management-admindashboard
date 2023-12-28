/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, Flex } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import React, { memo } from 'react'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import ListItemRow from '~/components/sky-ui/SkyTable/ListItemRow'
import { ColorTableDataType } from '../ColorPage'

interface Props extends SkyListItemProps<ColorTableDataType> {
  newRecord: any
  setNewRecord: (newRecord: any) => void
}

const ColorListItem: React.FC<Props> = ({ record, newRecord, setNewRecord, ...props }) => {
  return (
    <SkyListItem
      label={record.name}
      dataIndex='name'
      record={record}
      key={record.key}
      labelEditing
      inputType='text'
      value={newRecord.name}
      onValueChange={(e) => setNewRecord({ ...newRecord, name: e })}
      defaultValue={record.name}
      isEditing={props.isEditing}
      isDateCreation={props.isDateCreation}
      actions={props.actions}
    >
      <Flex className='w-full' align='center' justify='start' gap={5}>
        <ListItemRow
          {...props}
          label='Mã màu'
          isEditing={props.isEditing}
          dataIndex='hexColor'
          inputType='colorpicker'
          initialValue={record.hexColor}
          value={newRecord.hexColor}
          onValueChange={(val: AntColor) => setNewRecord({ ...newRecord, hexColor: val.toHexString() })}
        >
          <Flex className='w-full' justify='space-between' align='center' gap={10}>
            {record.hexColor && <ColorPicker size='middle' format='hex' value={record.hexColor} disabled showText />}
          </Flex>
        </ListItemRow>
      </Flex>
    </SkyListItem>
  )
}

export default memo(ColorListItem)
