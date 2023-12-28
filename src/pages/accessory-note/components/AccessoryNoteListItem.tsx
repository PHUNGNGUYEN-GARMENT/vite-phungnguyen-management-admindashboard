/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Flex } from 'antd'
import React, { memo } from 'react'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import ListItemRow from '~/components/sky-ui/SkyTable/ListItemRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { AccessoryNoteTableDataType } from '../type'

interface Props extends SkyListItemProps<AccessoryNoteTableDataType> {
  newRecord: AccessoryNoteTableDataType
  setNewRecord: (newRecord: AccessoryNoteTableDataType) => void
}

const AccessoryNoteListItem: React.FC<Props> = ({ record, newRecord, setNewRecord, ...props }) => {
  return (
    <SkyListItem
      label={record.title}
      labelName='title'
      record={record}
      key={record.key}
      value={newRecord.title}
      onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
      defaultValue={record.title}
      isEditing={props.isEditing}
      isDateCreation={props.isDateCreation}
      actions={props.actions}
    >
      <Flex className='w-full' align='center' justify='start' gap={5}>
        <ListItemRow
          {...props}
          isEditing={props.isEditing}
          dataIndex='summary'
          inputType='textarea'
          initialValue={record.summary}
          value={newRecord.summary}
          onValueChange={(val) => setNewRecord({ ...newRecord, summary: val })}
        >
          <SkyTableTypography status={record.status}>{record.title}</SkyTableTypography>
        </ListItemRow>
      </Flex>
    </SkyListItem>
  )
}

export default memo(AccessoryNoteListItem)
