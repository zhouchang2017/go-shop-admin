export default {
  name: 'resource-index-page',
  components: {
    'index-resource-table': () =>
      import('@/components/index/ResourceIndexTable'),
    'filter-box-item': () => import('@/components/FilterBoxItem')
  },
  computed: {
    title() {
      return _.get(this.$route, 'meta.Title', this.$route.name)
    }
  }
}
