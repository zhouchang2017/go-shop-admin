<template>
  <el-dialog
    title="添加自定义属性值"
    :visible.sync="show"
    :before-close="customOptionValueFormBeforeClose"
  >
    <el-form
      ref="customOptionValueForm"
      :rules="customOptionValueFormRules"
      :model="customOptionValueForm"
      class="c-form w-full"
    >
      <el-form-item label="编码" prop="code">
        <el-input
          size="mini"
          v-model.trim="customOptionValueForm.code"
          placeholder="值编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input
          size="mini"
          v-model.trim="customOptionValueForm.value"
          placeholder="属性值"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="submitValue"
        >添加</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CustomOptionValueForm',

  props: {
    visible: {
      type: Boolean
    },
    option: {
      type: Object,
      default: () => ({})
    }
  },

  model: {
    prop: 'visible',
    event: 'input'
  },

  data() {
    const optionValueCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入自定义属性值code'))
      } else if (this.option.selectionValues.includes(value)) {
        callback(new Error('属性值code必须唯一'))
      } else {
        callback()
      }
    }

    return {
      customOptionValueForm: {
        code: '',
        option_id: '',
        value: ''
      },
      customOptionValueFormRules: {
        code: [
          {
            required: true,
            message: '请输入自定义属性值code',
            trigger: 'blur'
          },
          { validator: optionValueCode, trigger: 'blur' }
        ],
        value: [
          {
            required: true,
            message: '请输入自定义属性值value',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    // 添加自定义属性表单关闭前置钩子
    customOptionValueFormBeforeClose(done) {
      this.resetCustomOptionValueForm()
      done()
    },

    // 为option添加自定义属性值
    optionAddValue(option, optionValue) {
      let copy = _.cloneDeep(optionValue)
      copy.option_id = option.id
      option.availableOptionValues.push(copy)
      option.selectionValues.push(copy.code)
      option.values.push(copy)
    },

    // 添加值
    submitValue() {
      this.$refs['customOptionValueForm'].validate(valid => {
        if (valid) {
          this.optionAddValue(this.option, this.customOptionValueForm)
          this.show = false
          this.resetCustomOptionValueForm()
        }
      })
    },

    // 重置添加自定义属性值表单
    resetCustomOptionValueForm() {
      this.$refs['customOptionValueForm'].resetFields()
    }
  },

  computed: {
    show: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style scoped></style>
