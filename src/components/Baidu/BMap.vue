<template>
  <baidu-map
    class="w-full rounded-lg"
    :center="center"
    :zoom="zoom"
    @ready="mapHandler"
    :ak="ak"
    scroll-wheel-zoom
  >
    <bm-context-menu>
      <bm-context-menu-item
        :callback="setLocation"
        text="设定位置"
      ></bm-context-menu-item>
    </bm-context-menu>

    <bm-marker v-show="value.lng" :position="pointLocation" :dragging="true">
    </bm-marker>
    <bm-view
      class="w-full rounded-lg overflow-hidden"
      style="height:300px;"
    ></bm-view>

    <bm-control>
      <bm-auto-complete v-model="keyword" :sugStyle="{ zIndex: 1 }">
        <el-input
          placeholder="请输入地址关键字"
          size="mini"
          class="ml-3 mt-3"
          v-model="keyword"
        ></el-input>
      </bm-auto-complete>
    </bm-control>

    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    <bm-geolocation
      anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
      :showAddressBar="true"
      :autoLocation="true"
    ></bm-geolocation>
    <!--        <el-input placeholder="请输入地址关键字" class="my-3" v-model="keyword"></el-input>-->
    <bm-local-search
      :panel="false"
      class="w-full float-left"
      :keyword="keyword"
      auto-viewport
      :location="location"
    ></bm-local-search>
  </baidu-map>
</template>

<script>
export default {
  name: 'BMap',
  components: {
    BaiduMap: () => import('vue-baidu-map/components/map/Map.vue'),
    BmView: () => import('vue-baidu-map/components/map/MapView.vue'),
    BmLocalSearch: () =>
      import('vue-baidu-map/components/search/LocalSearch.vue'),
    BmMarker: () => import('vue-baidu-map/components/overlays/Marker.vue'),
    BmContextMenu: () =>
      import('vue-baidu-map/components/context-menu/Menu.vue'),
    BmContextMenuItem: () =>
      import('vue-baidu-map/components/context-menu/Item.vue'),
    BmGeolocation: () =>
      import('vue-baidu-map/components/controls/Geolocation.vue'),
    BmNavigation: () =>
      import('vue-baidu-map/components/controls/Navigation.vue'),
    BmAutoComplete: () =>
      import('vue-baidu-map/components/others/AutoComplete.vue'),
    BmControl: () => import('vue-baidu-map/components/controls/Control.vue')
  },

  props: {
    value: {
      type: Object,
      default: () => {
        return {
          lat: null,
          lng: null
        }
      }
    },
    ak: {
      type: String,
      default: process.env.VUE_APP_BAIDU_MAP_AK
    }
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  data() {
    return {
      center: { lng: 112.982273, lat: 28.198535 },
      zoom: 15,
      keyword: '',
      location: '长沙'
    }
  },

  methods: {
    setLocation({ point }) {
      this.$set(this.pointLocation, 'lng', point.lng)
      this.$set(this.pointLocation, 'lat', point.lat)
    },
    mapHandler({ BMap, map }) {
      this.center.lng = _.get(this, 'value.lng', 112.982273)
      this.center.lat = _.get(this, 'value.lat', 28.198535)
      this.zoom = 15
    }
  },

  computed: {
    pointLocation: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style scoped></style>
