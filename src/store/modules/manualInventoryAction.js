const state = {
  shopId: ''
}

const getters = {
  shopId: state => state.shopId
}

const mutations = {
  SET_SHOP_ID: (state, shopId) => {
    state.shopId = shopId
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
