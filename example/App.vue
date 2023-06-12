<template>
  <div>
    <div style="text-align: right">
      <el-button @click="readonly = !readonly">{{ readonly ? '编辑' : '取消' }}</el-button>
    </div>
    <el-form :model="model" :readonly="readonly" label-width="100px" label-suffix=":">
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
        <el-col :span="8"></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"></el-col>
        <el-col :span="8"></el-col>
        <el-col :span="8"></el-col>
      </el-row>
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
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})
</script>
