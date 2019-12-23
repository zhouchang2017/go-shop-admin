<template>
  <el-form :ref="formName" :model="resource" :rules="rules">
    <div class="card overflow-hidden mb-6">
      <div class="w-full p-6">
        <el-form-item v-if="updating" label="ID" prop="id">
          <el-input v-model="resource.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="门店" prop="name">
          <el-select v-model="resource.shop" placeholder="请选择入库门店">
            <el-option
              v-for="item in shops"
              value-key="id"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
        shop: ''
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
  },
  computed: {
    shops() {
      return _.get(this, '$user.shops', [])
    }
  }
}
</script>

<style></style>
