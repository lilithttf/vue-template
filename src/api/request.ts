import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'
import { router } from '../router'
import { useUsertore } from '../stores'
// 初始化axios
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
  const token = useUsertore().token
  const headers = req.headers || {}
  if (!headers.Authorization) {
    headers.Authorization = `Bearer ${token}`
  }
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  const { code, message, data } = res.data
  if (code == 1 || code == 10000 || code == 200) {
    // 请求成功
    return data
  } else if (code === 500001) {
    // 登录过期
    ElMessage.error('登录身份过期，请重新登录')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject('登录身份过期，请重新登录')
  } else {
    // 请求报错
    ElMessage.error(message || '网络异常')
    return Promise.reject(message || '网络异常')
  }
})

/**
 *  =
 * @param {*} options
 * @returns
 */
interface RequestOptions extends AxiosRequestConfig {
  mock?: boolean
}

function request(options: RequestOptions): AxiosPromise {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() == 'get') {
    options.params = options.data
  }

  let isMock = config.mock
  if (typeof options.mock != 'undefined') {
    isMock = options.mock
  }

  // 根据当前环境切换请求地址
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }
  return service(options)
}

interface requestMap {
  [key: string]: (url: string, data: any, options: any) => {}
}

const requestMap: requestMap = {};

;['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  requestMap[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options
    })
  }
})

export default request
