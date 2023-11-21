import { ColorTableDataType } from '../ColorPage'

enum TableActionKind {
  HANDLE_EDIT = 'HANDLE_EDIT',
  HANDLE_DELETE = 'HANDLE_DELETE',
  HANDLE_CANCEL_EDITING = 'HANDLE_CANCEL_EDITING',
  HANDLE_CONFIRM_EDITING = 'HANDLE_CONFIRM_EDITING',
  HANDLE_CONFIRM_DELETE = 'HANDLE_CONFIRM_DELETE',
  HANDLE_LOADING_CHANGE = 'HANDLE_LOADING_CHANGE',
  HANDLE_DELETE_ROW = 'HANDLE_DELETE_ROW',
  HANDLE_ADD = 'HANDLE_ADD'
}

interface TableState {
  dataSource: ColorTableDataType[]
  editingKey: React.Key
  deleteKey: React.Key
  loading: boolean
  setLoading: (status: boolean) => void
  isEditing: (record: ColorTableDataType) => boolean
  isDelete: (record: ColorTableDataType) => boolean
  setDataSource: (data: ColorTableDataType[]) => void
  setEditingKey: (key: React.Key) => void
  handleEdit: (record: Partial<ColorTableDataType> & { key: React.Key }) => void
  handleDelete: (record: ColorTableDataType) => void
  handleCancelEditing: () => void
  handleCancelConfirmEditing: () => void
  handleCancelConfirmDelete: () => void
  handleLoadingChange: (enable: boolean) => void
  handleDeleteRow: (key: React.Key) => void
  handleAdd: (item: ColorTableDataType) => void
}

// An interface for our actions
interface TableAction {
  type: TableActionKind
  payload: number
}

const tableReducer = (state: TableState, action: TableAction) => {}

export default tableReducer
