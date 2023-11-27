/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * All the necessary configuration will be handled in the client.js.
 * We can specify what is the URL to call API or specify logic that should be used reused for every API call.
 * The file can look something like this.
 */

import axios, { AxiosInstance } from 'axios'
import appConfig from '~/config/app.config'

export type ResponseDataType = {
  success?: boolean
  message: string
  data?: any
  meta?: any
  page?: number
  total?: number
}

const client: AxiosInstance = axios.create({
  baseURL: appConfig.baseUrl,
  timeout: 1000
})

export default client
