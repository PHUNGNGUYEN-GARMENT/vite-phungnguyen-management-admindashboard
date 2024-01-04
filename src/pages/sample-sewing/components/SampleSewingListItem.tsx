/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Collapse, ColorPicker, Divider, Flex, Space, Typography } from 'antd'
import React, { memo } from 'react'
import SkyListItem, { SkyListItemProps } from '~/components/sky-ui/SkyList/SkyListItem'
import ListItemRow from '~/components/sky-ui/SkyTable/ListItemRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { SampleSewingTableDataType } from '../type'

interface Props extends SkyListItemProps<SampleSewingTableDataType> {
  newRecord: any
  setNewRecord: (newRecord: any) => void
  setLoading?: (enable: boolean) => void
}

const SampleSewingListItem: React.FC<Props> = ({ record, newRecord, setNewRecord, ...props }) => {
  return (
    <SkyListItem
      label={record.productCode}
      dataIndex='productCode'
      record={record}
      key={record.key}
      defaultValue={record.productCode}
      onValueChange={(e) => setNewRecord({ ...newRecord, productCode: e.target.value })}
      isEditing={props.isEditing}
      isDateCreation={props.isDateCreation}
      actions={props.actions}
    >
      <Collapse
        className=''
        items={[
          {
            key: '1',
            label: (
              <Typography.Title className='m-0' level={5} type='secondary'>
                Thông tin chi tiết
              </Typography.Title>
            ),
            children: (
              <Space direction='vertical' className='w-full gap-4'>
                <Space className='flex gap-0' split={<Divider className='my-3' />} direction='vertical'>
                  <ListItemRow {...props} label='Màu' isEditing={false} dataIndex='colorID' inputType='select'>
                    <Flex className='' justify='space-between' align='center' gap={10}>
                      <SkyTableTypography status={record.productColor?.color?.status}>
                        {record.productColor?.color?.name}
                      </SkyTableTypography>
                      {record.productColor && (
                        <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
                      )}
                    </Flex>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày gửi NPL'
                    isEditing={props.isEditing}
                    dataIndex='dateSubmissionNPL'
                    inputType='datepicker'
                    initialValue={
                      record.sampleSewing
                        ? record.sampleSewing.dateSubmissionNPL && DayJS(record.sampleSewing.dateSubmissionNPL)
                        : ''
                    }
                    onValueChange={(val) => {
                      setNewRecord({
                        ...newRecord,
                        dateSubmissionNPL: val ? DayJS(val).format(DatePattern.iso8601) : null
                      })
                    }}
                  >
                    <SkyTableTypography status={record.status}>
                      {record.sampleSewing
                        ? record.sampleSewing.dateSubmissionNPL &&
                          DayJS(record.sampleSewing.dateSubmissionNPL).format(DatePattern.display)
                        : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày duyệt mẫu PP'
                    isEditing={props.isEditing}
                    dataIndex='dateApprovalPP'
                    inputType='datepicker'
                    initialValue={
                      record.sampleSewing
                        ? record.sampleSewing.dateApprovalPP && DayJS(record.sampleSewing.dateApprovalPP)
                        : undefined
                    }
                    onValueChange={(val) =>
                      setNewRecord({
                        ...newRecord,
                        dateApprovalPP: val ? DayJS(val).format(DatePattern.iso8601) : null
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.sampleSewing
                        ? record.sampleSewing.dateApprovalPP &&
                          DayJS(record.sampleSewing.dateApprovalPP).format(DatePattern.display)
                        : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày duyệt SO'
                    isEditing={props.isEditing}
                    dataIndex='dateApprovalSO'
                    inputType='datepicker'
                    initialValue={
                      record.sampleSewing
                        ? record.sampleSewing.dateApprovalSO && DayJS(record.sampleSewing.dateApprovalSO)
                        : undefined
                    }
                    onValueChange={(val) =>
                      setNewRecord({
                        ...newRecord,
                        dateApprovalSO: val ? DayJS(val).format(DatePattern.iso8601) : null
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.sampleSewing
                        ? record.sampleSewing.dateApprovalSO &&
                          DayJS(record.sampleSewing.dateApprovalSO).format(DatePattern.display)
                        : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày gửi mẫu lần 1'
                    isEditing={props.isEditing}
                    dataIndex='dateSubmissionFirstTime'
                    inputType='datepicker'
                    initialValue={
                      record.sampleSewing
                        ? record.sampleSewing.dateSubmissionFirstTime &&
                          DayJS(record.sampleSewing.dateSubmissionFirstTime)
                        : undefined
                    }
                    onValueChange={(val) =>
                      setNewRecord({
                        ...newRecord,
                        dateSubmissionFirstTime: val ? DayJS(val).format(DatePattern.iso8601) : null
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.sampleSewing
                        ? record.sampleSewing.dateSubmissionFirstTime &&
                          DayJS(record.sampleSewing.dateSubmissionFirstTime).format(DatePattern.display)
                        : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày gửi mẫu lần 2'
                    isEditing={props.isEditing}
                    dataIndex='dateSubmissionSecondTime'
                    inputType='datepicker'
                    initialValue={
                      record.sampleSewing
                        ? record.sampleSewing.dateSubmissionSecondTime &&
                          DayJS(record.sampleSewing.dateSubmissionSecondTime)
                        : undefined
                    }
                    onValueChange={(val) =>
                      setNewRecord({
                        ...newRecord,
                        dateSubmissionSecondTime: val ? DayJS(val).format(DatePattern.iso8601) : null
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.sampleSewing
                        ? record.sampleSewing.dateSubmissionSecondTime &&
                          DayJS(record.sampleSewing.dateSubmissionSecondTime).format(DatePattern.display)
                        : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày gửi mẫu lần 3'
                    isEditing={props.isEditing}
                    dataIndex='dateSubmissionThirdTime'
                    inputType='datepicker'
                    initialValue={
                      record.sampleSewing
                        ? record.sampleSewing.dateSubmissionThirdTime &&
                          DayJS(record.sampleSewing.dateSubmissionThirdTime)
                        : undefined
                    }
                    onValueChange={(val) =>
                      setNewRecord({
                        ...newRecord,
                        dateSubmissionThirdTime: val ? DayJS(val).format(DatePattern.iso8601) : null
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.sampleSewing
                        ? record.sampleSewing.dateSubmissionThirdTime &&
                          DayJS(record.sampleSewing.dateSubmissionThirdTime).format(DatePattern.display)
                        : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày gửi mẫu lần 4'
                    isEditing={props.isEditing}
                    dataIndex='dateSubmissionForthTime'
                    inputType='datepicker'
                    initialValue={
                      record.sampleSewing
                        ? record.sampleSewing.dateSubmissionForthTime &&
                          DayJS(record.sampleSewing.dateSubmissionForthTime)
                        : undefined
                    }
                    onValueChange={(val) =>
                      setNewRecord({
                        ...newRecord,
                        dateSubmissionForthTime: val ? DayJS(val).format(DatePattern.iso8601) : null
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.sampleSewing
                        ? record.sampleSewing.dateSubmissionForthTime &&
                          DayJS(record.sampleSewing.dateSubmissionForthTime).format(DatePattern.display)
                        : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                  <ListItemRow
                    {...props}
                    label='Ngày gửi mẫu lần 5'
                    isEditing={props.isEditing}
                    dataIndex='dateSubmissionFifthTime'
                    inputType='datepicker'
                    initialValue={
                      record.sampleSewing
                        ? record.sampleSewing.dateSubmissionFifthTime &&
                          DayJS(record.sampleSewing.dateSubmissionFifthTime)
                        : undefined
                    }
                    onValueChange={(val) =>
                      setNewRecord({
                        ...newRecord,
                        dateSubmissionFifthTime: val ? DayJS(val).format(DatePattern.iso8601) : null
                      })
                    }
                  >
                    <SkyTableTypography status={record.status}>
                      {record.sampleSewing
                        ? record.sampleSewing.dateSubmissionFifthTime &&
                          DayJS(record.sampleSewing.dateSubmissionFifthTime).format(DatePattern.display)
                        : ''}
                    </SkyTableTypography>
                  </ListItemRow>
                </Space>
              </Space>
            )
          }
        ]}
      />
    </SkyListItem>
  )
}

export default memo(SampleSewingListItem)
