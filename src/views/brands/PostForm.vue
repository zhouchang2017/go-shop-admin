<template>
  <el-form :ref="formName" :model="resource" :rules="rules">
    <div class="card overflow-hidden mb-6">
      <div class="w-full p-6">
        <el-form-item v-if="updating" label="ID" prop="id">
          <el-input v-model="resource.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="resource.name"></el-input>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import ResourceForm from '@/mixins/ResourceForm'
export default {
  name: 'post-form',
  mixins: [ResourceForm],
  data() {
    return {
      resource: {
        name: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入品牌名称',
            trigger: 'blur'
          }
        ]
      }
    }
  }
}
</script>

<style></style>
