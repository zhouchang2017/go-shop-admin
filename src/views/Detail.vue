<template>
  <div class="flex">
    <div
      v-loading="initialLoading"
      class="w-full mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4"
    >
      <!-- Resource Detail -->
      <div
        v-for="(panel, index) in availablePanels"
        class="mb-8"
        :id="panel.name"
        :key="index"
      >
        <component
          :is="panel.component"
          :resource-name="resourceName"
          :resource-id="resourceId"
          :resource="resource"
          :panel="panel"
        >
          <div v-if="panel.show_toolbar" class="flex items-center mb-3">
            <heading :level="1" class="flex-no-shrink">{{
              panel.name
            }}</heading>

            <div class="ml-auto flex items-center">
              <el-dialog
                title="提示"
                :visible.sync="deleteModalOpen"
                width="30%"
              >
                <span>确定删除该资源吗?</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="deleteModalOpen = false">取消</el-button>
                  <el-button type="primary" @click="confirmDelete"
                    >确定</el-button
                  >
                </span>
              </el-dialog>
              <el-dialog
                title="提示"
                :visible.sync="restoreModalOpen"
                width="30%"
              >
                <span>确定需要恢复该资源吗?</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="restoreModalOpen = false">取消</el-button>
                  <el-button type="primary" @click="confirmRestore"
                    >确定</el-button
                  >
                </span>
              </el-dialog>
              <el-dialog
                title="提示"
                :visible.sync="forceDeleteModalOpen"
                width="30%"
              >
                <span>确定永久删除该资源吗?</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="forceDeleteModalOpen = false"
                    >取消</el-button
                  >
                  <el-button type="primary" @click="confirmForceDelete"
                    >确定</el-button
                  >
                </span>
              </el-dialog>

              <el-button
                title="恢复"
                @click="restoreModalOpen = true"
                v-if="resource.AuthorizedToRestore && resource.SoftDeleted"
                size="small"
                class="hover:bg-gray-100 hover:text-gray-500 rounded-lg"
                style="border-style:none;"
              >
                <icons-icon
                  viewBox="0 0 20 20"
                  class="h-6 w-6"
                  type="icons-restore"
                />
              </el-button>
              <el-button
                title="删除"
                @click="openDeleteModal"
                v-if="resource.AuthorizedToDelete"
                size="small"
                class="hover:bg-gray-100 hover:text-gray-500 mr-2 rounded-lg"
                style="border-style:none;"
              >
                <icons-icon
                  viewBox="0 0 20 20"
                  class="h-6 w-6"
                  type="icons-delete"
                />
              </el-button>
              <router-link
                title="编辑"
                v-if="resource.AuthorizedToUpdate"
                :to="{
                  name: `${resourceName}.edit`,
                  params: { id: resourceId }
                }"
                class="el-button--small rounded-lg hover:opacity-75 inline-block bg-blue-500 text-white"
              >
                <icons-icon type="icons-edit" class="h-6 w-6" />
              </router-link>
            </div>
          </div>
        </component>
      </div>
    </div>
    <div class="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
      <hash-nav>
        <hash-nav-item
          v-for="(panel, index) in availablePanels"
          :name="panel.name"
          :key="index"
        />
        <nav-actions
          :actions="actions"
          :resourceName="resourceName"
          :selectedResources="selectedResources"
          @actionExecuted="actionExecuted"
        />
      </hash-nav>
    </div>
  </div>
</template>

<script>
import Minimum from '@/utils/minimum'
import Deletable from '@/mixins/Deletable'
export default {
  mixins: [Deletable],
  data: () => ({
    initialLoading: true,
    loading: true,
    resource: null,
    panels: [],
    actions: [],
    deleteModalOpen: false,
    restoreModalOpen: false,
    forceDeleteModalOpen: false
  }),

  watch: {
    resourceId: function(newResourceId, oldResourceId) {
      if (newResourceId != oldResourceId) {
        this.initializeComponent()
      }
    }
  },

  /**
   * Bind the keydown even listener when the component is created
   */
  created() {
    document.addEventListener('keydown', this.handleKeydown)
  },

  /**
   * Unbind the keydown even listener when the component is destroyed
   */
  destroyed() {
    document.removeEventListener('keydown', this.handleKeydown)
  },

  /**
   * Mount the component.
   */
  mounted() {
    this.initializeComponent()
  },

  methods: {
    /**
     * Handle the keydown event
     */
    handleKeydown(e) {
      if (
        this.resource.authorizedToUpdate &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        !e.shiftKey &&
        e.keyCode == 69 &&
        e.target.tagName != 'INPUT' &&
        e.target.tagName != 'TEXTAREA'
      ) {
        this.$router.push({
          name: `${this.resourceName}.edit`,
          params: { id: this.resourceId }
        })
      }
    },

    /**
     * Initialize the compnent's data.
     */
    async initializeComponent() {
      await this.getResource()
      this.initialLoading = false
    },

    /**
     * Get the resource information.
     */
    getResource() {
      this.resource = null

      return Minimum(axios.get('/' + this.resourceName + '/' + this.resourceId))
        .then(({ data: { panels, resource, actions } }) => {
          this.panels = panels
          this.resource = resource
          this.actions = actions
          this.loading = false
        })
        .catch(error => {
          if (error.response.status >= 500) {
            this.$Bus.$emit('error', error.response.data.message)
            return
          }

          if (error.response.status === 404 && this.initialLoading) {
            this.$router.push({ name: '404' })
            return
          }

          if (error.response.status === 403) {
            this.$router.push({ name: '403' })
            return
          }

          this.$toasted.show(this.__('This resource no longer exists'), {
            type: 'error'
          })

          this.$router.push({
            name: 'index',
            params: { resourceName: this.resourceName }
          })
        })
    },

    /**
     * Handle an action executed event.
     */
    async actionExecuted() {
      await this.getResource()
    },

    /**
     * Create a new panel for the given field.
     */
    createPanelForField(field) {
      return _.tap(
        _.find(this.panels, panel => panel.name == field.panel),
        panel => {
          panel.fields = [field]
        }
      )
    },

    openDeleteModal() {
      if (this.resource.SoftDeleted) {
        this.forceDeleteModalOpen = true
      }
      this.deleteModalOpen = true
    },

    /**
     * Show the confirmation modal for deleting or detaching a resource
     */
    async confirmDelete() {
      this.deleteResource(this.resourceName, this.resourceId, () => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })

        if (!this.resource.SoftDeleted) {
          this.$router.push({
            name: `${this.resourceName}.index`
          })
          return
        }
        this.getResource()
        this.deleteModalOpen = false
      })
    },

    /**
     * Show the confirmation modal for restoring a resource
     */
    async confirmRestore() {
      this.restoreResource(this.resourceName, this.resourceId, () => {
        this.$message({
          message: '恢复成功',
          type: 'success'
        })

        this.getResource()
        this.restoreModalOpen = false
      })
    },

    /**
     * Show the confirmation modal for force deleting
     */
    async confirmForceDelete() {
      this.forceDeleteResource(this.resourceName, this.resourceId, () => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })

        this.$router.push({
          name: `${this.resourceName}.index`
        })

        this.forceDeleteModalOpen = false
      })
    },

    /**
     * Resolve the component name.
     */
    resolveComponentName(field) {
      return field.prefix_component
        ? 'detail-' + field.component
        : field.component
    }
  },
  computed: {
    resourceId() {
      return _.get(this, '$route.params.id')
    },
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },

    title() {
      return _.get(this, '$route.meta.Title', this.resourceName)
    },

    shouldShowActions() {
      return _.get(this, 'actions', []).length > 0
    },

    selectedResources() {
      return [this.resourceId]
    },

    /**
     * Get the available field panels.
     */
    availablePanels() {
      if (this.resource) {
        var panels = {}

        var fields = _.toArray(JSON.parse(JSON.stringify(this.resource.fields)))

        fields.forEach(field => {
          if (field.listable) {
            return (panels[field.name] = this.createPanelForRelationship(field))
          } else if (panels[field.panel]) {
            return panels[field.panel].fields.push(field)
          }

          panels[field.panel] = this.createPanelForField(field)
        })

        return _.toArray(panels)
      }
      return []
    }
  }
}
</script>
