import { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import {
  AgeGroupIcon,
  ColorIcon,
  CutIcon,
  DashboardIcon,
  DeliveryIcon,
  ImportIcon,
  NoteIcon,
  PackageSearchIcon,
  PackageSuccessIcon,
  PrintIcon,
  SewingMachineIcon
} from '~/assets/icons'
import SampleSewingPage from '~/pages/sample-sewing/SampleSewingPage'
import SewingLinePage from '~/pages/sewing-line/SewingLinePage'
const Dashboard = lazy(() => import('~/pages/dashboard/Dashboard'))
const Cutting = lazy(() => import('~/pages/cutting/Cutting'))
const ColorPage = lazy(() => import('~/pages/color/ColorPage'))
const GroupPage = lazy(() => import('~/pages/group/GroupPage'))
const ImportationPage = lazy(
  () => import('~/pages/importation/ImportationPage')
)
const NotePage = lazy(() => import('~/pages/accessory-note/AccessoryNotePage'))
const AccessoryPage = lazy(() => import('~/pages/accessory/AccessoryPage'))
const PrintPage = lazy(() => import('~/pages/print/PrintPage'))
const ProductPage = lazy(() => import('~/pages/product/ProductPage'))
const SewingLineDeliveryPage = lazy(
  () => import('~/pages/sewing-line-delivery/SewingLineDeliveryPage')
)
const FinishPage = lazy(() => import('~/pages/Finish/Finish'))

export type SideType = {
  key: string
  name: string
  path: string
  component:
    | React.LazyExoticComponent<() => JSX.Element>
    | React.ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | any
  isGroup?: boolean
  icon: string
}

export const appRoutes: SideType[] = [
  {
    key: '0',
    name: 'Dashboard',
    path: '/',
    component: Dashboard,
    isGroup: false,
    icon: DashboardIcon
  },
  {
    key: '1',
    name: 'Sản phẩm',
    path: 'products',
    component: ProductPage,
    isGroup: false,
    icon: PackageSearchIcon
  },
  {
    key: '2',
    name: 'Nhập khẩu',
    path: 'importations',
    isGroup: false,
    component: ImportationPage,
    icon: ImportIcon
  },
  {
    key: '3',
    name: 'May mẫu',
    path: 'sewing',
    component: SampleSewingPage,
    isGroup: false,
    icon: SewingMachineIcon
  },
  {
    key: '14',
    name: 'Phụ liệu',
    path: 'accessory',
    component: AccessoryPage,
    isGroup: false,
    icon: SewingMachineIcon
  },
  {
    key: '4',
    name: 'Tổ cắt',
    path: 'cutting',
    isGroup: false,
    component: Cutting,
    icon: CutIcon
  },
  {
    key: '5',
    name: 'Chuyền may',
    path: 'sewing-line-deliveries',
    component: SewingLineDeliveryPage,
    icon: DeliveryIcon
  },
  {
    key: '6',
    name: 'Hoàn thành',
    path: 'finish',
    component: FinishPage,
    isGroup: false,
    icon: PackageSuccessIcon
  },
  {
    key: '8',
    name: 'Định nghĩa',
    path: 'structure',
    component: Outlet,
    isGroup: true,
    icon: PackageSuccessIcon
  },
  {
    key: '9',
    name: 'Màu',
    path: 'colors',
    component: ColorPage,
    icon: ColorIcon
  },
  {
    key: '10',
    name: 'Nhóm',
    path: 'groups',
    component: GroupPage,
    icon: AgeGroupIcon
  },
  {
    key: '13',
    name: 'Chuyền',
    path: 'deliveries',
    component: SewingLinePage,
    icon: DeliveryIcon
  },
  {
    key: '11',
    name: 'Nơi In - Thêu',
    path: 'print',
    component: PrintPage,
    icon: PrintIcon
  },
  {
    key: '12',
    name: 'Ghi chú phụ liệu',
    path: 'notes',
    component: NotePage,
    icon: NoteIcon
  }
]
