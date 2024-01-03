/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useCuttingGroup from '../hooks/useCuttingGroup'
import { CuttingGroupTableDataType } from '../type'
import ModalAddNewGroup from './ModalAddNewSampleSewing'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const CuttingGroup: React.FC<Props> = () => {
  const table = useTable<CuttingGroupTableDataType>([])
  const { width } = useDevice()

  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useCuttingGroup(table)

  const columns: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
            <SkyTableTypography status={record.status}>{record.productCode}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={false}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
            >
              <SkyTableTypography status={'active'}>{record.quantityPO}</SkyTableTypography>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Thực cắt',
      dataIndex: 'quantityRealCut',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantityRealCut'
              title='Thực cắt'
              inputType='number'
              required={true}
              initialValue={record.cuttingGroup ? record.cuttingGroup?.quantityRealCut : ''}
              value={newRecord && (newRecord.quantityRealCut ?? 0)}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityRealCut: val })}
            >
              <SkyTableTypography status={record.status}>
                {record.cuttingGroup ? record.cuttingGroup?.quantityRealCut : ''}
              </SkyTableTypography>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Ngày giờ cắt',
      dataIndex: 'timeCut',
      width: '15%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='timeCut'
            title='Ngày giờ cắt'
            inputType='datepicker'
            required={true}
            initialValue={record.cuttingGroup ? record.cuttingGroup.timeCut && DayJS(record.cuttingGroup.timeCut) : ''}
            onValueChange={(val: Dayjs) =>
              setNewRecord({ ...newRecord, timeCut: val ? DayJS(val).format(DatePattern.iso8601) : null })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.cuttingGroup
                ? record.cuttingGroup.timeCut && DayJS(record.cuttingGroup.timeCut).format(DatePattern.display)
                : ''}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Còn lại',
      dataIndex: 'remainingAmount',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell isEditing={false} dataIndex='remainingAmount' title='Còn lại' inputType='number'>
            <SkyTableTypography status={record.status}>
              {record.cuttingGroup
                ? record.cuttingGroup.quantityRealCut &&
                  record.cuttingGroup.quantityRealCut > 0 &&
                  (record.quantityPO ?? 0) - (record.cuttingGroup?.quantityRealCut ?? 0)
                : ''}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  const expandableColumns: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'In thêu',
      children: [
        {
          title: 'Ngày gửi in thêu',
          dataIndex: 'dateApprovalPP',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateApprovalPP'
                title='Ngày gửi in thêu'
                inputType='datepicker'
                required={true}
                initialValue={
                  record.cuttingGroup
                    ? record.cuttingGroup.dateSendEmbroidered && DayJS(record.cuttingGroup.dateSendEmbroidered)
                    : ''
                }
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateSendEmbroidered: val ? DayJS(val).format(DatePattern.iso8601) : null
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup
                    ? record.cuttingGroup.dateSendEmbroidered &&
                      DayJS(record.cuttingGroup.dateSendEmbroidered).format(DatePattern.display)
                    : ''}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        },
        {
          title: 'SL in thêu về',
          dataIndex: 'quantityArrivedEmbroidered',
          width: '20%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrivedEmbroidered'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup ? record.cuttingGroup.quantityArrivedEmbroidered : ''}
                  value={newRecord && (newRecord.quantityArrivedEmbroidered ?? 0)}
                  onValueChange={(val) => setNewRecord({ ...newRecord, quantityArrivedEmbroidered: val })}
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup ? record.cuttingGroup?.quantityArrivedEmbroidered : ''}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'quantityArrivedEmbroidered',
          width: '20%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrivedEmbroidered'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup ? record.cuttingGroup.quantityArrivedEmbroidered : ''}
                  value={newRecord && (newRecord.quantityArrivedEmbroidered ?? 0)}
                  onValueChange={(val) => setNewRecord({ ...newRecord, quantityArrivedEmbroidered: val })}
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup ? record.cuttingGroup?.quantityArrivedEmbroidered : ''}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        }
      ]
    },
    {
      title: 'SL giao BTP',
      dataIndex: 'quantityDeliveredBTP',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantityDeliveredBTP'
              title='SL giao BTP'
              inputType='number'
              required={true}
              initialValue={record.cuttingGroup ? record.cuttingGroup.quantityDeliveredBTP : ''}
              value={newRecord && (newRecord.quantityDeliveredBTP ?? 0)}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityDeliveredBTP: val })}
            >
              <SkyTableTypography status={record.status}>
                {record.cuttingGroup ? record.cuttingGroup?.quantityDeliveredBTP : ''}
              </SkyTableTypography>
            </EditableStateCell>
          </>
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
        onAddNewClick={() => setOpenModal(true)}
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
                setNewRecord(record?.cuttingGroup)
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
                  {width < 1600 && (
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
                  )}
                </Flex>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
      {openModal && <ModalAddNewGroup openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />}
    </>
  )
}

export default CuttingGroup
