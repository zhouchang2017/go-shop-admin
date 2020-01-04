<template>
  <el-form :ref="formName" :model="resource" :rules="rules">
    <slot />
  </el-form>
</template>

<script>
export default {
  name: 'form-warp',
  props: {
    pk: {
      type: String,
      default: 'id'
    },
    value: {
      type: Object,
      default: () => {}
    },
    formName: {
      type: String,
      default: 'postForm'
    },
    rules: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      resource: {},
      cloneResource: {}
    }
  },
  methods: {
    // resource transform
    resourceTransform() {
      return this.resource
    },

    // 提交表单
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs[this.formName].validate((valid, err) => {
          valid
            ? resolve(this.resourceTransform())
            : this.notifyErrorMessage(err)
        })
      })
    },

    notifyErrorMessage(error) {
      let errors = _.reduce(
        error,
        (res, item) => {
          res.push(...item.map(err => `<li>${err.message}</li>`))
          return res
        },
        []
      ).join('')

      this.$message.error({
        dangerouslyUseHTMLString: true,
        message: `<ul class="list-disc ml-3">${errors}</ul>`
      })
    },

    // 重置表单
    reset() {
      this.$refs[this.formName].resetFields()
      this.resource = _.cloneDeep(this.cloneResource)
    },

    // 填充数据
    fillResource() {
      this.resource = _.defaults(this.value, this.resource)
    },

    // 表单初始化
    init() {
      this.fillResource()
      this.cloneResource = _.cloneDeep(this.resource)
    }
  },

  computed: {
    creating() {
      return _.isNil(_.get(this, `resource.${this.pk}`))
    },

    updating() {
      return !this.creating
    },

    fields() {
      return this.$refs[this.formName].fields
    }
  },

  mounted() {
    this.init()
  }
}
</script>

<style></style>
