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
const Delivery = lazy(() => import('~/pages/delivery/Delivery'))
const Group = lazy(() => import('~/pages/group/Group'))
const Importation = lazy(() => import('~/pages/importation/Importation'))
const Note = lazy(() => import('~/pages/note/Note'))
const Print = lazy(() => import('~/pages/print/Print'))
const Product = lazy(() => import('~/pages/product/ProductPage'))
const Sewing = lazy(() => import('~/pages/sewing/Sewing'))
const Unit = lazy(() => import('~/pages/unit/Unit'))
const Finish = lazy(() => import('~/pages/Finish/Finish'))

export type SideType = {
  key: string | number
  name: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.LazyExoticComponent<() => JSX.Element> | React.ReactNode | any
  isGroup?: boolean
  icon: string
  children?: SideType[]
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
    component: Product,
    isGroup: false,
    icon: PackageSearchIcon
  },
  {
    key: '2',
    name: 'Nhập khẩu',
    path: 'importations',
    isGroup: false,
    component: Importation,
    icon: ImportIcon
  },
  {
    key: '3',
    name: 'May mẫu',
    path: 'sewing',
    component: Sewing,
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
    path: 'deliveries',
    component: Delivery,
    isGroup: false,
    icon: DeliveryIcon
  },
  {
    key: '6',
    name: 'Hoàn thành',
    path: 'finish',
    component: Finish,
    isGroup: false,
    icon: PackageSuccessIcon
  },
  {
    key: '8',
    name: 'Định nghĩa',
    path: 'structure',
    component: Outlet,
    isGroup: true,
    icon: PackageSuccessIcon,
    children: [
      {
        key: '8.1',
        name: 'Màu',
        path: '/structure/colors',
        component: ColorPage,
        icon: ColorIcon
      },
      {
        key: '8.2',
        name: 'Nhóm',
        path: '/structure/groups',
        component: Group,
        icon: AgeGroupIcon
      },
      {
        key: '8.3',
        name: 'Nơi In - Thêu',
        path: '/structure/print',
        component: Print,
        icon: PrintIcon
      },
      {
        key: '8.4',
        name: 'Đơn vị',
        path: '/structure/units',
        component: Unit,
        icon: UnitIcon
      },
      {
        key: '8.5',
        name: 'Ghi chú',
        path: '/structure/notes',
        component: Note,
        icon: NoteIcon
      }
    ]
  }
]
