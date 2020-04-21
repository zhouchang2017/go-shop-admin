<template>
  <div class="flex flex-col">
    <el-form v-if="panels" :ref="resourceName">
      <form-panel
        class="mb-3"
        v-for="panel in panelsWithFields"
        :panel="panel"
        :name="panel.name"
        :key="panel.name"
        :resource-name="resourceName"
        :fields="panel.fields"
        mode="form"
        :validation-errors="validationErrors"
      />
    </el-form>
    <div class="flex w-full">
      <div class="ml-auto"></div>
      <el-button @click="reset">重置</el-button>
      <el-button
        @click="submitViaCreateResource"
        :loading="isWorking"
        type="primary"
        >创建</el-button
      >
    </div>
  </div>
</template>

<script>
import Errors from '@/utils/errors'
export default {
  data: () => ({
    loading: true,
    submittedViaCreateResource: false,
    fields: [],
    panels: [],
    validationErrors: new Errors(),
    isWorking: false
  }),

  async created() {
    this.getFields()
  },

  methods: {
    /**
     * Get the available fields for the resource.
     */
    async getFields() {
      this.panels = []
      this.fields = []

      const {
        data: { panels, fields }
      } = await axios.get(`/creation-fields/${this.resourceName}`)

      this.panels = panels
      this.fields = fields
      this.loading = false
    },

    async submitViaCreateResource(e) {
      this.submittedViaCreateResource = true
      await this.createResource()
    },

    /**
     * Create a new resource instance using the provided data.
     */
    async createResource() {
      this.isWorking = true

      try {
        const {
          data: { redirect }
        } = await this.createRequest()

        this.$message({
          message: '创建成功',
          type: 'success'
        })

        this.$router.push({ path: redirect })
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

      // this.$refs[this.resourceName].validate(async (valid, err) => {
      //   if (valid) {
      //     try {
      //       const {
      //         data: { redirect }
      //       } = await this.createRequest()

      //       this.$message({
      //         message: '创建成功',
      //         type: 'success'
      //       })

      //       this.$router.push({ path: redirect })
      //     } catch (error) {
      //       this.submittedViaCreateResource = true
      //       this.isWorking = false

      //       if (error.response.status == 422) {
      //         console.log(error.response)
      //         this.validationErrors = new Errors(error.response.data.errors)
      //         this.$message({
      //           message: 'There was a problem submitting the form.',
      //           type: 'error'
      //         })
      //       }
      //     }
      //   }
      //   console.log(err)
      // })

      this.submittedViaCreateResource = true
      this.isWorking = false
    },

    /**
     * Send a create request for this resource
     */
    createRequest() {
      return axios.post(`/${this.resourceName}`, this.createResourceFormData())
    },

    /**
     * Create the form data for creating the resource.
     */
    createResourceFormData() {
      return _.tap({}, formData => {
        _.each(this.fields, field => {
          field.fill(formData)
        })
      })
    },

    reset() {
      this.$refs[this.formRef].reset()
    }
  },

  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },
    panelsWithFields() {
      return _.map(this.panels, panel => {
        return {
          name: panel.name,
          fields: _.filter(this.fields, field => field.panel == panel.name)
        }
      })
    }
  }
}
</script>
