// 添加销售属性
export function addOption(id, data) {
  return axios({
    url: `/categories/${id}/options`,
    method: 'post',
    data
  })
}

// 更新销售属性
export function updateOption(id, optionId, data) {
  return axios({
    url: `/categories/${id}/options/${optionId}`,
    method: 'put',
    data
  })
}

// 删除销售属性
export function deleteOption(id, optionId) {
  return axios({
    url: `/categories/${id}/options/${optionId}`,
    method: 'delete'
  })
}

export function getResources(query) {
  return axios({
    url: '/categories',
    method: 'get',
    params: query
  })
}

export function getResource(id, query = null) {
  return axios({
    url: `/categories/${id}`,
    method: 'get',
    params: query
  })
}

export function createResource(data) {
  return axios({
    url: '/categories',
    method: 'post',
    data
  })
}

export function updateResource(id, data) {
  return axios({
    url: `/categories/${id}`,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return axios({
    url: `/categories/${id}`,
    method: 'delete'
  })
}

export function forceDeleteResource(id) {
  return axios({
    url: `/categories/${id}/force`,
    method: 'delete'
  })
}

export function restoreResource(id) {
  return axios({
    url: `/categories/${id}/restore`,
    method: 'put'
  })
}
