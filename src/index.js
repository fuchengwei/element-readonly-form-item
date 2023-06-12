import ReadonlyFormItem from '@/components/readonly-form-item.vue'

const install = (Vue, options = {}) => {
  Vue.prototype.$ReadonlyFormItem = options
  Vue.component(ReadonlyFormItem.name, ReadonlyFormItem)
}

ReadonlyFormItem.install = (Vue) => {
  Vue.component(ReadonlyFormItem.name, ReadonlyFormItem)
}

export default {
  install,
  ReadonlyFormItem
}
