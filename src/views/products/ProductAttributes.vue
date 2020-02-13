<template>
  <el-form-item label="属性列表" prop="attributes">
    <div
      class="inline-flex items-center md:border-b-0 border-b"
      v-for="(attr, index) in value"
      :key="index"
    >
      <div class="md:flex justify-center">
        <el-input size="mini" v-model.trim="attr.name" class="md:mr-3">
          <div slot="prepend">属性名称</div>
        </el-input>
        <el-input size="mini" v-model.trim="attr.value">
          <div slot="prepend">属性值</div>
        </el-input>
      </div>

      <span
        @click="remove(index)"
        class="ml-3 block appearance-none cursor-pointer text-gray-500 hover:text-gray-700"
        ><icons-icon viewBox="0 0 20 20" class="h-4 w-4" type="icons-delete"
      /></span>
    </div>

    <el-button class="flex mt-3" size="mini" @click="add"
      >添加自定义属性</el-button
    >
  </el-form-item>
</template>

<script>
export default {
  name: 'ProductAttributes',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  methods: {
    add() {
      const last = _.last(this.value)
      if (last) {
        if (last.name == '' && last.value == '') {
          this.$message.error('最后一条自定义属性尚未填写完成')
          return
        }
      }
      this.value.push({ name: '', value: '' })
    },
    remove(index) {
      this.value.splice(index, 1)
    }
  },
  computed: {
    attributes: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
