/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * All the necessary configuration will be handled in the client.js.
 * We can specify what is the URL to call API or specify logic that should be used reused for every API call.
 * The file can look something like this.
 */

import axios, { AxiosInstance } from 'axios'
import appConfig from '~/config/app.config'
import { ItemStatusType } from '~/typing'

export type ResponseDataType = {
  success?: boolean
  message: string
  data?: any
  meta?: any
  count?: number
  page?: number
  total?: number
}

export type RequestBodyType = {
  filter?: {
    status: ItemStatusType
    items: number[] // items: mảng id : default -1: Lấy tất cả post
  }
  paginator?: {
    page: number // trang hiện tại : default = 1
    pageSize: number // số lượng post cần lấy : default = 10
  }
  searchTerm?: string // searchTerm: chỉ lấy những product có productCode chứa từ được truyền vào.
  sorting?: {
    column: string // id
    direction: 'asc' | 'desc' // direction: asc|desc sắp xếp trước sau
  }
}

const client: AxiosInstance = axios.create({
  baseURL: appConfig.baseUrl,
  timeout: 1000
})

export default client
