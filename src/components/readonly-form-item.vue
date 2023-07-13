<template>
  <el-form-item v-bind="formItemProps">
    <template v-for="(_, name) in otherSlots" #[name]>
      <slot :name="name" />
    </template>
    <span v-if="isReadonly" :style="contentStyle">{{ contentValue }}</span>
    <slot v-else />
  </el-form-item>
</template>

<script>
import { isTwoDimensionalArray, getFormComponentVNode, formatAsFormatAndType, DEFAULT_FORMATS } from '../utils'

export default {
  name: 'ReadonlyFormItem',
  inject: ['elForm'],
  props: {
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
  },
  data() {
    return {
      oldComponentChildren: this.componentVNode().componentOptions.children,
      elFormModel: this.elForm.model,
      contentValue: ''
    }
  },
  computed: {
    otherSlots() {
      const { default: _, ...rest } = this.$slots
      return rest
    },
    isReadonly() {
      return 'readonly' in this.$options.propsData ? this.readonly : this.elForm.$attrs.readonly
    },
    isTable() {
      return ['ElTableRow', 'ElTableBody'].includes(this.$parent.$vnode.tag.split('-').at(-1))
    },
    formItemProps() {
      return {
        ...this.$attrs,
        labelWidth: this.$attrs.label ? this.$attrs.labelWidth || this.elForm.$options.propsData.labelWidth : 'auto',
        style: {
          ...this.$attrs.style,
          marginBottom: this.isTable && '0'
        }
      }
    },
    getGlobalConfig() {
      return this.$ReadonlyFormItem || {}
    },
    contentStyle() {
      return this.isTable
        ? {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block',
            width: '100%'
          }
        : {
            wordBreak: 'break-all'
          }
    }
  },
  methods: {
    componentVNode() {
      return getFormComponentVNode(this.$slots.default)
    },
    componentType(vNode) {
      return vNode?.tag.split('-').at(-1)
    },
    dateComponentType(vNode) {
      return vNode?.componentOptions?.propsData?.type ?? 'date'
    },
    getOptions(vNode) {
      return vNode?.componentOptions?.children?.map((_vNode) => ({
        label: _vNode.componentOptions?.children?.[0].text,
        value: _vNode.componentOptions?.propsData?.label
      }))
    },
    getEmptyText() {
      return this.emptyText || this.getGlobalConfig.emptyText || '-'
    },
    getSeparator() {
      return this.separator || this.getGlobalConfig.separator || ','
    },
    getRangeSeparator() {
      return this.rangeSeparator || this.getGlobalConfig.rangeSeparator || '~'
    },
    getDateFormat() {
      const vNode = this.componentVNode()

      const FORMAT_MAP = {
        ElTimePicker: 'HH:mm:ss',
        ElDatePicker: DEFAULT_FORMATS[this.dateComponentType(vNode)]
      }

      return this.dateFormat || this.getGlobalConfig.dateFormat || vNode?.componentOptions?.propsData?.format || FORMAT_MAP[this.componentType(vNode)]
    },
    getValue() {
      return this.$attrs.prop?.split('.')?.reduce((pre, cur) => pre[cur], this.elFormModel)
    },
    getContentValue() {
      if (this.value) {
        return this.value
      }

      const value = this.getValue()

      const vNode = this.componentVNode()

      switch (this.componentType(vNode)) {
        case 'ElSelect': {
          const options = vNode?.componentOptions.children?.map((_vNode) => _vNode.componentOptions.propsData)

          return Array.isArray(value)
            ? options
                ?.filter((item) => value.includes(item.value))
                ?.map((item) => item.label)
                ?.join(this.getSeparator())
            : options?.find((item) => item.value === value)?.label
        }
        case 'ElRadioGroup':
          return this.getOptions(vNode)?.find((item) => item.value === value)?.label
        case 'ElCheckboxGroup': {
          return this.getOptions(vNode)
            ?.filter((item) => value.includes(item.value))
            ?.map((item) => item.label)
            ?.join(this.getSeparator())
        }
        case 'ElCascader': {
          const {
            options,
            separator = '/',
            props: { label: labelKey = 'label', value: valueKey = 'value', children: childrenKey = 'children' } = {}
          } = vNode?.componentOptions?.propsData

          const reduceCallback = (pre, cur) => {
            pre.push(cur)

            cur[childrenKey] && cur[childrenKey].length && cur[childrenKey].reduce(reduceCallback, pre)

            return pre
          }

          const findLabel = (val) => options?.reduce(reduceCallback, []).find((option) => option[valueKey] === val)?.[labelKey]

          return isTwoDimensionalArray(value) ? value.map((val) => val.map(findLabel)?.join(separator))?.join(this.getSeparator()) : value.map(findLabel).join(separator)
        }
        case 'ElTransfer': {
          const { data, props: { key = 'key', label = 'label' } = {} } = vNode.componentOptions?.propsData
          return value.map((val) => data.find((item) => item[key] === val)?.[label])?.join(this.getSeparator())
        }
        case 'ElTimePicker':
          return Array.isArray(value) && value.length ? value.map((date) => formatAsFormatAndType(date, this.getDateFormat(), 'time')).join(this.getRangeSeparator()) : value
        case 'ElDatePicker': {
          const dateComponentType = this.dateComponentType(vNode)
          const _value = formatAsFormatAndType(value, this.getDateFormat(), dateComponentType)
          const _separator = ['monthrange', 'daterange', 'datetimerange'].includes(dateComponentType) ? this.getRangeSeparator() : this.getSeparator()
          return Array.isArray(_value) ? _value.join(_separator) : _value
        }
        case 'ElSwitch': {
          const { activeText = '开', inactiveText = '关' } = vNode.componentOptions.propsData
          return value ? activeText : inactiveText
        }
        case 'ElSlider':
          return Array.isArray(value) ? value.join(this.getRangeSeparator()) : value
        default:
          return value
      }
    },
    updateContentValue() {
      const value = this.getContentValue()
      this.contentValue = typeof value === 'number' ? value : value || this.getEmptyText()
    }
  },
  watch: {
    'elForm.model': {
      handler(val) {
        this.elFormModel = val
        this.updateContentValue()
      },
      deep: true,
      immediate: true
    },
    isReadonly: {
      handler(val) {
        this.$nextTick(() => {
          const elFormItemInstance = this.$refs.elFormItemRef
          elFormItemInstance.dispatch('ElForm', val ? 'el.form.removeField' : 'el.form.addField', [elFormItemInstance])
        })
      },
      immediate: true
    }
  },
  updated() {
    const newComponentChildren = this.componentVNode().componentOptions.children
    if (this.oldComponentChildren !== newComponentChildren) {
      this.updateContentValue()
      this.oldComponentChildren = newComponentChildren
    }
  }
}
</script>
