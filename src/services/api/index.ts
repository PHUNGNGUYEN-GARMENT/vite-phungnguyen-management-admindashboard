import axios from 'axios'

const baseUrl = 'https://swapi.dev/api'

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000
})

export default instance
