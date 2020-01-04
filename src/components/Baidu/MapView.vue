<template>
  <baidu-map
    class="w-full rounded-lg"
    :zoom="zoom"
    @ready="mapHandler"
    :ak="ak"
    :center="location"
    scroll-wheel-zoom
  >
    <bm-marker v-show="location.lng" :position="location" :dragging="true">
    </bm-marker>
    <bm-view
      class="w-full rounded-lg overflow-hidden"
      style="height:300px;"
    ></bm-view>

    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
  </baidu-map>
</template>

<script>
export default {
  name: 'MapView',
  components: {
    BaiduMap: () => import('vue-baidu-map/components/map/Map.vue'),
    BmView: () => import('vue-baidu-map/components/map/MapView.vue'),
    BmMarker: () => import('vue-baidu-map/components/overlays/Marker.vue'),

    BmNavigation: () =>
      import('vue-baidu-map/components/controls/Navigation.vue')
  },

  props: {
    location: {
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

  data() {
    return {
      center: { lng: 112.982273, lat: 28.198535 },
      zoom: 15
    }
  },

  methods: {
    mapHandler() {
      this.center.lng = _.get(this, 'location.lng')
      this.center.lat = _.get(this, 'location.lat')
      this.zoom = 15
    }
  }
}
</script>

<style scoped></style>
