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
import Finish from '~/pages/Finish/Finish'
import ColorPage from '~/pages/color/ColorPage'
import Cutting from '~/pages/cutting/Cutting'
import Dashboard from '~/pages/dashboard/Dashboard'
import Delivery from '~/pages/delivery/Delivery'
import Group from '~/pages/group/Group'
import Importation from '~/pages/importation/Importation'
import Note from '~/pages/note/Note'
import Print from '~/pages/print/Print'
import Product from '~/pages/product/ProductPage'
import Sewing from '~/pages/sewing/Sewing'
import Unit from '~/pages/unit/Unit'
import ProductApi from '~/services/api/services/Product.api'

export const appRoutes = [
  {
    key: '0',
    name: 'Dashboard',
    path: '/',
    component: Dashboard,
    icon: DashboardIcon,
    loader: async () => ProductApi.listProduct()
  },
  {
    key: '1',
    name: 'Sản phẩm',
    path: 'products',
    component: Product,
    icon: PackageSearchIcon,
    loader: async () => ProductApi.listProduct()
  },
  {
    key: '2',
    name: 'Nhập khẩu',
    path: 'importations',
    component: Importation,
    icon: ImportIcon,
    loader: async () => ProductApi.listProduct()
  },
  {
    key: '3',
    name: 'May mẫu',
    path: 'sewing',
    component: Sewing,
    icon: SewingMachineIcon,
    loader: async () => ProductApi.listProduct()
  },
  {
    key: '4',
    name: 'Tổ cắt',
    path: 'cutting',
    component: Cutting,
    icon: CutIcon,
    loader: async () => ProductApi.listProduct()
  },
  {
    key: '5',
    name: 'Chuyền may',
    path: 'deliveries',
    component: Delivery,
    icon: DeliveryIcon,
    loader: async () => ProductApi.listProduct()
  },
  {
    key: '6',
    name: 'Hoàn thành',
    path: 'finish',
    component: Finish,
    icon: PackageSuccessIcon,
    loader: async () => ProductApi.listProduct()
  },
  {
    key: '7',
    name: 'Định nghĩa',
    path: 'structure',
    component: Outlet,
    icon: PackageSuccessIcon,
    children: [
      {
        key: '7.1',
        name: 'Màu',
        path: '/structure/colors',
        component: ColorPage,
        icon: ColorIcon,
        loader: async () => ProductApi.listProduct()
      },
      {
        key: '7.2',
        name: 'Nhóm',
        path: '/structure/groups',
        component: Group,
        icon: AgeGroupIcon,
        loader: async () => ProductApi.listProduct()
      },
      {
        key: '7.3',
        name: 'Nơi In - Thêu',
        path: '/structure/print',
        component: Print,
        icon: PrintIcon,
        loader: async () => ProductApi.listProduct()
      },
      {
        key: '7.4',
        name: 'Đơn vị',
        path: '/structure/units',
        component: Unit,
        icon: UnitIcon,
        loader: async () => ProductApi.listProduct()
      },
      {
        key: '7.5',
        name: 'Ghi chú',
        path: '/structure/notes',
        component: Note,
        icon: NoteIcon,
        loader: async () => ProductApi.listProduct()
      }
    ]
  }
]