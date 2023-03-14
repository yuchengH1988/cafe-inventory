import { apiHelper } from './../utils/helpers'

export default {
  ingredients: {
    update({ id, name, unit, unitName, unit2, unit2Name }) {
      return apiHelper.put(`/admin/ingredients/${id}`, { name, unit, unitName, unit2, unit2Name })
    },
    create({ name, unit, unitName, unit2, unit2Name }) {
      return apiHelper.post(`/admin/ingredients`, { name, unit, unitName, unit2, unit2Name })
    },
    delete({ id }) {
      return apiHelper.delete(`/admin/ingredients/${id}`)
    }
  },
  products: {
    update({ id, name, size, price }) {
      return apiHelper.put(`/admin/products/${id}`, { name, size, price })
    },
    create({ name, size, price }) {
      return apiHelper.post(`/admin/products`, { name, size, price })
    },
    delete({ id }) {
      return apiHelper.delete(`/admin/products/${id}`)
    }
  },
  compositions: {
    get() {
      return apiHelper.get(`/admin/compositions`)
    },
    update({ id, quantity }) {
      return apiHelper.put(`/admin/compositions/${id}`, { quantity })
    },
    create({ quantity, ingredientId, productId }) {
      return apiHelper.post(`/admin/compositions`, { quantity, ingredientId, productId })
    },
    delete({ id }) {
      return apiHelper.delete(`/admin/compositions/${id}`)
    }
  },
  getRecords({ year, month, ingredientId, authorId }) {
    const searchParams = new URLSearchParams({ year, month, ingredientId, authorId })
    return apiHelper.get(`/admin/records?${searchParams.toString()}`)

  },
  users: {
    get() {
      return apiHelper.get(`/admin/users`)
    },
    toggleAdmin({ id }) {
      return apiHelper.put(`/admin/users/${id}`)
    },
    delete({ id }) {
      return apiHelper.delete(`/admin/users/${id}`)
    },
    create({ formData }) {
      return apiHelper.post(`/admin/users`, formData)
    }
  }

}