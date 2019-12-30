<template>
  <div class="flex flex-col">
    <el-form v-if="panels" :ref="resourceName">
      <form-panel
        class="mb-8"
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
    <div class="mb-6"></div>

    <div class="fixed bottom-0 left-0 w-full sm:pl-64">
      <div class="flex w-full bg-white p-3">
        <div class="ml-auto"></div>
        <el-button @click="reset">Reset</el-button>
        <el-button @click="submitViaUpdateResource" type="primary"
          >Create</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Errors from '@/utils/errors'
export default {
  data: () => ({
    loading: true,
    submittedViaUpdateResource: false,
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
      } = await axios.get(
        `/update-fields/${this.resourceName}/${this.resourceId}`
      )

      this.panels = panels
      this.fields = fields
      this.loading = false
    },

    async submitViaUpdateResource(e) {
      this.submittedViaUpdateResource = true
      await this.updateResource()
    },

    /**
     * Create a new resource instance using the provided data.
     */
    async updateResource() {
      this.isWorking = true

      try {
        const {
          data: { redirect }
        } = await this.updateRequest()

        this.$message({
          message: '更新成功',
          type: 'success'
        })

        this.$router.push({ path: redirect })
      } catch (error) {
        this.submittedViaUpdateResource = true
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
      //       } = await this.updateRequest()

      //       this.$message({
      //         message: '创建成功',
      //         type: 'success'
      //       })

      //       this.$router.push({ path: redirect })
      //     } catch (error) {
      //       this.submittedViaUpdateResource = true
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

      this.submittedViaUpdateResource = true
      this.isWorking = false
    },

    /**
     * Send a create request for this resource
     */
    updateRequest() {
      return axios.put(
        `/${this.resourceName}/${this.resourceId}`,
        this.updateResourceFormData()
      )
    },

    /**
     * Create the form data for creating the resource.
     */
    updateResourceFormData() {
      return _.tap({}, formData => {
        _.each(this.fields, field => {
          field.fill(formData)
        })
      })
    },

    async submit() {
      const data = await this.$refs[this.formRef].submit()
      try {
        let res = await updateResource(data)
        if (res.status === 201) {
          this.$router.push({
            name: this.$route.meta.DetailRouterName,
            params: { id: res.data.id }
          })
          this.$message({
            message: '创建成功',
            type: 'success'
          })
        }
      } catch ({ response }) {
        console.error(response)
      }
    },
    reset() {
      this.$refs[this.formRef].reset()
    }
  },

  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },
    resourceId() {
      return _.get(this, '$route.params.id')
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
