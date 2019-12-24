export function getResources(query) {
  return axios({
    url: '/manual_inventory_actions',
    method: 'get',
    params: query
  })
}

export function getResource(id, query = null) {
  return axios({
    url: `/manual_inventory_actions/${id}`,
    method: 'get',
    params: query
  })
}

export function createResource(data) {
  return axios({
    url: '/manual_inventory_actions',
    method: 'post',
    data
  })
}

export function updateResource(id, data) {
  return axios({
    url: `/manual_inventory_actions/${id}`,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return axios({
    url: `/manual_inventory_actions/${id}`,
    method: 'delete'
  })
}

export function forceDeleteResource(id) {
  return axios({
    url: `/manual_inventory_actions/${id}/force`,
    method: 'delete'
  })
}

export function restoreResource(id) {
  return axios({
    url: `/manual_inventory_actions/${id}/restore`,
    method: 'put'
  })
}
