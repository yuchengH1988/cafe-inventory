import { apiHelper } from './../utils/helpers'

export default {
  getCurrentUser() {
    return apiHelper.get(`/users/current`)
  },
  updateUser({ formData }) {
    return apiHelper.put('/users', formData)
  }
}