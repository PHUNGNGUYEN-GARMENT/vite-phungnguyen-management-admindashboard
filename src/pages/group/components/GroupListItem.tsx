/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { memo } from 'react'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import { GroupTableDataType } from '../GroupPage'

interface Props extends SkyListItemProps<GroupTableDataType> {
  newRecord: any
  setNewRecord: (newRecord: any) => void
}

const GroupListItem: React.FC<Props> = ({ record, newRecord, setNewRecord, ...props }) => {
  return (
    <SkyListItem
      label={record.name}
      labelName='name'
      record={record}
      key={record.key}
      labelEditing
      value={newRecord.name}
      onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
      defaultValue={record.name}
      isEditing={props.isEditing}
      isDateCreation={props.isDateCreation}
      actions={props.actions}
    />
  )
}

export default memo(GroupListItem)
