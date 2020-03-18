import dayjs from 'dayjs'
require('dayjs/locale/zh-cn')
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(utc)
dayjs.extend(relativeTime)

export function now() {
  return dayjs.utc().format()
}
