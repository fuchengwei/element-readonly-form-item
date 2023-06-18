# element-readonly-form-item

基于 ElementUI 的表单只读态控件，完美适配所有表单组件。主要用于新建页与详情页动态切换。支持 npm 与 cdn 方式的引入。

## GitHub

https://github.com/fuchengwei/element-readonly-form-item

## Npm

https://www.npmjs.com/package/element-readonly-form-item

## 安装

### 使用 npm 或 pnpm 安装

**我们推荐使用 npm 或 pnpm 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

```shell
$ npm install element-readonly-form-item --save
```

```shell
$ pnpm add element-readonly-form-item --save
```

### 浏览器引入

在浏览器中使用 `script` 标签直接引入文件，并使用全局变量 `ElementReadonlyFormItem`。

我们在 npm 发布包内的 `element-readonly-form-item/dist`提供了 `element-readonly-form-item.es.js` `element-readonly-form-item.umd.js`。你也可以通过 [![jsdelivr](https://data.jsdelivr.com/v1/package/npm/element-readonly-form-item/badge)](https://www.jsdelivr.com/package/npm/element-readonly-form-item) 或 [UNPKG](https://unpkg.com/element-readonly-form-item/dist/) 进行下载。

```javascript
<script src="https://unpkg.com/element-readonly-form-item/dist/element-readonly-form-item.umd.js"></script>
```

### 注意

1. 无论 npm 或者 cdn 引入都需要自行引入 [ElementUI](https://element.eleme.cn/)。
2. 为 el-form 组件扩展了 readonly 属性，可同时控制 el-form 组件内所有表单的 readonly 属性。
3. el-form-item 与 element-readonly-form-item 可同时使用，并不会互相影响。element-readonly-form-item 只是对 el-form-item 进一步抽屉与封装，支持所有 el-form-item 的属性与插槽配置。

### 示例

**npm 引入**

```javascript
import Vue from 'vue'
import ElementUI from 'element-ui'
import ElementReadonlyFormItem from 'element-readonly-form-item'
import App from './App.vue'

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(ElementReadonlyFormItem, { emptyText: '-' })

new Vue(App).$mount('#app')
```

## 快速上手

组件覆写了 el-form-item 对于 el-form-item 原有的属性、插槽都是支持的。使用时注意

### 示例

```vue
<template>
  <el-form :model="model" :readonly="readonly" label-width="100px" label-suffix=":">
    <readonly-form-item label="输入框" prop="input">
      <el-input v-model="model.input" placeholder="请输入" />
    </readonly-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const readonly = ref(false)

const model = reactive({
  input: ''
})
</script>
```

### Props

|      参数      |        说明        |  类型   | 是否必填 | 默认值 |
| :------------: | :----------------: | :-----: | :------: | :----: |
|     value      |  只读状态下显示值  | string  |    否    |   ''   |
|    readonly    |      是否只读      | boolean |    否    | false  |
|   emptyText    | 值为空时显示的内容 | string  |    否    |  '-'   |
|   separator    | 值为数组时的分隔符 | string  |    否    |  ','   |
| rangeSeparator |   时间范围分隔符   | string  |    否    |  '~'   |
|   dateFormat   |   日期类型格式化   | string  |    否    |   ''   |

### 全局配置

在引入 ElementReadonlyFormItem 时，可以传入一个全局配置对象。该对象目前支持 emptyText、separator、rangeSeparator、dateFormat 属性。emptyText 用于改变组件的默认空文本内容，separator 设置值为数组时的分隔符，separator（默认值：','），rangeSeparator 设置时间范围分隔符，rangeSeparator（默认值：'~'），dateFormat 设置日期类控件格式化。按照引入 ElementReadonlyFormItem 的方式，具体操作如下：

```javascript
import Vue from 'vue'
import ElementReadonlyFormItem from 'element-form-item'
Vue.use(ElementReadonlyFormItem, { emptyText: '-', separator: ',' })
```
