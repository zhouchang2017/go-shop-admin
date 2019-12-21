<template>
  <el-dialog
    v-loading="loading"
    class="custom-el-dialog"
    :title="availableTitle"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form :model="ruleForm" :rules="rules" :ref="formName">
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="权重" prop="sort">
        <el-slider v-model="ruleForm.sort"></el-slider>
      </el-form-item>

      <div>
        <div
          class="flex items-start"
          v-for="(value, index) in ruleForm.values"
          :key="index"
        >
          <el-form-item
            class="flex-1"
            :prop="'values.' + index + '.value'"
            :rules="[
              {
                validator: validateItemValue,
                trigger: 'blur'
              }
            ]"
          >
            <el-input size="mini" v-model="value.value">
              <div slot="prepend">名称</div>
            </el-input>
          </el-form-item>
          <el-form-item
            class="flex-1"
            :prop="'values.' + index + '.code'"
            :rules="[
              {
                validator: validateItemCode,
                trigger: 'blur'
              }
            ]"
          >
            <el-input size="mini" v-model="value.code">
              <div slot="prepend">编码</div>
            </el-input>
          </el-form-item>

          <div>
            <el-button size="mini" type="danger" @click="removeValue(index)"
              >删除</el-button
            >
          </div>
        </div>
      </div>

      <div class="flex justify-center p-6">
        <span
          @click="addValue"
          class="btn border-gray rounded border p-2 dim cursor-pointer text-80"
        >
          添加属性值
        </span>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addOption, updateOption } from '@/api/category'
export default {
  name: 'OptionForm',
  props: {
    resource: {
      type: Object,
      default: () => {}
    },
    value: Boolean,
    title: String,
    option: {
      type: Object
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  watch: {
    value(v) {
      if (!v) {
        this.$emit('on-close')
      } else {
        this.$set(this.ruleForm, 'values', [])
        if (this.updating) {
          _.each(this.option, (v, k) => {
            this.$set(this.ruleForm, k, v)
          })
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      formName: 'optionForm',
      ruleForm: {
        name: '',
        sort: 0,
        values: []
      },
      rules: {
        name: [
          { required: true, message: '请输入销售属性名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addValue() {
      this.ruleForm.values.push({
        code: '',
        value: ''
      })
    },
    validateItemValue(rule, value, callback) {
      if (value === '') {
        return callback(new Error('属性名称不能为空'))
      }

      if (this.ruleForm.values.filter(item => item.value == value).length > 1) {
        return callback(new Error('属性名称重复'))
      }
      return callback()
    },
    validateItemCode(rule, value, callback) {
      if (value === '') {
        return callback(new Error('属性编码不能为空'))
      }

      if (this.ruleForm.values.filter(item => item.code == value).length > 1) {
        return callback(new Error('属性编码重复'))
      }
      return callback()
    },
    removeValue(index) {
      this.ruleForm.values.splice(index, 1)
    },
    resetForm() {
      this.$refs[this.formName].resetFields()
    },
    submitHandle() {
      return this.updating
        ? updateOption(this.id, this.optionId, this.ruleForm)
        : addOption(this.id, this.ruleForm)
    },
    submitForm() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.submitHandle()
            .then(res => {
              this.loading = false
              if (res.status === 201) {
                this.$emit('on-add-option', res.data.data)
              }
              if (res.status === 200) {
                this.$emit('on-update-option', res.data.data)
              }
              this.resetForm()
              this.$emit('input', false)
              return
            })
            .catch(err => {
              this.loading = false
              console.log(err)
              console.log(err.response)
            })
          //   this.createResource(this.ruleForm)
          //     .then(res => {
          //       this.pageLoading = false
          //       this.navigationToDetail(res.data[this.pk])
          //     })
          //     .catch(({ response }) => {
          //       // 处理后端表单验证错误信息
          //       const { data } = response

          //       // 后端表单验证错误
          //       if (data.code === 422) {
          //         this.$refs[formName].fields.forEach(item => {
          //           if (data.errors.hasOwnProperty(item.prop)) {
          //             item.validateMessage = _.get(data, `errors.${item.prop}`)
          //             item.validateState = 'error'
          //             item.showMessage = true
          //           }
          //         })
          //       }

          //       this.pageLoading = false
          //     })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    availableTitle() {
      if (!_.isNil(this.title)) {
        return this.title
      }
      return this.creating ? '创建销售属性' : '编辑销售属性'
    },
    creating() {
      return !this.updating
    },
    updating() {
      return !_.isNil(this.option)
    },
    id() {
      return _.get(this, 'resource.id') || _.get(this, '$route.params.id')
    },
    optionId() {
      return _.get(this, 'option.id')
    }
  }
}
</script>
