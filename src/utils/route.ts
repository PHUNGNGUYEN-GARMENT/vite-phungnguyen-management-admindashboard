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
  SewingMachineIcon,
  UnitIcon
} from '~/assets/icons'
import SampleSewingPage from '~/pages/sample-sewing/SampleSewingPage'
// import Finish from '~/pages/Finish/Finish'
// import ColorPage from '~/pages/color/ColorPage'
// import Cutting from '~/pages/cutting/Cutting'
// import Dashboard from '~/pages/dashboard/Dashboard'
// import Delivery from '~/pages/delivery/Delivery'
// import Group from '~/pages/group/Group'
// import Importation from '~/pages/importation/Importation'
// import Note from '~/pages/note/Note'
// import Print from '~/pages/print/Print'
// import Product from '~/pages/product/ProductPage'
// import Sewing from '~/pages/sewing/Sewing'
// import Unit from '~/pages/unit/Unit'
// import ProductApi from '~/services/api/services/Product.api'

const Dashboard = lazy(() => import('~/pages/dashboard/Dashboard'))
const Cutting = lazy(() => import('~/pages/cutting/Cutting'))
const ColorPage = lazy(() => import('~/pages/color/ColorPage'))
const GroupPage = lazy(() => import('~/pages/group/GroupPage'))
const ImportationPage = lazy(() => import('~/pages/importation/Importation'))
const NotePage = lazy(() => import('~/pages/note/Note'))
const PrintPage = lazy(() => import('~/pages/print/PrintPage'))
const ProductPage = lazy(() => import('~/pages/product/ProductPage'))
const SewingLineDeliveryPage = lazy(
  () => import('~/pages/sewing-line-delivery/SewingLineDeliveryPage')
)
const UnitPage = lazy(() => import('~/pages/unit/Unit'))
const FinishPage = lazy(() => import('~/pages/Finish/Finish'))

export type SideType = {
  key: string
  name: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component:
    | React.LazyExoticComponent<() => JSX.Element>
    | React.ReactNode
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
    key: '4',
    name: 'Tổ cắt',
    path: 'cutting',
    isGroup: false,
    component: Cutting,
    icon: CutIcon
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
    key: '5',
    name: 'Chuyền may',
    path: 'deliveries',
    component: SewingLineDeliveryPage,
    isGroup: false,
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
    name: 'Đơn vị',
    path: 'units',
    component: UnitPage,
    icon: UnitIcon
  },
  {
    key: '13',
    name: 'Ghi chú',
    path: 'notes',
    component: NotePage,
    icon: NoteIcon
  }
]
