/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { dateValidatorDisplay } from '~/utils/helpers'
import useSampleSewing from '../hooks/useSampleSewing'
import { SampleSewingTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const SampleSewingTable: React.FC<Props> = () => {
  const table = useTable<SampleSewingTableDataType>([])

  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useSampleSewing(table)

  const columns: ColumnsType<SampleSewingTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
            <SkyTableTypography status={record.status}>{record.productCode}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={false}
              dataIndex='colorID'
              title='Màu'
              inputType='colorselector'
              required={false}
            >
              <Flex justify='space-between' align='center' gap={10}>
                <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
                  {record.productColor?.color?.name}
                </SkyTableTypography>
                {record.productColor && (
                  <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
                )}
              </Flex>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'NPL may mẫu',
      dataIndex: 'dateSubmissionNPL',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateSubmissionNPL'
            title='NPL may mẫu'
            inputType='datepicker'
            required={true}
            initialValue={record.sampleSewing && record.sampleSewing.dateSubmissionNPL}
            onValueChange={(val: Dayjs) =>
              setNewRecord({ ...newRecord, dateSubmissionNPL: DayJS(val).format(DatePattern.iso8601) })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionNPL)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ngày duyệt mẫu PP',
      dataIndex: 'dateApprovalPP',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateApprovalPP'
            title='Ngày duyệt mẫu PP'
            inputType='datepicker'
            required={true}
            initialValue={
              record.sampleSewing ? record.sampleSewing.dateApprovalPP && DayJS(record.sampleSewing.dateApprovalPP) : ''
            }
            onValueChange={(val: Dayjs) =>
              setNewRecord({ ...newRecord, dateApprovalPP: val && DayJS(val).format(DatePattern.iso8601) })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateApprovalPP)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ngày duyệt SO',
      dataIndex: 'dateApprovalSO',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateApprovalSO'
            title='Ngày duyệt SO'
            inputType='datepicker'
            required={true}
            initialValue={
              record.sampleSewing && record.sampleSewing.dateApprovalSO && DayJS(record.sampleSewing.dateApprovalSO)
            }
            onValueChange={(val: Dayjs) =>
              setNewRecord({ ...newRecord, dateApprovalSO: val && DayJS(val).format(DatePattern.iso8601) })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateApprovalSO)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  const expandableColumns: ColumnsType<SampleSewingTableDataType> = [
    {
      title: 'Ngày gửi mẫu lần 1',
      dataIndex: 'dateSubmissionFirstTime',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateSubmissionFirstTime'
            title='Ngày gửi mẫu lần 1'
            inputType='datepicker'
            required={true}
            initialValue={
              record.sampleSewing &&
              record.sampleSewing.dateSubmissionFirstTime &&
              DayJS(record.sampleSewing.dateSubmissionFirstTime)
            }
            onValueChange={(val: Dayjs) =>
              setNewRecord({
                ...newRecord,
                dateSubmissionFirstTime: val && DayJS(val).format(DatePattern.iso8601)
              })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionFirstTime)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ngày gửi mẫu lần 2',
      dataIndex: 'dateSubmissionSecondTime',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateSubmissionSecondTime'
            title='Ngày gửi mẫu lần 2'
            inputType='datepicker'
            required={true}
            initialValue={
              record.sampleSewing &&
              record.sampleSewing.dateSubmissionSecondTime &&
              DayJS(record.sampleSewing.dateSubmissionSecondTime)
            }
            onValueChange={(val: Dayjs) =>
              setNewRecord({
                ...newRecord,
                dateSubmissionSecondTime: val && DayJS(val).format(DatePattern.iso8601)
              })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.sampleSewing
                ? record.sampleSewing.dateSubmissionSecondTime &&
                  DayJS(record.sampleSewing.dateSubmissionSecondTime).format(DatePattern.display)
                : ''}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ngày gửi mẫu lần 3',
      dataIndex: 'dateSubmissionThirdTime',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateSubmissionThirdTime'
            title='Ngày gửi mẫu lần 3'
            inputType='datepicker'
            required={true}
            initialValue={
              record.sampleSewing &&
              record.sampleSewing.dateSubmissionThirdTime &&
              DayJS(record.sampleSewing.dateSubmissionThirdTime)
            }
            onValueChange={(val: Dayjs) =>
              setNewRecord({
                ...newRecord,
                dateSubmissionThirdTime: val && DayJS(val).format(DatePattern.iso8601)
              })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionThirdTime)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ngày gửi mẫu lần 4',
      dataIndex: 'dateSubmissionForthTime',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateSubmissionForthTime'
            title='Ngày gửi mẫu lần 4'
            inputType='datepicker'
            required={true}
            initialValue={
              record.sampleSewing
                ? record.sampleSewing.dateSubmissionForthTime && DayJS(record.sampleSewing.dateSubmissionForthTime)
                : ''
            }
            onValueChange={(val: Dayjs) =>
              setNewRecord({
                ...newRecord,
                dateSubmissionForthTime: val && DayJS(val).format(DatePattern.iso8601)
              })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionForthTime)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ngày gửi mẫu lần 5',
      dataIndex: 'dateSubmissionFifthTime',
      width: '15%',
      render: (_value: any, record: SampleSewingTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='dateSubmissionFifthTime'
            title='Ngày gửi mẫu lần 5'
            inputType='datepicker'
            required={true}
            initialValue={
              record.sampleSewing
                ? record.sampleSewing.dateSubmissionForthTime && DayJS(record.sampleSewing.dateSubmissionForthTime)
                : ''
            }
            onValueChange={(val: Dayjs) =>
              setNewRecord({
                ...newRecord,
                dateSubmissionFifthTime: val && DayJS(val).format(DatePattern.iso8601)
              })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.sampleSewing && dateValidatorDisplay(record.sampleSewing.dateSubmissionFifthTime)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <>
      <BaseLayout
        searchValue={searchText}
        onDateCreationChange={(enable) => table.setDateCreation(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked, e) => handleSortChange(checked, e)}
        onResetClick={() => handleResetClick()}
      >
        <SkyTable
          bordered
          loading={table.loading}
          columns={columns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          metaData={productService.metaData}
          onPageChange={handlePageChange}
          isDateCreation={table.dateCreation}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord(record?.sampleSewing)
                table.handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!, newRecord!)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!)
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: true
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <Flex vertical gap={10}>
                  <SkyTable
                    bordered
                    loading={table.loading}
                    columns={expandableColumns}
                    rowClassName='editable-row'
                    dataSource={table.dataSource.filter((item) => item.id === record.id)}
                    metaData={productService.metaData}
                    pagination={false}
                    isDateCreation={table.dateCreation}
                    editingKey={table.editingKey}
                    deletingKey={table.deletingKey}
                  />
                </Flex>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
    </>
  )
}

export default SampleSewingTable
