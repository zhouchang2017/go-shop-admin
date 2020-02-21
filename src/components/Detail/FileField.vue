<template>
  <panel-item :field="field">
    <template slot="value">
      <div v-if="shouldShowImage">
        <div class="flex flex-wrap">
          <detail-image-card
            v-for="(file, index) in files"
            :key="index"
            :value="file"
            :showPreview="shouldShowPreview"
            :showDownload="shouldShowDownload"
            :previewList="previewList"
          />
        </div>
      </div>
      <div v-else>
        <div
          v-for="(file, index) in field.value"
          :key="index"
          class="flex justify-between px-2 py-2"
        >
          <p class="flex text-gray-700">
            {{ file.name }}
          </p>
          <p class="text-gray-500 font-thin" v-if="shouldShowDownload">
            <icons-icon class="h-6 w-6" type="icons-download" />
          </p>
        </div>
      </div>
    </template>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  methods: {
    resolverValue(value) {
      return {
        url: value,
        name: _.get(this, 'value.name', '未命名')
      }
    }
  },
  computed: {
    files() {
      if (_.isString(this.field.value)) {
        return [{ url: this.field.value, name: this.field.value }]
      }
      if (_.isArray(this.field.value)) {
        return this.field.value.map(item => {
          return _.isString(item)
            ? { url: item, name: item }
            : this.resolverValue(item)
        })
      }
      if (_.isObject(this.field.value)) {
        return [this.resolverValue(this.field.value)]
      }
      return []
    },
    previewList() {
      return this.files.map(file => file.url)
    },
    shouldShowImage() {
      return this.type === 'image' && this.value !== ''
    },
    shouldShowPreview() {
      return _.get(this, 'field.should_show_preview', false)
    },

    shouldShowDownload() {
      return _.get(this, 'field.should_show_download', false)
    },
    // 上传类型
    type() {
      return _.get(this, 'field.type', 'file')
    }
  }
}
</script>
