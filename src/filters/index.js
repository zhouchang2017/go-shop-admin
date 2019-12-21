import Vue from 'vue'
import dayjs from 'dayjs'

const Filters = [
  {
    name: 'timeStr',
    handler: time => {
      if (!time) return '-'
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
]

Filters.forEach(({ name, handler }) => {
  Vue.filter(name, handler)
})
