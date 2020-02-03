<template>
  <div>
    <el-upload
      v-if="implementationQiniu"
      class="avatar-uploader hidden"
      :action="action"
      :data="{ token: token }"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
    >
    </el-upload>

    <quill-editor
      v-loading="uploading"
      ref="myTextEditor"
      v-bind:value="value"
      v-on:input="v => $emit('input', v)"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    >
    </quill-editor>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
// import Quill from 'quill'
// import { ImageDrop } from 'quill-image-drop-module'
// import { ImageResize } from 'quill-image-resize-module'
// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ['clean'],
  ['link', 'image', 'video']
]

export default {
  components: {
    'quill-editor': quillEditor
  },
  props: ['value', 'token', 'action'],
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    let that = this
    return {
      editorOption: {
        placeholder: '请输入文本...',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function(value) {
                if (value && that.implementationQiniu) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                  that.$message.error('尚未配置七牛云存储')
                }
              }
            }
          }
          //   imageDrop: true,
          //   imageResize: {
          //     displayStyles: {
          //       backgroundColor: 'black',
          //       border: 'none',
          //       color: 'white'
          //     },
          //     modules: ['Resize', 'DisplaySize', 'Toolbar']
          //   }
        }
      },
      uploading: false
    }
  },
  methods: {
    onEditorBlur(editor) {},
    onEditorFocus(editor) {},
    onEditorReady(editor) {},
    resolverValue(value) {
      return `${_.get(value, 'domain')}/${_.get(value, 'key')}`
    },
    // 上传图片前
    beforeUpload(res, file) {
      this.uploading = true
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      // 如果上传成功
      if (_.has(res, 'key')) {
        // 获取光标所在位置
        let length = this.editor.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        this.editor.insertEmbed(length, 'image', this.resolverValue(res))
        // 调整光标到最后
        this.editor.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      this.uploading = false
    },
    // 上传图片失败
    uploadError(res, file) {
      this.$message.error('图片插入失败')
      this.uploading = false
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    },
    implementationQiniu() {
      return !_.isNil(this.action) && !_.isNil(this.token)
    }
  }
}
</script>

<style>
.ql-editor {
  min-height: 150px;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}
.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: '等宽字体';
}
.ql-toolbar.ql-snow + .ql-container.ql-snow {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.ql-toolbar.ql-snow {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.ql-snow .ql-stroke,
.ql-snow .ql-picker {
  color: #999;
  stroke: #999;
}
.ql-snow .ql-fill,
.ql-snow .ql-stroke.ql-fill {
  fill: #999;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='12px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='12px']::before {
  content: '12px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='14px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='14px']::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='16px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='16px']::before {
  content: '16px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
  content: '20px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='24px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='24px']::before {
  content: '24px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='36px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='36px']::before {
  content: '36px';
}
.ql-container {
  font-size: 14px;
}

.ql-container {
  min-height: 500px;
}
</style>
