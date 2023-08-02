import axios from 'axios'
import Swal from 'sweetalert2'

const baseURL = 'http://localhost:3000/api'
// const baseURL = 'https://work-cafe-inventory.yuchengworkpresentation.net/api'

const axiosInstance = axios.create({
  baseURL,
  timeout: 1000
})
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error);
  })

export const apiHelper = axiosInstance
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})
