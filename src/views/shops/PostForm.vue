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
          label="名称"
          prop="name"
        >
          <el-input v-model="resource.name"></el-input>
        </el-form-item>
        <el-form-item label="省市区">
          <area-cascader
            filterable
            v-model="resource.address"
          > </area-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="addr"
        >
          <el-input v-model="resource.addr"></el-input>
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="addrName"
        >
          <el-input v-model="resource.addrName"></el-input>
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="addrPhone"
        >
          <el-input v-model="resource.addrPhone"></el-input>
        </el-form-item>
      </div>
    </div>
    <div class="card overflow-hidden mb-6">
      <div class="card-head">
        <div class="card-head__title">
          Location
        </div>
      </div>
      <div class="w-full p-6">
        <el-form-item
          label="门店位置"
          class="el-form-item__full relative"
        >
          <div class="flex flex-col sm:flex-row">
            <div class="flex sm:mr-3 mb-2">
              <el-input
                size="mini"
                v-model="resource.location.lat"
                placeholder="请输入内容"
              >
                <div slot="prepend">经度</div>
              </el-input>
            </div>
            <div class="flex mb-2">
              <el-input
                size="mini"
                v-model="resource.location.lng"
                placeholder="请输入内容"
              >
                <div slot="prepend">纬度</div>
              </el-input>
            </div>
          </div>
          <BMap v-model="resource.location"></BMap>
        </el-form-item>
      </div>
    </div>

    <div class="card overflow-hidden mb-6">
      <div class="card-head">
        <div class="card-head__title">
          Members
        </div>
      </div>
      <div class="w-full p-6">
        <el-form-item label="成员">
          <el-checkbox-group v-model="resource.members">
            <el-checkbox
              v-for="admin in admins"
              :key="admin.id"
              :label="admin.id"
            >
              <div :class="{
                  'text-blue-500': admin.type === 'root',
                  'text-indigo-500': admin.type === 'manager'
                }">
                {{ admin.nickname }}
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import ResourceForm from '@/mixins/ResourceForm'
import { getResources as getAdmins } from '@/api/admin'
export default {
  name: 'post-form',
  mixins: [ResourceForm],
  components: {
    BMap: () => import('@/components/baidu/BMap'),
    AreaCascader: () => import('@/components/AreaCascader')
  },
  data () {
    return {
      resource: {
        name: '',
        address: {
          province: '',
          city: '',
          areas: ''
        },
        addrName: '',
        addrPhone: null,
        location: {
          lat: 28.199554,
          lng: 112.969625
        },
        addr: '',
        members: []
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入门店名称',
            trigger: 'blur'
          }
        ]
      },
      admins: []
    }
  },
  methods: {
    fetchAdmins () {
      getAdmins({ page: -1, only: 'id,nickname,type' }).then(data => {
        if (data.status === 200) {
          this.admins = _.get(data, 'data.data', []).map(item => {
            return {
              id: item.data.id,
              nickname: item.data.nickname,
              type: item.data.type
            }
          })
        }
      })
    },
    // resource transform
    resourceTransform () {
      const address = {
        ...this.resource.address,
        addr: this.resource.addr,
        name: this.resource.addrName,
        phone: this.resource.addrPhone
      }
      const { name, location, members } = this.resource
      return { name, address, location, members }
    },
    // 填充数据
    fillResource () {
      // 数据结构转换

      const { address, members, ...old } = this.value
      let obj = { ...old }

      obj.members = _.isNil(members) ? [] : members.map(item => item.id)

      if (address) {
        const { name, phone, addr, ...a } = address
        obj.address = a
        obj.addrName = name
        obj.addrPhone = phone
        obj.addr = addr
      }
      this.$set(this, 'resource', obj)
    }
  },
  created () {
    this.fetchAdmins()
  }
}
</script>

<style></style>
