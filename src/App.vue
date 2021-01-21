<template lang="pug">
  #app
    component(:is="layout")
      router-view.

    vue-snotify

</template>

<script>
import { mapActions } from 'vuex'
import { getFunctions } from '@/requests/requests'

const DefaultLayout = () => import(/* webpackChunkName: "vsf-layout-default" */ '@/layouts/Default')
const MinimalLayout = () => import(/* webpackChunkName: "vsf-layout-default" */ '@/layouts/Minimal')

export default {
  name: 'App',
  components: {
    DefaultLayout,
    // EmptyLayout,
    MinimalLayout
  },
  computed: {
    layout () {
      let layoutName = `${(this.$route.meta.layout || 'default')}-layout`
      return layoutName
    }
  },
  created() {
    getFunctions()
      .then(resp => {
        console.log(resp)
        if (resp && resp.status == 200) {
          console.log(resp.data)
          this.setModulesFunctions(resp.data.data)
        }
      })
      .catch(error => {
        console.error(error)
      })
  },
  methods: {
    ...mapActions({
      setModulesFunctions: 'workflow/setModulesFunctions'
    })
  }
  
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
