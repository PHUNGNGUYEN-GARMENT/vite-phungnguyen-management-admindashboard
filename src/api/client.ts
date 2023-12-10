/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * All the necessary configuration will be handled in the client.js.
 * We can specify what is the URL to call API or specify logic that should be used reused for every API call.
 * The file can look something like this.
 */

import axios, { AxiosInstance } from 'axios'
import appConfig from '~/config/app.config'
import { ItemStatusType, SortDirection } from '~/typing'

export type ResponseDataType = {
  success?: boolean
  message: string
  data?: any
  meta?: any
  length?: number
  page?: number
  total?: number
}

export type RequestBodyType = {
  filter?: {
    status?: ItemStatusType | 'active'
    field?: string | 'id'
    items?: number[] | [-1] // items: mảng id : default -1: Lấy tất cả post
  }
  paginator?: {
    page?: number | 1 // trang hiện tại : default = 1
    pageSize?: number | 5 // số lượng post cần lấy : default = 10
  }
  search?: {
    field?: string | 'id'
    term?: string | '' // searchTerm: chỉ lấy những product có productCode chứa từ được truyền vào.
  }
  sorting?: {
    column?: string | 'id' // id
    direction?: SortDirection | 'desc' // direction: asc|desc sắp xếp trước sau
  }
}

export const defaultRequestBody: RequestBodyType = {
  filter: {
    items: [-1],
    status: 'active',
    field: 'id'
  },
  paginator: { page: 1, pageSize: 5 },
  search: {
    field: 'id',
    term: ''
  },
  sorting: {
    column: 'id', // id
    direction: 'desc' // direction: asc|desc sắp xếp trước sau
  }
}

const client: AxiosInstance = axios.create({
  baseURL: appConfig.baseUrl,
  timeout: 1000
})

export default client
