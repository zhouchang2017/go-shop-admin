<template>
  <div>
    <button
      @click="dialogVisible = true"
      class="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium"
    >
      {{ action.name }}
    </button>
    <el-dialog
      append-to-body
      :title="action.name"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div v-if="shouldShowFields">
        <el-form :ref="resourceName">
          <component
            v-for="(field, index) in action.fields"
            :key="index"
            :is="resolveComponentName(field)"
            :errors="validationErrors"
            :resource-name="resourceName"
            :field="field"
            @file-deleted="$emit('update-last-retrieved-at-timestamp')"
          />
        </el-form>
      </div>
      <div v-else>{{ action.confirm_text }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          action.cancel_button_text
        }}</el-button>
        <el-button type="primary" @click="submit">{{
          action.confirm_button_text
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Errors from '@/utils/errors'

export default {
  props: {
    resourceName: String,
    action: {
      type: Object,
      default: () => ({})
    },
    selectedResources: {
      type: [Array, String],
      default: () => []
    },
    mode: {
      type: String,
      default: 'form'
    }
  },
  data: () => ({
    dialogVisible: false,
    validationErrors: new Errors(),
    submitted: false,
    isWorking: false
  }),

  methods: {
    /**
     * Resolve the component name.
     */
    resolveComponentName(field) {
      return field.prefix_component
        ? `${this.mode}-${field.component}`
        : field.component
    },
    async submit(e) {
      this.submitted = true
      await this.submitting()
    },

    /**
     * Create a new resource instance using the provided data.
     */
    async submitting() {
      this.isWorking = true

      try {
        const { data } = await this.submitRequest()

        this.$message(data)

        this.$emit('actionExecuted')
      } catch (error) {
        this.submittedViaCreateResource = true
        this.isWorking = false
        if (error.response.status == 422) {
          console.log(error.response)
          this.validationErrors = new Errors(error.response.data.errors)
          this.$message({
            message: 'There was a problem submitting the form.',
            type: 'error'
          })
        }
      }

      this.submitted = true
      this.isWorking = false
      this.dialogVisible = false
    },

    /**
     * Send a create request for this resource
     */
    submitRequest() {
      return axios.post(
        `/actions/${this.resourceName}/${this.action.uri_key}`,
        this.submitResourceFormData()
      )
    },

    /**
     * Create the form data for creating the resource.
     */
    submitResourceFormData() {
      return _.tap(
        {
          resources: this.selectedResources
        },
        formData => {
          _.each(_.get(this, 'action.fields', []), field => {
            field.fill(formData)
          })
        }
      )
    }
  },
  computed: {
    shouldShowFields() {
      return _.get(this, 'action.fields', []).length > 0
    }
  }
}
</script>
