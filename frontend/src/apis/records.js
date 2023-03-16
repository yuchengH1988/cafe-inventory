import { apiHelper } from './../utils/helpers'

export default {
  getProducts() {
    return apiHelper.get('/products')
  },
  getIngredients() {
    return apiHelper.get('/ingredients')
  },
  recordCalculator({ formData }) {
    return apiHelper.post('/calculator', formData)
  },
  createRecord({ actualUsed, estimateUsed, ingredientId, dateId }) {
    return apiHelper.post('/records', { actualUsed, estimateUsed, ingredientId, dateId })
  },
  getRecordsByDate({ dateId }) {
    return apiHelper.get(`/records/${dateId}`)
  },
  deleteRecord({ dateId }) {
    return apiHelper.delete(`/records/${dateId}`)
  },
  getRecords ({ year, month, ingredientId, authorId }) {
    const searchParams = new URLSearchParams({ year, month, ingredientId, authorId })
    return apiHelper.get(`/records?${searchParams.toString()}`)
  },

}