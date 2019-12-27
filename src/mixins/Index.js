import Lenses from '@/mixins/Lenses'
import Links from '@/mixins/Links'
export default {
  name: 'resource-index-page',
  mixins: [Lenses, Links],
  components: {
    'index-resource-table': () =>
      import('@/components/Index/ResourceIndexTable'),
    'filter-box-item': () => import('@/components/FilterBoxItem')
  },
  computed: {
    title() {
      return _.get(this.$route, 'meta.Title', this.$route.name)
    }
  }
}
