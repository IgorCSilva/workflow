<template lang="pug">
  .home
    img(alt="Vue logo", src="../assets/logo.png")
    p(@click="sayHello") Click me to say hello
    
    .row
      .col-xs-2
        .module-box(v-for="(block, index) in modulesFunctions" :key="`${block.module}-${index}`")
          p {{ block.module }}
          .function-box(
            v-for="(functionBlock, index) in block.functions"
            :key="`${functionBlock.name}-${index}`"
            @click="addBlock(block.module, functionBlock.name)"
          )
            p {{ functionBlock.name }} / {{ functionBlock.arity}}

      .col-xs-8
        simple-flowchart(:scene.sync="data" :scale="2" :height="800")
      .col-xs-2
        .arguments-box(v-for="(argumentBlock, index) in listArgumentsBlocks")
          p {{ argumentBlock.module }} {{ argumentBlock.function }}

    button(@click="addedBlocks()") Add block
</template>

<script>
import { mapState } from 'vuex'
import  Home from '@/core/compatibility/Home.js'
import SimpleFlowchart from 'vue-simple-flowchart';
import 'vue-simple-flowchart/dist/vue-flowchart.css';

import { setSequence } from '@/requests/requests'

export default {
  name: 'Home',
  mixins: [Home],
  components: {
    SimpleFlowchart
  },
  data() {
    return {
      listArgumentsBlocks: [],
      data: {
        centerX: 10,
        centerY: 10,
        scale: 1,
        nodes: [
          {
            id: 1,
            x: 200,
            y: 200,
            type: 'Início',
            label: 'Início'
          }
        ],
        links: [
        ]
      },
    };
  },
  computed: {
    ...mapState({
      modulesFunctions: state => state.workflow.modulesFunctions
    })
  },
  methods: {
    addBlock(moduleName, functionName) {
      this.data.nodes.push({
        id: this.getBlockId(),
        x: 100,
        y: 100,
        type: moduleName,
        label: functionName
      })
      console.log(this.data)
    },
    addedBlocks() {
      let nodes = this.data.nodes
      let links = JSON.parse(JSON.stringify(this.data.links)) 
      let listArgumentsBlocks = []
      // console.log(links)
      let currentLink = links.find(l => {
        return l.from == 1
      })
      // console.log(currentLink)
      if (currentLink) {
        links = links.filter(l => {
          return l.from != currentLink.from || l.to != currentLink.to
        })
        // console.log(currentLink.to)
        listArgumentsBlocks.push(nodes.find(n => {
          return n.id == currentLink.to
        }))
        let nextLink = {}
        while(nextLink = links.find(l => { return currentLink.to == l.from})) {
          // console.log(nextLink.to)
          listArgumentsBlocks.push(nodes.find(n => {
            return n.id == nextLink.to
          }))
          currentLink = nextLink
          links = links.filter(l => {
            return l.from != nextLink.from || l.to != nextLink.to
          })
        }
      }

      // Removendo o bloco de início.
      listArgumentsBlocks = listArgumentsBlocks.filter(block => {
        return block.id != 1
      })
      console.log(listArgumentsBlocks)
      console.log('Arity')
      listArgumentsBlocks = listArgumentsBlocks.map(lBlock => {
        let theModule = this.modulesFunctions.find(mf => {
          return mf.module == lBlock.type
        })
        let theFunction = theModule.functions.find(f => {
          return f.name == lBlock.label
        })

        return {
          module: lBlock.type,
          function: theFunction.name,
          arity: theFunction.arity
        }
      })
      this.listArgumentsBlocks = listArgumentsBlocks

      setSequence(listArgumentsBlocks)
        .then(resp => {
          console.log(resp)
        })
        .catch(error => {
          console.error(error)
        })
    },
    getBlockId() {
      let id = 0

      if (this.data.nodes.length == 0) {
        id = 1
      } else {
        for (let block of this.data.nodes) {
          if (block.id >= id) {
            id = block.id
          }
        }

        id += 1
      }

      return id
    }
  }
}
</script>
