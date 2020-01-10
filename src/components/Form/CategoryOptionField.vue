<template>
  <div>
    <el-dialog
      title="销售属性值设置"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      direction="rtl"
    >
      <el-form
        class="overflow-y-auto p-6"
        :style="dialogBodyHeightStyle"
        :model="ruleForm"
        :rules="rules"
        :ref="formName"
      >
        <el-form-item label="属性名称" prop="name">
          <el-input v-model.trim="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="sort">
          <el-input-number
            v-model.number="ruleForm.sort"
            :min="0"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <div class="flex">
          <div class="el-form-item__label">
            属性列表
          </div>
          <div class="w-4/5">
            <div
              class="pt-3 overflow-hidden hover:bg-gray-100 rounded-lg"
              v-for="(value, index) in ruleForm.values"
              :key="index"
            >
              <el-form-item
                label="属性值"
                :prop="'values.' + index + '.value'"
                :rules="[
                  {
                    validator: validateItemValue,
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input v-model.trim="value.value"></el-input>
              </el-form-item>
              <el-form-item
                label="属性编码"
                :prop="'values.' + index + '.code'"
                :rules="[
                  {
                    validator: validateItemCode,
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input v-model.trim="value.code"></el-input>
              </el-form-item>
              <div class="flex">
                <button
                  @click="removeValue(ruleForm.values, index)"
                  title="删除"
                  type="button"
                  class="ml-auto text-gray-500 hover:text-blue-500"
                >
                  <icons-icon
                    :width="18"
                    :height="18"
                    viewBox="0 0 24 20"
                    type="icons-delete"
                  />
                </button>
              </div>
              <div class="border border-b border-gray-200"></div>
            </div>
            <div class="flex justify-center mt-3">
              <el-button size="mini" @click="addValue">
                添加属性值
              </el-button>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addOption">确定</el-button>
      </span>
    </el-dialog>

    <el-form-item
      :required="isRequired"
      :error="firstError"
      :label="field.name"
    >
      <el-button @click="open" size="mini" type="primary">
        添加
      </el-button>
    </el-form-item>
    <div
      v-for="(opt, index) in value"
      :key="index"
      class="py-3 hover:shadow-lg hover:bg-gray-100 overflow-hidden rounded-lg"
    >
      <el-form-item label="属性名称">
        <el-input disabled v-model.trim="opt.name"></el-input>
      </el-form-item>
      <el-form-item label="权重">
        <el-input-number
          disabled
          v-model.number="opt.sort"
          :min="0"
          :max="100"
        ></el-input-number>
      </el-form-item>
      <div class="flex" v-if="opt.values && opt.values.length > 0">
        <div class="el-form-item__label">
          属性列表
        </div>
        <div class="w-4/5">
          <div
            class="pt-3 overflow-hidden hover:bg-white rounded-lg"
            v-for="(values, ind) in opt.values"
            :key="ind"
          >
            <el-form-item label="属性值">
              <el-input disabled v-model.trim="values.value"></el-input>
            </el-form-item>
            <el-form-item label="属性编码">
              <el-input disabled v-model.trim="values.code"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="flex">
        <!--  -->
        <button
          @click="editOption(opt, index)"
          title="编辑"
          type="button"
          class="ml-auto mr-2 text-gray-500 hover:text-blue-500"
        >
          <icons-icon viewBox="0 0 24 22" type="icons-edit" />
        </button>
        <button
          @click="removeOption(index)"
          title="删除"
          type="button"
          class="text-gray-500 hover:text-blue-500"
        >
          <icons-icon viewBox="0 0 24 20" type="icons-delete" />
        </button>
      </div>
      <div class="border border-b border-gray-200"></div>
    </div>
  </div>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'
export default {
  mixins: [FormField, HandlesValidationErrors],

  data: () => ({
    dialogVisible: false,
    dialogMode: 'create',
    formName: 'optionForm',
    ruleForm: {
      name: '',
      sort: 0,
      values: []
    },
    editIndex: 0,
    rules: {
      name: [{ required: true, message: '请输入销售属性名称', trigger: 'blur' }]
    }
  }),

  methods: {
    // 开启弹出表单
    open() {
      this.ruleForm = {
        name: '',
        sort: 0,
        values: []
      }
      this.dialogVisible = true
    },
    // 编辑属性
    editOption(option, index) {
      this.dialogMode = 'edit'
      this.ruleForm = option
      this.editIndex = index
      this.dialogVisible = true
    },
    // 添加属性
    addOption() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          if (this.dialogMode === 'create') {
            this.value.push(this.ruleForm)
          } else {
            this.value.splice(this.editIndex, 1, this.ruleForm)
            this.dialogMode = 'create'
          }
          this.dialogVisible = false
        }
      })
    },
    // 移除属性值
    removeValue(values, index) {
      values.splice(index, 1)
    },
    // 移除销售属性
    removeOption(index) {
      this.value.splice(index, 1)
    },
    // 添加值
    addValue() {
      if (!this.ruleForm.values) {
        this.ruleForm.values = []
      }
      const last = _.last(this.ruleForm.values)
      if (last) {
        if (last.code == '' && last.value == '') {
          this.$message.error('最后一条属性尚未填写完成')
          return
        }
      }

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

    /*
     * Set the initial value for the field
     */
    setInitialValue() {
      this.value = !(
        this.field.value === undefined || this.field.value === null
      )
        ? this.field.value
        : []
    }
  },

  computed: {
    defaultAttributes() {
      return {
        type: this.field.type || 'text',
        min: this.field.min,
        max: this.field.max,
        step: this.field.step,
        pattern: this.field.pattern,
        placeholder: this.field.placeholder || this.field.name
      }
    },

    extraAttributes() {
      const attrs = this.field.extraAttributes

      return {
        // Leave the default attributes even though we can now specify
        // whatever attributes we like because the old number field still
        // uses the old field attributes
        ...this.defaultAttributes,
        ...attrs
      }
    },

    dialogWidth() {
      return window.innerWidth < 768 ? '90%' : '50%'
    },

    dialogBodyHeightStyle() {
      return { height: window.innerHeight - 350 + 'px' }
    }
  }
}
</script>
