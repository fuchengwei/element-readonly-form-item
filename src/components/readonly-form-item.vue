<template>
  <el-form-item v-bind="formItemProps">
    <template v-for="(_, name) in $slots" #[name]>
      <slot v-if="name === 'default' && !isReadonly" :name="name" />
      <span v-else :key="name">{{ contentValue }}</span>
    </template>
  </el-form-item>
</template>

<script setup>
import { inject, ref, computed, watch, getCurrentInstance, useSlots, useAttrs, onUpdated } from 'vue'

defineOptions({
  name: 'ReadonlyFormItem'
})

const instance = getCurrentInstance()
const elForm = inject('elForm')
const slots = useSlots()
const attrs = useAttrs()
const props = defineProps({
  value: {
    type: String
  },
  readonly: {
    type: Boolean
  },
  emptyText: {
    type: String
  }
})

const isReadonly = computed(() => props.readonly || elForm.$attrs.readonly)
const formItemProps = computed(() => ({ ...attrs, prop: isReadonly.value ? attrs.prop : '' }))
const componentVNode = computed(() => slots.default()?.[0])
const componentType = computed(() => componentVNode.value?.tag.split('-').at(-1))
const keyPaths = computed(() => {
  let { expression } = componentVNode.value?.data?.model?.expression
  const index = expression?.lastIndexOf('.')

  if (expression && index !== -1) {
    expression = expression.substr(index + 1)
  }
  return (expression || attrs.prop)?.split('.')
})

const elFormModel = ref(elForm.model)
const contentValue = ref('')

const getValue = () => {
  const value = keyPaths.value?.reduce((pre, cur) => pre[cur], elFormModel.value)

  if (typeof value === 'number') {
    return value
  }

  return value || props.emptyText || (instance.proxy.$ReadonlyFormItem || {}).emptyText || '-'
}

const getContentValue = () => {
  if (props.value) {
    return props.value
  }

  const value = getValue()

  switch (componentType.value) {
    case 'ElSelect':
      return componentVNode.value.componentOptions.children.map((vNode) => vNode.componentOptions.propsData).find((item) => item.value === value)?.label || value
    default:
      return value
  }
}

const updateContentValue = () => (contentValue.value = getContentValue())

onUpdated(() => updateContentValue())

watch(
  () => elForm.model,
  (val) => {
    elFormModel.value = val
    updateContentValue()
  },
  { deep: true, immediate: true }
)
</script>
