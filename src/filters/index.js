import Vue from 'vue'
import dayjs from 'dayjs'

const Filters = [
  {
    name: 'timeStr',
    handler: time => {
      if (!time) return '-'
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    name: 'money',
    handler: value => {
      if (!value) return '-'
      return Vue.money({
        amount: value,
        currency: 'CNY',
        precision: 2
      })
        .setLocale('zh-CN')
        .toFormat()
    }
  }
]

Filters.forEach(({ name, handler }) => {
  Vue.filter(name, handler)
})
