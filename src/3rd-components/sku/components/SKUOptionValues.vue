<template>
  <div class="group-container">
    <div class="flex">
      <span class="text-xs text-gray-700 whitespace-no-wrap">规格值：</span>
      <div class="sku-list__body">
        <draggable v-model="sku[ease.optionValuesKey]" class="flex flex-wrap">
          <div
            v-for="value in sku[ease.optionValuesKey]"
            :key="value.uid"
            class="mr-1 mb-1"
          >
            <el-popover v-if="!hasSkuImage" placement="bottom" trigger="click">
              <div class="flex flex-col items-center">
                <el-input
                  v-model="value.name"
                  placeholder="请输入规格名称"
                  size="mini"
                  class="w-24"
                >
                </el-input>
              </div>
              <el-tag
                slot="reference"
                closable
                effect="plain"
                size="small"
                @close="handleClose(index)"
                class="cursor-pointer outline-none"
              >
                {{ value.name }}
              </el-tag>
            </el-popover>
            <el-tag
              v-else
              closable
              effect="plain"
              size="small"
              @close="handleClose(index)"
              class="cursor-pointer outline-none"
            >
              {{ value.name }}
            </el-tag>
            <div v-if="hasSkuImage" class="sku-item__upload">
              <div class="arrow"></div>
              <div class="flex flex-col items-center">
                <el-input
                  v-model="value.name"
                  placeholder="请输入规格名称"
                  size="mini"
                  class="w-24"
                >
                </el-input>
                <image-upload
                  v-if="hasSkuImage"
                  class="mt-1"
                  :multiple="false"
                  :token="ease.token"
                  v-model="value.image"
                  :limit="1"
                  url
                  :on-delete="handleRemoveImage"
                />
              </div>
            </div>
          </div>
        </draggable>
        <div class=" " v-if="sku[optionIdKey] > 0">
          <el-input
            class="input-new-tag inline-flex"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            placeholder="请输入规格名称"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            ><i class="el-icon-circle-plus"></i
          ></el-button>
        </div>
        <div v-else>请添加规格</div>
      </div>
    </div>
  </div>
</template>

<script>
const noop = res => res
export default {
  inject: ['ease'],
  components: {
    'image-upload': () => import('@/components/Form/ImageUpload'),
    draggable: () => import('vuedraggable')
  },
  data() {
    return {
      visiable: false,
      leafValue: [],
      optionValues: [],
      id: 0,
      inputVisible: false,
      inputValue: ''
    }
  },
  props: {
    sku: {
      type: Object,
      default() {
        return {}
      }
    },
    hasSkuImage: {
      type: Boolean,
      default: false
    },
    onSkuLeafChange: {
      type: Function,
      default: noop
    }
  },
  computed: {
    optionIdKey() {
      return _.get(this, 'ease.optionIdKey', 'id')
    },
    optionNameKey() {
      return _.get(this, 'ease.optionNameKey', 'name')
    }
  },
  watch: {
    sku: {
      deep: true,
      immediate: true,
      handler(sku) {
        this.fetchLeafById(sku[this.optionIdKey])
      }
    }
  },
  methods: {
    handleClose(index) {
      this.sku[this.ease.optionValuesKey].splice(index, 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        let { sku, optionIdKey, optionNameKey } = this
        // 过滤需要新增的规格值
        if (
          sku[this.ease.optionValuesKey].some(item => item.name === inputValue)
        ) {
          this.$message.warning(`${inputValue} 属性值已存在！`)
          return
        }
        const uid = await this.ease.onCreateOptionValues(inputValue)
        let value = {
          [optionIdKey]: uid,
          [optionNameKey]: inputValue
        }
        if (sku.image) {
          value.image = ''
        }

        this.sku[this.ease.optionValuesKey].push(value)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleHideVisiable() {
      this.visiable = false
    },
    handleResetLeafValue() {
      this.leafValue = []
    },
    fetchLeafById(id) {
      if (!id) return
      if (typeof this.ease.onFetchOptionValues === 'function') {
        this.ease.onFetchOptionValues(id).then(values => {
          this.id = id
          this.optionValues = optionValues
        })
      }
    },
    handleRemoveImage() {
      this.onSkuLeafChange(this.sku[this.ease.optionValuesKey])
    },
    handleRemoveSkuLeaf(index) {
      this.sku[this.ease.optionValuesKey].splice(index, 1)
      this.onSkuLeafChange(this.sku[this.ease.optionValuesKey])
    }
  }
}
</script>

<style>
.button-new-tag {
  height: 24px;
  line-height: 22px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  height: 24px;
  width: 120px;
  vertical-align: bottom;
}
.input-new-tag input {
  height: 24px !important;
}
.hover-target__actions {
  opacity: 0;
  transition: opacity 0.3s;
  background-color: rgba(0, 0, 0, 0.3);
}
.hover-target__actions:hover {
  opacity: 1;
}
</style>

<style lang="scss">
.group-container {
  padding: 10px 10px 0;
  color: #666;
  font-size: 12px;
  .sku-list {
    display: flex;
    flex-flow: row;
    align-items: center;
    .sku-item {
      display: inline-block;
      margin-right: 10px;
    }
    .sku-list__icon {
      font-size: 20px;
    }
  }
  .cursor {
    cursor: pointer;
  }
  .sku-list__body {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
  }
}
.popover-select {
  width: 100% !important;
}
.sku-item__upload {
  margin-top: 6px;
  padding: 4px;
  border: solid 1px #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  position: relative;
  margin-bottom: 10px;
  .arrow {
    position: absolute;
    width: 0;
    height: 0;
    top: -8px;
    left: 10%;
    border-style: solid;
    border-color: transparent;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #e4e7ed;
    &::after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      top: 0;
      margin-left: -10px;
      border-color: transparent transparent #fff;
      border-style: solid;
      border-width: 1px 10px 10px;
      content: '';
      // top: 1px;
      // margin-left: -6px;
      // border-top-width: 0;
      // border-bottom-color: #ffffff;
    }
  }
  .el-image,
  .img-uploader,
  .uploader-icon {
    width: 84px;
    height: 84px;
  }
  .uploader-icon {
    line-height: 84px;
    font-size: 30px;
  }
  .el-image {
    display: block;
  }
}
</style>
