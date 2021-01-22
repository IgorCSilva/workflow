<template lang="pug">
  .home
    img(alt="Vue logo", src="../assets/logo.png")
    p(@click="sayHello") Click me to say hello
    

    .sequences-buttons
      h4 Lista de sequências existentes
      //- p {{ sequences }}
      .sequence-button(v-for="(sequence, index) in sequences" :key="sequence + index")
        span(@click="selectSequence(sequence)") {{ sequence.name }}

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
        simple-flowchart(:scene.sync="currentSequence" :height="800")
      .col-xs-2
        .arguments-box(v-for="(argumentBlock, index) in listArgumentsBlocks")
          p {{ argumentBlock.module }} {{ argumentBlock.function }}

    button(@click="addedBlocks()") Add block
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
      initialBlock:{
        id: 1,
        x: 200,
        y: 200,
        type: 'Início',
        label: 'Início'
      },
    };
  },
  computed: {
    ...mapState({
      modulesFunctions: state => state.workflow.modulesFunctions,
      sequences: state => state.workflow.sequences,
      currentSequence: state => state.workflow.currentSequence
    })
  },
  methods: {
    ...mapActions({
      setCurrentSequence: 'workflow/setCurrentSequence'
    }),
    selectSequence(sequence) {
      console.log(sequence.sequence.sequence)

      let nodes = sequence.sequence.sequence.map(s => {
        return {
          id: s.id,
          x: s.x,
          y: s.y,
          type: s.module,
          label: s.function
        }
      })

      let links = sequence.sequence.links

      let currentSequence = {
        centerX: 10,
        centerY: 10,
        scale: 1,
        nodes: [this.initialBlock].concat(nodes),
        links
      }
      console.log(currentSequence)
      this.setCurrentSequence(currentSequence)

    },
    addBlock(moduleName, functionName) {
      console.log(this.currentSequence)
      this.currentSequence.nodes.push({
        id: this.getBlockId(),
        x: 100,
        y: 100,
        type: moduleName,
        label: functionName
      })
      // console.log(this.data)
    },
    addedBlocks() {
      let nodes = this.currentSequence.nodes
      let links = JSON.parse(JSON.stringify(this.currentSequence.links)) 
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
          id: lBlock.id,
          module: lBlock.type,
          function: theFunction.name,
          arity: theFunction.arity,
          x: lBlock.x,
          y: lBlock.y
        }
      })
      this.listArgumentsBlocks = listArgumentsBlocks

      let sequenceToSave = {
        sequence: listArgumentsBlocks,
        links: this.currentSequence.links
      }
      setSequence(sequenceToSave)
        .then(resp => {
          console.log(resp)
        })
        .catch(error => {
          console.error(error)
        })
    },
    getBlockId() {
      let id = 0
      let nodes = this.currentSequence.nodes
      if (nodes.length == 0) {
        id = 1
      } else {
        for (let block of nodes) {
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
