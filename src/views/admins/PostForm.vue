<template>
  <el-form
    :ref="formName"
    :model="resource"
    :rules="rules"
  >
    <div class="card overflow-hidden mb-6">
      <div class="card-head">
        <div class="card-head__title">
          基本
        </div>
      </div>
      <div class="w-full p-6">
        <el-form-item
          v-if="updating"
          label="ID"
          prop="id"
        >
          <el-input
            v-model="resource.id"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            :disabled="updating"
            v-model="resource.username"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="昵称"
          prop="nickname"
        >
          <el-input v-model="resource.nickname"></el-input>
        </el-form-item>
        <el-form-item
          label="更新密码"
          prop="password"
          v-if="updating"
        >
          <el-checkbox v-model="showPasswordInput"></el-checkbox>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
          v-if="creating || showPasswordInput"
        >
          <el-input
            type="password"
            v-model="resource.password"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-model="resource.type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </div>
    <div class="card overflow-hidden mb-6">
      <div class="card-head">
        <div class="card-head__title">
          Shops
        </div>
      </div>
      <div class="w-full p-6">
        <el-form-item
          label="所属门店"
          prop="shops"
        >
          <el-checkbox-group v-model="shopIds">
            <el-checkbox
              v-for="shop in shops"
              :key="shop.id"
              :label="shop.id"
            >{{ shop.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import ResourceForm from '@/mixins/ResourceForm'
import { getResources as getShops } from '@/api/shop'
export default {
  name: 'post-form',
  mixins: [ResourceForm],
  data () {
    return {
      resource: {
        nickname: '',
        username: '',
        password: '',
        type: 'salesman'
      },
      types: [
        { value: 'root', lable: '超级管理员' },
        { value: 'admin', lable: '管理员' },
        { value: 'manager', lable: '店长' },
        { value: 'salesman', lable: '店员' }
      ],
      shops: [],
      showPasswordInput: false
    }
  },
  watch: {
    showPasswordInput (value) {
      if (!value) {
        delete this.resource.password
      }
    }
  },
  methods: {
    fetchShops () {
      getShops({ page: -1, only: '_id,name' }).then(data => {
        if (data.status === 200) {
          this.shops = _.get(data, 'data.data', []).map(item => {
            return {
              id: item.data.id,
              name: item.data.name
            }
          })
        }
      })
    },
    // resource transform
    resourceTransform () {
      if (this.updating && !this.showPasswordInput) {
        delete this.resource.password
      }
      return this.resource
    }
  },
  computed: {
    rules () {
      let obj = {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        nickname: [
          {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }
        ]
      }
      return this.updating
        ? obj
        : Object.assign({}, obj, {
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ]
        })
    },
    shopIds: {
      get () {
        return _.get(this, 'resource.shops', []).map(shop => shop.id)
      },
      set (value) {
        let shops = this.shops.filter(shop => value.includes(shop.id))
        this.$set(this.resource, 'shops', shops)
      }
    }
  },
  created () {
    this.fetchShops()
  }
}
</script>

<style></style>
