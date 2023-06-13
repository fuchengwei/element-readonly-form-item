<template>
  <el-form-item v-bind="formItemProps">
    <template v-for="(_, name) in otherSlots" #[name]>
      <slot :name="name" />
    </template>
    <span v-if="isReadonly">{{ contentValue }}</span>
    <slot v-else />
  </el-form-item>
</template>

<script setup>
import { inject, ref, computed, watch, getCurrentInstance, useSlots, useAttrs, onUpdated } from 'vue'
import { isTwoDimensionalArray } from '@/utils'

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
  },
  separator: {
    type: String
  }
})

const otherSlots = computed(() => {
  const _otherSlots = {}
  Object.keys(slots).forEach((key) => key !== 'default' && (_otherSlots[key] = slots[key]))
  return _otherSlots
})
const isReadonly = computed(() => props.readonly || elForm.$attrs.readonly)
const formItemProps = computed(() => ({ ...attrs, prop: isReadonly.value ? attrs.prop : '' }))
const componentVNode = computed(() => slots.default()?.[0])
const componentType = computed(() => componentVNode.value?.tag.split('-').at(-1))
const keyPaths = computed(() => {
  let { expression } = componentVNode.value?.data?.model
  const index = expression?.lastIndexOf('.')

  if (expression && index !== -1) {
    expression = expression.substr(index + 1)
  }
  return (expression || attrs.prop)?.split('.')
})

const elFormModel = ref(elForm.model)
const contentValue = ref('')

const getOptions = () =>
  componentVNode.value.componentOptions?.children?.map((vNode) => ({
    label: vNode.componentOptions?.children?.[0].text,
    value: vNode.componentOptions?.propsData?.label
  }))

const getEmptyText = () => props.emptyText || (instance.proxy.$ReadonlyFormItem || {}).emptyText || '-'

const getSeparator = () => props.separator || (instance.proxy.$ReadonlyFormItem || {}).separator || ','

const getValue = () => {
  const value = keyPaths.value?.reduce((pre, cur) => pre[cur], elFormModel.value)

  if (typeof value === 'number') {
    return value
  }

  return value
}

const getContentValue = () => {
  if (props.value) {
    return props.value
  }

  const value = getValue()

  switch (componentType.value) {
    case 'ElSelect': {
      const options = componentVNode.value.componentOptions.children?.map((vNode) => vNode.componentOptions.propsData)

      return Array.isArray(value)
        ? options
            ?.filter((item) => value.includes(item.value))
            ?.map((item) => item.label)
            ?.join(',')
        : options?.find((item) => item.value === value)?.label
    }
    case 'ElRadioGroup':
      return getOptions()?.find((item) => item.value === value)?.label
    case 'ElCheckboxGroup': {
      return getOptions()
        ?.filter((item) => value.includes(item.value))
        ?.map((item) => item.label)
        ?.join(',')
    }
    case 'ElCascader': {
      const {
        options,
        separator = '/',
        props: { label: labelKey = 'label', value: valueKey = 'value', children: childrenKey = 'children' } = {}
      } = componentVNode.value.componentOptions?.propsData

      const reduceCallback = (pre, cur) => {
        pre.push(cur)

        cur[childrenKey] && cur[childrenKey].length && cur[childrenKey].reduce(reduceCallback, pre)

        return pre
      }

      const findLabel = (val) => options?.reduce(reduceCallback, []).find((option) => option[valueKey] === val)?.[labelKey]

      return isTwoDimensionalArray(value) ? value.map((val) => val.map(findLabel)?.join(separator))?.join(getSeparator()) : value.map(findLabel).join(getSeparator())
    }
    default:
      return value
  }
}

const updateContentValue = () => (contentValue.value = getContentValue() || getEmptyText())

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
