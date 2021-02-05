<template lang="pug">
  .home
    img(alt="Vue logo", src="../assets/logo.png")
    p(@click="sayHello") Click me to say hello

    .create-sequence
      h3 Cria uma sequência
      
      input(v-model="newSequenceName" placeholder="Nome da sequência")
      button(@click="createNewSequence()") Criar

    .sequences-buttons
      h4 Lista de sequências existentes
      //- p {{ sequences }}
      .sequence-button(v-for="(sequence, index) in sequences" :key="sequence + index" @click="selectSequence(sequence)")
        span {{ sequence.name }}

    .row
      .col-xs-2
        .module-box(v-for="moduleBlock in modulesFunctions" :key="moduleBlock.id")
          .module-title
            span {{ moduleBlock.label }}
            Tooltip.tooltip {{ moduleBlock.description }}

          .function-box(
            v-for="functionBlock in moduleBlock.functions"
            :key="functionBlock.id"
            @click="addBlock(moduleBlock.label, functionBlock.label)"
          )
            p {{ functionBlock.label }} / {{ functionBlock.arity}}

      .col-xs-8
        simple-flowchart(:scene.sync="currentSequence" :height="800")
      .col-xs-2
        .arguments-box(v-for="(sequenceBlocks, index) in listSequenceBlocks")
          p {{ sequenceBlocks.module }} {{ sequenceBlocks.function }}

    button(v-if="currentSequence.id" @click="validateSequence('update')") Update sequence
    button(v-else @click="validateSequence('create')") Create sequence
</template>

<script>
import { mapState, mapActions } from 'vuex'
import  Home from '@/core/compatibility/Home.js'
import SimpleFlowchart from 'vue-simple-flowchart';
import 'vue-simple-flowchart/dist/vue-flowchart.css';

// Components.
import Tooltip from '@/components/Tooltip.vue'

// Mixins.
import Notifications from '@/core/compatibility/Notifications.js'

import { 
  setSequence,
  updateSequence
} from '@/requests/requests'

export default {
  name: 'Home',
  mixins: [Home, Notifications],
  components: {
    SimpleFlowchart,
    Tooltip
  },
  data() {
    return {
      newSequenceName: '',
      listSequenceBlocks: [],
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
    createNewSequence() {
      console.log(this.newSequenceName, this.sequences)
      let sequence = this.sequences.find(s => {
        return s.name === this.newSequenceName
      })

      if (sequence == undefined) {
        this.sequences.push({
          id: null,
          description: '',
          name: this.newSequenceName,
          links: [],
          blocks: []
        })
      }
    },
    selectSequence(sequence) {
      console.log(sequence, this.modulesFunctions)
      let moduleBlock = {}
      let functionBlock = {}

      let nodes = []
      if (sequence.blocks.length > 0) {

        // Removendo blocos com ids repetidos, já que no back eles são salvos assim.
        let uniqueBlocks = []
        let currentBlock = {}
        for (let b of sequence.blocks) {
          currentBlock = uniqueBlocks.find(ub => {
            return ub.workflow_block_id === b.workflow_block_id
          })
          if (currentBlock == undefined) {
            uniqueBlocks.push(b)
          }
        }
        
        // Montando nós para alimentar o fluxograma.
        nodes = uniqueBlocks.map(block => {
          moduleBlock = this.modulesFunctions.find(mb => {
            functionBlock = mb.functions.find(fb => {
              return fb.id == block.function_id
            })

            return functionBlock
          })


          return {
            id: block.workflow_block_id,
            x: block.workflow_block_pos_x,
            y: block.workflow_block_pos_y,
            type: moduleBlock.label,
            label: functionBlock.label
          }
        })
      }
      

      let links = sequence.links.map(link => {
        return {
          id: link.workflow_link_id,
          from: link.from,
          to: link.to
        }
      })

      let currentSequence = {
        id: sequence.id,
        name: sequence.name,
        centerX: 10,
        centerY: 10,
        scale: 1,
        nodes: [this.initialBlock].concat(nodes),
        links
      }
      console.log(currentSequence)
      this.setCurrentSequence(currentSequence)

    },
    availableFunctions() {
      let functions = []

      for (let moduleBlock of this.modulesFunctions) {
        functions = functions.concat(moduleBlock.functions)
      }

      return functions
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
    verifySequence() {
      let nodes = this.currentSequence.nodes
      let links = JSON.parse(JSON.stringify(this.currentSequence.links))

      let listSequenceBlocks = []
      // Pegando o link inicial.
      let currentLink = links.find(l => {
        return l.from == 1
      })

      if (currentLink) {
        // Removendo o link da lista de links.
        links = links.filter(l => {
          return l.from != currentLink.from || l.to != currentLink.to
        })
        
        listSequenceBlocks.push(nodes.find(n => {
          return n.id == currentLink.to
        }))

        let nextLink = {}
        while(nextLink = links.find(l => { return currentLink.to == l.from})) {
          // console.log(nextLink.to)
          listSequenceBlocks.push(nodes.find(n => {
            return n.id == nextLink.to
          }))
          currentLink = nextLink
          links = links.filter(l => {
            return l.from != nextLink.from || l.to != nextLink.to
          })
        }
      }

      // Removendo o bloco de início.
      listSequenceBlocks = listSequenceBlocks.filter(block => {
        return block.id != 1
      })
      
      listSequenceBlocks = listSequenceBlocks.map(lBlock => {
        let theModule = this.modulesFunctions.find(mf => {
          return mf.label == lBlock.type
        })
        let theFunction = theModule.functions.find(f => {
          return f.label == lBlock.label
        })

        return {
          id: lBlock.id,
          functionId: theFunction.id,
          x: lBlock.x,
          y: lBlock.y
        }
      })
      this.listSequenceBlocks = listSequenceBlocks

      let sequenceToSave = {
        sequence: listSequenceBlocks,
        links: this.currentSequence.links
      }
      
      return sequenceToSave
    },
    validateSequence (action) {
      console.log('ACTION: ', action)
      let validSequence = false

      let functions = this.availableFunctions()
      let sequenceFunctions = (this.verifySequence().sequence).map(f => {
        let fc = functions.find(func => {
          return func.id == f.functionId
        })
        
        return fc
      })
      
      if (sequenceFunctions.length == 0) {
        console.log('A sequência está vazia.')
      } else if (sequenceFunctions.length == 1) {
        validSequence = true
      } else {
        let parsedArgument = null
        let matchResponseArgument = false
        let someNoMatch = false

        for (let i = 1; i < sequenceFunctions.length; i++) {
          console.log(sequenceFunctions[i - 1].responsesType, sequenceFunctions[i].argumentsType, (sequenceFunctions[i].argumentsType).length == 0)

          if (sequenceFunctions[i - 1].responsesType.length == 0 ||
              (sequenceFunctions[i].argumentsType).length == 0) {

            matchResponseArgument = true
          } else {
            matchResponseArgument = sequenceFunctions[i - 1].responsesType[0] == (sequenceFunctions[i].argumentsType)[0]

            if (!matchResponseArgument) {
              try {
                parsedArgument = (sequenceFunctions[i].argumentsType)[0].replaceAll(' ', '').split(',')
                matchResponseArgument = parsedArgument.includes(sequenceFunctions[i - 1].responsesType[0])
              } catch (error) {
                matchResponseArgument = false
                console.log(error)
              }
            }
          }
           
          console.log(matchResponseArgument)
          if (!matchResponseArgument) {
            someNoMatch = true
          }
        }

        validSequence = !someNoMatch
      }

      if (!validSequence) {
        this.notifInvalidSequence()
      } else {
        this.notifValidSequence()
        if (action == 'update') {
          this.updateCurrentSequence()
        }
      }
    },
    saveCurrentSequence() {
      let sequenceToSave = this.verifySequence()
      sequenceToSave.name = this.currentSequence.name

      console.log(sequenceToSave)
      setSequence(sequenceToSave)
        .then(resp => {
          console.log(resp)
        })
        .catch(error => {
          console.error(error)
        })
    },
    updateCurrentSequence() {
      updateSequence(this.verifySequence(), this.currentSequence.id)
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

<style lang="scss" scoped>
.sequence-button {
  cursor: pointer;
  border: 2px dotted skyblue;
  border-radius: 15px;
  margin: 5px auto;
  padding: 5px;
  max-width: 200px;
}
.module-box {
  border: 2px solid orange;
  border-radius: 10px;
  margin: 10px 3px;
  padding: 5px;
}
.module-title {
  margin-top: 10px;
  margin-bottom: 20px;
}
.module-title .tooltip {
  margin-left: 10px;
}

.function-box {
  cursor: pointer;
  border: 2px dotted skyblue;
  border-radius: 15px;
  margin: 5px 0;
  padding: 5px;
}
</style>