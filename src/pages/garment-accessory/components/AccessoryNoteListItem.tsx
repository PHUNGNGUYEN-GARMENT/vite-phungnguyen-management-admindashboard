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
      dataIndex='title'
      record={record}
      labelEditing
      inputType='textarea'
      key={record.key}
      value={newRecord.title}
      onValueChange={(e) => setNewRecord({ ...newRecord, title: e })}
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
          <SkyTableTypography type='secondary' status={record.status}>
            {record.summary}
          </SkyTableTypography>
        </ListItemRow>
      </Flex>
    </SkyListItem>
  )
}

export default memo(AccessoryNoteListItem)
