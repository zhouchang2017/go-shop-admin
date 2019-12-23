export default {
  data() {
    return {
      status: [
        { name: '等待确认', type: 'warning', value: 0 },
        { name: '锁定', type: 'cancel', value: 1 },
        { name: '良品', type: 'success', value: 2 },
        { name: '不良品', type: 'error', value: 3 }
      ]
    }
  }
}
