<template>
  <div>
    <div style="text-align: right">
      <el-button @click="readonly = !readonly">{{ readonly ? '编辑' : '取消' }}</el-button>
    </div>
    <el-form :model="model" :readonly="readonly" label-width="130px" label-suffix=":">
      <el-row>
        <el-col :span="8">
          <readonly-form-item label="输入框" prop="input">
            <el-input v-model="model.input" placeholder="请输入" />
          </readonly-form-item>
        </el-col>
        <el-col :span="8">
          <readonly-form-item label="下拉框" prop="select">
            <el-select v-model="model.select" placeholder="请选择">
              <el-option label="选项一" value="选项值一" />
              <el-option label="选项二" value="选项值二" />
            </el-select>
          </readonly-form-item>
        </el-col>
        <el-col :span="8">
          <readonly-form-item label="下拉框(多选)" prop="selectMultiple">
            <el-select v-model="model.selectMultiple" multiple placeholder="请选择">
              <el-option label="选项一" value="选项值一" />
              <el-option label="选项二" value="选项值二" />
              <el-option label="选项三" value="选项值三" />
            </el-select>
          </readonly-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <readonly-form-item label="单选框" prop="radio">
            <el-radio-group v-model="model.radio">
              <el-radio label="选项值一">单选一</el-radio>
              <el-radio label="选项值二">单选二</el-radio>
              <el-radio label="选项值三">单选三</el-radio>
            </el-radio-group>
          </readonly-form-item>
        </el-col>
        <el-col :span="8">
          <readonly-form-item label="多选框" prop="checkbox">
            <el-checkbox-group v-model="model.checkbox">
              <el-checkbox label="多选框值 A">多选框 A</el-checkbox>
              <el-checkbox label="多选框值 B">多选框 B</el-checkbox>
              <el-checkbox label="多选框值 C">多选框 C</el-checkbox>
            </el-checkbox-group>
          </readonly-form-item>
        </el-col>
        <el-col :span="8">
          <readonly-form-item label="级联选择" prop="cascader">
            <el-cascader v-model="model.cascader" :options="cascaderOptions" />
          </readonly-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <readonly-form-item label="级联选择(多选)" prop="cascaderMultiple">
            <el-cascader v-model="model.cascaderMultiple" :options="cascaderOptions" :props="{ multiple: true, emitPath: true, checkStrictly: true }" />
          </readonly-form-item>
        </el-col>
        <el-col :span="8">
          <readonly-form-item label="时间选择器" prop="timePicker">
            <el-time-select v-model="model.timePicker" placeholder="选择时间" />
          </readonly-form-item>
        </el-col>
        <el-col :span="8">
          <readonly-form-item label="时间选择器(范围)" prop="timePickerRange">
            <el-time-picker v-model="model.timePickerRange" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
          </readonly-form-item>
        </el-col>
      </el-row>

      <el-table :data="model.tableData" border>
        <el-table-column label="输入框">
          <template slot-scope="scope">
            <readonly-form-item :prop="`tableData.${scope.$index}.input`">
              <el-input v-model.trim="scope.row.input" placeholder="请输入" />
            </readonly-form-item>
          </template>
        </el-table-column>
        <el-table-column label="下拉框">
          <template slot-scope="scope">
            <readonly-form-item :prop="`tableData.${scope.$index}.select`">
              <el-select v-model="scope.row.select" placeholder="请选择">
                <el-option label="选项一" value="选项值一" />
                <el-option label="选项二" value="选项值二" />
              </el-select>
            </readonly-form-item>
          </template>
        </el-table-column>
        <el-table-column label="下拉框(多选)">
          <template slot-scope="scope">
            <readonly-form-item :prop="`tableData.${scope.$index}.selectMultiple`">
              <el-select v-model="scope.row.selectMultiple" multiple placeholder="请选择">
                <el-option label="选项一" value="选项值一" />
                <el-option label="选项二" value="选项值二" />
                <el-option label="选项三" value="选项值三" />
              </el-select>
            </readonly-form-item>
          </template>
        </el-table-column>
        <el-table-column label="单选框">
          <template slot-scope="scope">
            <readonly-form-item :prop="`tableData.${scope.$index}.radio`">
              <el-radio-group v-model="scope.row.radio">
                <el-radio label="选项值一">单选一</el-radio>
                <el-radio label="选项值二">单选二</el-radio>
                <el-radio label="选项值三">单选三</el-radio>
              </el-radio-group>
            </readonly-form-item>
          </template>
        </el-table-column>
        <el-table-column label="多选框">
          <template slot-scope="scope">
            <readonly-form-item :prop="`tableData.${scope.$index}.checkbox`">
              <el-checkbox-group v-model="scope.row.checkbox">
                <el-checkbox label="多选框值 A">多选框 A</el-checkbox>
                <el-checkbox label="多选框值 B">多选框 B</el-checkbox>
                <el-checkbox label="多选框值 C">多选框 C</el-checkbox>
              </el-checkbox-group>
            </readonly-form-item>
          </template>
        </el-table-column>
        <el-table-column label="级联选择">
          <template slot-scope="scope">
            <readonly-form-item :prop="`tableData.${scope.$index}.cascader`">
              <el-cascader v-model="scope.row.cascader" :options="cascaderOptions" />
            </readonly-form-item>
          </template>
        </el-table-column>
        <el-table-column label="级联选择(多选)">
          <template slot-scope="scope">
            <readonly-form-item :prop="`tableData.${scope.$index}.cascaderMultiple`">
              <el-cascader v-model="scope.row.cascaderMultiple" :options="cascaderOptions" :props="{ multiple: true, emitPath: true, checkStrictly: true }" />
            </readonly-form-item>
          </template>
        </el-table-column>
        <el-table-column label="时间选择器">
          <template slot-scope="scope">
            <readonly-form-item :prop="`tableData.${scope.$index}.timePicker`">
              <el-time-select v-model="scope.row.timePicker" placeholder="选择时间" />
            </readonly-form-item>
          </template>
        </el-table-column>
        <el-table-column label="时间选择器(范围)">
          <template slot-scope="scope">
            <readonly-form-item :prop="`tableData.${scope.$index}.timePickerRange`">
              <el-time-picker
                v-model="scope.row.timePickerRange"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              />
            </readonly-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

defineOptions({
  name: 'App'
})

const readonly = ref(true)

const model = reactive({
  input: '',
  select: '',
  selectMultiple: [],
  radio: '',
  checkbox: [],
  cascader: [],
  cascaderMultiple: [],
  timePicker: '',
  timePickerRange: null,
  tableData: [
    {
      input: '',
      select: '',
      selectMultiple: [],
      radio: '',
      checkbox: [],
      cascader: [],
      cascaderMultiple: [],
      timePicker: '',
      timePickerRange: null
    },
    {
      input: '',
      select: '',
      selectMultiple: [],
      radio: '',
      checkbox: [],
      cascader: [],
      cascaderMultiple: [],
      timePicker: '',
      timePickerRange: null
    }
  ]
})

const cascaderOptions = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'shejiyuanze',
        label: '设计原则',
        children: [
          {
            value: 'yizhi',
            label: '一致'
          },
          {
            value: 'fankui',
            label: '反馈'
          },
          {
            value: 'xiaolv',
            label: '效率'
          },
          {
            value: 'kekong',
            label: '可控'
          }
        ]
      },
      {
        value: 'daohang',
        label: '导航',
        children: [
          {
            value: 'cexiangdaohang',
            label: '侧向导航'
          },
          {
            value: 'dingbudaohang',
            label: '顶部导航'
          }
        ]
      }
    ]
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout 布局'
          },
          {
            value: 'color',
            label: 'Color 色彩'
          },
          {
            value: 'typography',
            label: 'Typography 字体'
          },
          {
            value: 'icon',
            label: 'Icon 图标'
          },
          {
            value: 'button',
            label: 'Button 按钮'
          }
        ]
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio 单选框'
          },
          {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          },
          {
            value: 'input',
            label: 'Input 输入框'
          },
          {
            value: 'input-number',
            label: 'InputNumber 计数器'
          },
          {
            value: 'select',
            label: 'Select 选择器'
          },
          {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          },
          {
            value: 'switch',
            label: 'Switch 开关'
          },
          {
            value: 'slider',
            label: 'Slider 滑块'
          },
          {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          },
          {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          },
          {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          },
          {
            value: 'upload',
            label: 'Upload 上传'
          },
          {
            value: 'rate',
            label: 'Rate 评分'
          },
          {
            value: 'form',
            label: 'Form 表单'
          }
        ]
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          {
            value: 'table',
            label: 'Table 表格'
          },
          {
            value: 'tag',
            label: 'Tag 标签'
          },
          {
            value: 'progress',
            label: 'Progress 进度条'
          },
          {
            value: 'tree',
            label: 'Tree 树形控件'
          },
          {
            value: 'pagination',
            label: 'Pagination 分页'
          },
          {
            value: 'badge',
            label: 'Badge 标记'
          }
        ]
      },
      {
        value: 'notice',
        label: 'Notice',
        children: [
          {
            value: 'alert',
            label: 'Alert 警告'
          },
          {
            value: 'loading',
            label: 'Loading 加载'
          },
          {
            value: 'message',
            label: 'Message 消息提示'
          },
          {
            value: 'message-box',
            label: 'MessageBox 弹框'
          },
          {
            value: 'notification',
            label: 'Notification 通知'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'NavMenu 导航菜单'
          },
          {
            value: 'tabs',
            label: 'Tabs 标签页'
          },
          {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          },
          {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          },
          {
            value: 'steps',
            label: 'Steps 步骤条'
          }
        ]
      },
      {
        value: 'others',
        label: 'Others',
        children: [
          {
            value: 'dialog',
            label: 'Dialog 对话框'
          },
          {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          },
          {
            value: 'popover',
            label: 'Popover 弹出框'
          },
          {
            value: 'card',
            label: 'Card 卡片'
          },
          {
            value: 'carousel',
            label: 'Carousel 走马灯'
          },
          {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }
        ]
      }
    ]
  },
  {
    value: 'ziyuan',
    label: '资源',
    children: [
      {
        value: 'axure',
        label: 'Axure Components'
      },
      {
        value: 'sketch',
        label: 'Sketch Templates'
      },
      {
        value: 'jiaohu',
        label: '组件交互文档'
      }
    ]
  }
]
</script>
