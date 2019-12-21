<template>
  <div class="bg-gray-100">
    <div class="sm:hidden">
      <!-- Off-canvas menu background overlay -->
      <transition
        enter-class="opacity-0"
        enter-active-class="ease-out transition-medium"
        enter-to-class="opacity-100"
        leave-class="opacity-100"
        leave-active-class="ease-out transition-medium"
        leave-to-class="opacity-0"
        appear
      >
        <div
          v-show="sidebarOpen"
          class="z-100 fixed inset-0 transition-opacity"
        >
          <div
            @click="close"
            class="absolute inset-0 bg-black opacity-50"
            tabindex="-1"
          ></div>
        </div>
      </transition>
    </div>
    <div
      :class="
        sidebarOpen
          ? 'translate-x-0 ease-out transition-slow'
          : '-translate-x-full ease-in transition-medium'
      "
      class="z-100 lg:sticky lg:top-16 inset-y-0 fixed left-0 w-64 bg-gray-100 border-r overflow-y-auto  scrolling-touch sm:static sm:block sm:translate-x-0 sm:transition-none"
    >
      <div class="absolute top-0 left-0 pl-4 pt-3 sm:hidden">
        <button @click="close" class="block text-gray-600 hover:text-gray-800">
          <svg viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
            <path
              d="M17.293 18.707a1 1 0 001.414-1.414L13.414 12l5.293-5.293a1 1 0 00-1.414-1.414L12 10.586 6.707 5.293a1 1 0 00-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 101.414 1.414L12 13.414l5.293 5.293z"
            ></path>
          </svg>
        </button>
      </div>
      <nav class="mt-8 ">
        <div class="px-6 sm:hidden">
          <a href="#" class="block py-1  text-sm font-medium text-gray-900">
            Mailbox
          </a>
          <a
            href="#"
            class="mt-2 block py-1  text-sm font-medium text-gray-900"
          >
            Customers
          </a>
          <a
            href="#"
            class="mt-2 block py-1  text-sm font-medium text-gray-900"
          >
            Reporting
          </a>
          <a
            href="#"
            class="mt-2 block py-1  text-sm font-medium text-gray-900"
          >
            Manage
          </a>
        </div>

        <div class="mt-8 px-6">
          <template v-for="(items, group) in availableMenu">
            <h2
              :key="randomKey(group)"
              class="text-xs font-semibold text-gray-600 uppercase tracking-wide select-none"
            >
              {{ group }}
            </h2>
            <div class="mt-3 mb-3" :key="randomKey(group)">
              <router-link
                v-for="item in items"
                :key="item.name"
                :to="{ name: item.name }"
                class="mt-2 -mx-3 px-3 py-2 flex items-center justify-between text-sm font-medium  rounded-lg hover:bg-gray-200"
                ><span class="inline-flex">
                  <IIcon
                    v-if="item.meta.icon"
                    :type="item.meta.icon"
                    class="text-gray-500"
                  />
                  <span class="ml-2 text-gray-500">{{
                    getTitle(item)
                  }}</span></span
                ></router-link
              >
            </div>
          </template>
          <!-- <h2
            class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
          >
            Mailboxes
          </h2>
          <div class="mt-3">
            <a
              href="#"
              class="-mx-3 px-3 py-2 flex items-center justify-between text-sm font-medium bg-gray-200 rounded-lg"
              ><span class="inline-flex"
                ><svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current text-gray-700"
                >
                  <path
                    d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm3-1a1 1 0 00-1 1v6h1.586A2 2 0 018 12.586L10.414 15h3.172L16 12.586A2 2 0 0117.414 12H19V6a1 1 0 00-1-1H6zm13 9h-1.586L15 16.414a2 2 0 01-1.414.586h-3.172A2 2 0 019 16.414L6.586 14H5v4a1 1 0 001 1h12a1 1 0 001-1v-4z"
                  ></path>
                </svg>
                <span class="ml-2 text-gray-900">Inbox</span></span
              >
              <span
                class="inline-block w-9 text-center py-1 leading-none text-xs font-semibold text-gray-700 bg-gray-300 rounded-full"
              >
                6
              </span></a
            >
            <a
              href="#"
              class="mt-2 -mx-3 px-3 py-2 flex items-center justify-between text-sm font-medium hover:bg-gray-200 rounded-lg"
              ><span class="inline-flex">
                <IIcon type="i-flag" class="text-gray-500" />
                <span class="ml-2 text-gray-700">Flagged</span></span
              ></a
            >
            <a
              href="#"
              class="mt-2 -mx-3 px-3 py-2 flex items-center justify-between text-sm font-medium hover:bg-gray-200 rounded-lg"
              ><span class="inline-flex">
                <IIcon type="i-edit" class="text-gray-500 w-6 h-6" />
                <span class="ml-2 text-gray-700">Drafts</span></span
              >
              <span
                class="inline-block w-9 text-center py-1 leading-none text-xs font-semibold text-gray-700 bg-gray-300 rounded-full"
              >
                2
              </span></a
            >
            <a
              href="#"
              class="mt-2 -mx-3 px-3 py-2 flex items-center justify-between text-sm font-medium hover:bg-gray-200 rounded-lg"
              ><span class="inline-flex"
                ><svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current text-gray-500"
                >
                  <path
                    d="M12 4a8 8 0 00-6.598 12.526A14.943 14.943 0 0112 15c2.366 0 4.606.548 6.598 1.526A8 8 0 0012 4zm5.199 14.08A12.954 12.954 0 0012 17c-1.85 0-3.607.386-5.199 1.08A7.968 7.968 0 0012 20c1.985 0 3.8-.723 5.199-1.92zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm10-4a2 2 0 100 4 2 2 0 000-4zm-4 2a4 4 0 118 0 4 4 0 01-8 0z"
                  ></path>
                </svg>
                <span class="ml-2 text-gray-700">Assigned</span></span
              >
              <span
                class="inline-block w-9 text-center py-1 leading-none text-xs font-semibold text-gray-700 bg-gray-300 rounded-full"
              >
                1
              </span></a
            >
            <a
              href="#"
              class="mt-2 -mx-3 px-3 py-2 flex items-center justify-between text-sm font-medium hover:bg-gray-200 rounded-lg"
              ><span class="inline-flex"
                ><svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current text-gray-500"
                >
                  <path
                    d="M12 4a8 8 0 100 16 8 8 0 000-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm13.707-2.707a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L11 12.586l3.293-3.293a1 1 0 011.414 0z"
                  ></path>
                </svg>
                <span class="ml-2 text-gray-700">Closed</span></span
              ></a
            >
            <a
              href="#"
              class="mt-2 -mx-3 px-3 py-2 flex items-center justify-between text-sm font-medium hover:bg-gray-200 rounded-lg"
              ><span class="inline-flex"
                ><svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current text-gray-500"
                >
                  <path
                    d="M2 6a3 3 0 013-3h14a3 3 0 011 5.83V18a3 3 0 01-3 3H7a3 3 0 01-3-3V8.83A3.001 3.001 0 012 6zm4 3v9a1 1 0 001 1h10a1 1 0 001-1V9H6zM5 5a1 1 0 000 2h14a1 1 0 100-2H5zm4 7a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z"
                  ></path>
                </svg>
                <span class="ml-2 text-gray-700">Junk</span></span
              ></a
            >
          </div> -->
          <!-- <h2
            class="mt-8 text-xs font-semibold text-gray-600 uppercase tracking-wide"
          >
            Folders
          </h2>
          <div class="mt-4">
            <a href="#" class="block text-sm font-medium text-gray-700">
              Refunds
            </a>
            <a href="#" class="mt-4 block text-sm font-medium text-gray-700">
              Discounts
            </a>
            <a href="#" class="mt-4 block text-sm font-medium text-gray-700">
              Bugs
            </a>
          </div> -->
        </div>
        <div class="mt-8 p-6 border-t sm:hidden">
          <div class="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=144&amp;h=144&amp;q=80"
              alt=""
              class="h-8 w-8 rounded-full object-cover"
            />
            <span class="ml-4 mr-2 text-sm font-medium text-gray-800">
              Monica White
            </span>
          </div>
          <div class="mt-4">
            <a href="#" class="block text-sm font-medium text-gray-700">
              Settings
            </a>
            <a href="#" class="mt-4 block text-sm font-medium text-gray-700">
              Log out
            </a>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  methods: {
    close() {
      this.$store.commit('TOGGLE_SIDEBAR', false)
    },
    filterAvailableMenu(routers) {
      return _.reduce(
        routers,
        (res, item) => {
          if (_.has(item, 'hidden') && !item.hidden) {
            res.push(item)
            return res
          }
          if (_.has(item, 'children')) {
            res.push(...this.filterAvailableMenu(item.children))
          }
          return res
        },
        []
      )
    },
    randomKey(key) {
      return _.uniqueId(key)
    },
    getTitle(item) {
      return _.get(item, 'meta.Title', item.name)
    }
  },
  computed: {
    ...mapGetters(['sidebarOpen', 'routers']),
    availableMenu() {
      return _.groupBy(this.filterAvailableMenu(this.routers), 'meta.Group')
    }
  }
}
</script>

<style></style>
