<template>
  <div class="flex">
    <div class="w-full mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
      <DetailHead
        id="产品详情"
        :meta="meta"
        @on-delete="onDelete"
        @on-restore="onRestore"
        @on-force-delete="onForceDelete"
      />
      <div
        class="card mb-6"
        v-loading="loading"
      >
        <div class="card-body">
          <div class="card-item">
            <div class="card-item__label">ID</div>
            <div class="card-item__content">{{ resource.id }}</div>
          </div>
          <div class="card-item">
            <div class="card-item__label">名称</div>
            <div class="card-item__content">{{ resource.name }}</div>
          </div>
          <div class="card-item">
            <div class="card-item__label">品牌</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'brand.name') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">类目</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'category.name') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">创建时间</div>
            <div class="card-item__content">
              {{ resource.created_at | timeStr }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">更新时间</div>
            <div class="card-item__content">
              {{ resource.updated_at | timeStr }}
            </div>
          </div>
          <div
            class="card-item"
            v-if="resource.deleted_at"
          >
            <div class="card-item__label">删除时间</div>
            <div class="card-item__content">
              {{ resource.deleted_at | timeStr }}
            </div>
          </div>
        </div>
      </div>

      <div
        id="图集"
        class="font-bold text-2xl text-gray-700 uppercase mb-3"
      >
        图集
      </div>
      <div
        class="card mb-6"
        v-loading="loading"
      >
        <div
          class="card-body"
          v-if="hasImages"
        >
          <ImageList :images="resource.images" />
        </div>
        <div
          class="card-body"
          v-else
        >
          <div class="text-gray-500 inline-flex">
            <IIcon type="i-x-circle" />
            <div class="ml-3">woops! images is empty</div>
          </div>
        </div>
      </div>

      <div
        id="基本属性"
        class="font-bold text-2xl text-gray-700 uppercase mb-3"
      >
        基本属性
      </div>
      <div
        class="card mb-6"
        v-loading="loading"
      >
        <div
          class="card-body"
          v-if="getAttr(resource, 'attributes', []).length > 0"
        >
          <div
            class="card-item"
            v-for="(attr, index) in getAttr(resource, 'attributes', [])"
            :key="index"
          >
            <div class="card-item__label">{{ attr.name }}</div>
            <div class="card-item__content">{{ attr.value }}</div>
          </div>
        </div>
        <div
          class="card-body"
          v-else
        >
          <div class="text-gray-500 inline-flex">
            <IIcon type="i-x-circle" />
            <div class="ml-3">woops! attributes is empty</div>
          </div>
        </div>
      </div>

      <div
        id="销售属性"
        class="font-bold text-2xl text-gray-700 uppercase mb-3"
      >
        销售属性
      </div>
      <div
        class="card mb-6"
        v-loading="loading"
      >
        <div
          class="card-body"
          v-if="getAttr(resource, 'options', []).length > 0"
        >
          <div
            class="card-item"
            v-for="(option, index) in getAttr(resource, 'options', [])"
            :key="index"
          >
            <div class="card-item__label">
              <el-tooltip
                class="item"
                effect="dark"
                :content="`权重${option.sort}`"
                placement="top"
              >
                <span>{{ option.name }}</span>
              </el-tooltip>
            </div>
            <div class="card-item__content">
              <div class="flex flex-row">
                <div
                  v-for="value in option.values"
                  :key="value.id"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="value.code"
                    placement="top"
                  >
                    <code class="markdown text-gray-700 p-1 hover:bg-gray-300  hover:font-bold hover:text-primary rounded mr-3 text-xs">{{ value.value }}</code>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="card-body"
          v-else
        >
          <div class="text-gray-500 inline-flex">
            <IIcon type="i-x-circle" />
            <div class="ml-3">woops! option is empty</div>
          </div>
        </div>
      </div>

      <div
        id="商品列表"
        class="font-bold text-2xl text-gray-700 uppercase mb-3"
      >
        商品列表
      </div>
      <div class="card mb-6">
        <el-table
          v-loading="loading"
          :data="resource.items"
          class="rounded-lg overflow-hidden"
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column
            label="商品编码"
            prop="code"
            align="left"
          >
          </el-table-column>

          <el-table-column
            label="价格"
            prop="price"
            sortable
            align="left"
          >
          </el-table-column>

          <el-table-column
            label="属性值"
            prop="values"
            align="left"
          >
            <template slot-scope="{ row }">
              <div class="flex flex-row">
                <div
                  v-for="value in row.option_values"
                  :key="value.id"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="value.code"
                    placement="top"
                  >
                    <code class="markdown text-gray-700 p-1 bg-30 hover:bg-gray-300 hover:font-bold  rounded mr-3 text-xs">{{ value.value }}</code>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
      <HashNav>
        <HashNavItem name="产品详情" />
        <HashNavItem name="图集" />
        <HashNavItem name="基本属性" />
        <HashNavItem name="销售属性" />
        <HashNavItem name="商品列表" />
      </HashNav>
    </div>
  </div>
</template>

<script>
import {
  getResource,
  deleteResource,
  forceDeleteResource,
  restoreResource
} from '@/api/product'
import Detail from '@/mixins/Detail'
export default {
  mixins: [Detail],
  components: {
    ImageList: () => import('@/components/detail/ImageList'),
    HashNav: () => import('@/components/HashNav'),
    HashNavItem: () => import('@/components/HashNavItem')
  },
  methods: {
    getResource,
    deleteResource,
    forceDeleteResource,
    restoreResource
  },
  computed:{
    hasImages(){
      return _.get(this,'resource.images',[]).length > 0
    }
  }
}
</script>

<style></style>
