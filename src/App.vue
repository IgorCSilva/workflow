<template lang="pug">
  #app
    component(:is="layout")
      router-view.

    vue-snotify

</template>

<script>
import { eventBus } from '@/main.ts'

import { mapActions } from 'vuex'
import { 
  getModules,
  getFunctions,
  getSequences  
} from '@/requests/requests'

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
    // Buscando módulos disponíveis para manipulação.
    getModules()
      .then(resp => {
        console.log(resp)
        if (resp && resp.status == 200) {
          console.log('modules: ', resp.data)
          this.setModulesFunctions(resp.data.data)

          // Buscando sequências já existentes.
          getSequences()
            .then(resp => {
              console.log(resp)
              if (resp && resp.status == 200) {
                console.log('sequences: ', resp.data)
                this.setSequences(resp.data.data)

                eventBus.$emit('create-sortables')
              }
            })
            .catch(error => {
              console.error(error)
            })
        }
      })
      .catch(error => {
        console.error(error)
      })

    

    // getFunctions()
    //   .then(resp => {
    //     console.log(resp)
    //     if (resp && resp.status == 200) {
    //       console.log(resp.data)
    //       this.setModulesFunctions(resp.data.data)
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error)
    //   })
  },
  methods: {
    ...mapActions({
      setModulesFunctions: 'workflow/setModulesFunctions',
      setSequences: 'workflow/setSequences'
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
