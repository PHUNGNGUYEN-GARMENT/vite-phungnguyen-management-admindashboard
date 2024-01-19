import { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import {
  AgeGroupIcon,
  ColorIcon,
  CutIcon,
  DashboardIcon,
  DeliveryIcon,
  NoteIcon,
  PackageSearchIcon,
  PackageSuccessIcon,
  PrintIcon,
  SewingMachineIcon
} from '~/assets/icons'
const Dashboard = lazy(() => import('~/pages/dashboard/Dashboard'))
const CuttingGroupPage = lazy(() => import('~/pages/cutting-group/CuttingGroupPage'))
const ColorPage = lazy(() => import('~/pages/color/ColorPage'))
const GroupPage = lazy(() => import('~/pages/group/GroupPage'))
const NotePage = lazy(() => import('~/pages/accessory-note/AccessoryNotePage'))
const GarmentAccessoryPage = lazy(() => import('~/pages/garment-accessory/GarmentAccessoryPage'))
const PrintPage = lazy(() => import('~/pages/print/PrintPage'))
const ProductPage = lazy(() => import('~/pages/product/ProductPage'))
// const ImportationPage = lazy(() => import('~/pages/importation/ImportationPage'))
const SampleSewingPage = lazy(() => import('~/pages/sample-sewing/SampleSewingPage'))
const SewingLinePage = lazy(() => import('~/pages/sewing-line/SewingLinePage'))
const SewingLineDeliveryPage = lazy(() => import('~/pages/sewing-line-delivery/SewingLineDeliveryPage'))
const FinishPage = lazy(() => import('~/pages/completion/CompletionPage'))

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
  // {
  //   key: '15',
  //   name: 'Nhập khẩu',
  //   path: 'importations',
  //   component: ImportationPage,
  //   isGroup: false,
  //   icon: PackageSearchIcon
  // },
  {
    key: '3',
    name: 'May mẫu',
    path: 'sample-sewing',
    component: SampleSewingPage,
    isGroup: false,
    icon: SewingMachineIcon
  },
  {
    key: '14',
    name: 'Phụ liệu',
    path: 'accessory',
    component: GarmentAccessoryPage,
    isGroup: false,
    icon: SewingMachineIcon
  },
  {
    key: '4',
    name: 'Tổ cắt',
    path: 'cutting-group',
    isGroup: false,
    component: CuttingGroupPage,
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
