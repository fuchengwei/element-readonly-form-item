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
import { isTwoDimensionalArray, getFormComponentVNode, formatAsFormatAndType, DEFAULT_FORMATS } from '@/utils'

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
  },
  rangeSeparator: {
    type: String
  },
  dateFormat: {
    type: String
  }
})

const componentVNode = () => getFormComponentVNode(slots.default())
const componentType = () => componentVNode()?.tag.split('-').at(-1)
const dateComponentType = () => componentVNode()?.componentOptions?.propsData?.type ?? 'date'

const otherSlots = computed(() => {
  const { default: _, ...rest } = slots
  return rest
})
const isReadonly = computed(() => props.readonly || elForm.$attrs.readonly)
const formItemProps = computed(() => ({
  ...attrs,
  prop: isReadonly.value ? attrs.prop : '',
  labelWidth: attrs.label ? attrs.labelWidth || elForm.$options.propsData.labelWidth : 'auto',
  style: {
    ...attrs.style,
    marginBottom: instance.proxy.$parent.$vnode.tag.split('-').at(-1) === 'ElTableRow' && '0'
  }
}))
const getGlobalConfig = computed(() => instance.proxy.$ReadonlyFormItem || {})

const elFormModel = ref(elForm.model)
const contentValue = ref('')

const FORMAT_MAP = {
  ElTimePicker: 'HH:mm:ss',
  ElDatePicker: DEFAULT_FORMATS[dateComponentType()]
}

const getOptions = () =>
  componentVNode()?.componentOptions?.children?.map((vNode) => ({
    label: vNode.componentOptions?.children?.[0].text,
    value: vNode.componentOptions?.propsData?.label
  }))

const getEmptyText = () => props.emptyText || getGlobalConfig.value.emptyText || '-'

const getSeparator = () => props.separator || getGlobalConfig.value.separator || ','

const getRangeSeparator = () => props.rangeSeparator || getGlobalConfig.value.rangeSeparator || '~'

const getDateFormat = () => props.dateFormat || getGlobalConfig.value.dateFormat || componentVNode()?.componentOptions?.propsData?.format || FORMAT_MAP[componentType()]

const getValue = () => attrs.prop?.split('.')?.reduce((pre, cur) => pre[cur], elFormModel.value)

const getContentValue = () => {
  if (props.value) {
    return props.value
  }

  const value = getValue()

  switch (componentType()) {
    case 'ElSelect': {
      const options = componentVNode()?.componentOptions.children?.map((vNode) => vNode.componentOptions.propsData)

      return Array.isArray(value)
        ? options
            ?.filter((item) => value.includes(item.value))
            ?.map((item) => item.label)
            ?.join(getSeparator())
        : options?.find((item) => item.value === value)?.label
    }
    case 'ElRadioGroup':
      return getOptions()?.find((item) => item.value === value)?.label
    case 'ElCheckboxGroup': {
      return getOptions()
        ?.filter((item) => value.includes(item.value))
        ?.map((item) => item.label)
        ?.join(getSeparator())
    }
    case 'ElCascader': {
      const {
        options,
        separator = '/',
        props: { label: labelKey = 'label', value: valueKey = 'value', children: childrenKey = 'children' } = {}
      } = componentVNode()?.componentOptions?.propsData

      const reduceCallback = (pre, cur) => {
        pre.push(cur)

        cur[childrenKey] && cur[childrenKey].length && cur[childrenKey].reduce(reduceCallback, pre)

        return pre
      }

      const findLabel = (val) => options?.reduce(reduceCallback, []).find((option) => option[valueKey] === val)?.[labelKey]

      return isTwoDimensionalArray(value) ? value.map((val) => val.map(findLabel)?.join(separator))?.join(getSeparator()) : value.map(findLabel).join(getSeparator())
    }
    case 'ElTransfer': {
      const { data, props: { key = 'key', label = 'label' } = {} } = componentVNode().componentOptions?.propsData
      return value.map((val) => data.find((item) => item[key] === val)?.[label])?.join(getSeparator())
    }
    case 'ElTimePicker':
      return Array.isArray(value) && value.length ? value.map((date) => formatAsFormatAndType(date, getDateFormat(), 'time')).join(getRangeSeparator()) : value
    case 'ElDatePicker': {
      const _value = formatAsFormatAndType(value, getDateFormat(), dateComponentType())
      const _separator = ['monthrange', 'daterange', 'datetimerange'].includes(dateComponentType()) ? getRangeSeparator() : getSeparator()
      return Array.isArray(_value) ? _value.join(_separator) : _value
    }
    case 'ElSwitch': {
      const { activeText = '开', inactiveText = '关' } = componentVNode().componentOptions.propsData
      return value ? activeText : inactiveText
    }
    case 'ElSlider':
      return Array.isArray(value) ? value.join(getRangeSeparator()) : value
    default:
      return value
  }
}

const updateContentValue = () => {
  const value = getContentValue()
  contentValue.value = typeof value === 'number' ? value : value || getEmptyText()
}

let oldComponentChildren = componentVNode().componentOptions.children

onUpdated(() => {
  const newComponentChildren = componentVNode().componentOptions.children
  if (oldComponentChildren !== newComponentChildren) {
    updateContentValue()
    oldComponentChildren = newComponentChildren
  }
})

watch(
  () => elForm.model,
  (val) => {
    elFormModel.value = val
    updateContentValue()
  },
  { deep: true, immediate: true }
)
</script>
