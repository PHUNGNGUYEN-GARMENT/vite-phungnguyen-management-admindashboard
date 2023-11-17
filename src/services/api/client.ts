/**
 * All the necessary configuration will be handled in the client.js.
 * We can specify what is the URL to call API or specify logic that should be used reused for every API call.
 * The file can look something like this.
 */

import axios from 'axios'
import appConfig from '~/config/app.config'

const client = axios.create({
  baseURL: appConfig.baseUrl,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

export default client
