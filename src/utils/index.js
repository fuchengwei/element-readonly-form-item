const CAPTURED_TYPE = [
  'ElInput',
  'ElInputNumber',
  'ElRadioGroup',
  'ElCheckboxGroup',
  'ElSelect',
  'ElCascader',
  'ElSwitch',
  'ElSlider',
  'ElTimeSelect',
  'ElTimePicker',
  'ElDatePicker',
  'ElRate',
  'ElColorPicker',
  'ElTransfer'
]

export const isTwoDimensionalArray = (arr) => Array.isArray(arr) && arr.every((item) => Array.isArray(item))

export const getFormComponentVNode = (list) => {
  if (!list) {
    return
  }

  let vNode
  for (let index = 0; index < list.length; index++) {
    vNode = list[index]
    if (CAPTURED_TYPE.includes(vNode.tag?.split('-')?.at(-1))) {
      return vNode
    }
    vNode = getFormComponentVNode(vNode.children)
    if (vNode) {
      return vNode
    }
  }
  return vNode
}

export * from './date-util'
