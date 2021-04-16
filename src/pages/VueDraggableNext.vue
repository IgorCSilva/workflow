<template lang="pug">
  .vue-draggable
    //- h1 DRAGGABLE
    //- #simpleList.list-group.row
    //-   .list-group-item(v-for="item in myArray" :key="item.id")
    //-     span.glyphicon-move  X 
    //-     span {{ item.name }}


    //- button(@click="addItem") Add item
    button.m10(@click="showList") Show List
    button(@click="validateSequence('oi')") Validate Sequence
    button(@click="saveCurrentSequence") Set sequence


    .home
      img(alt="Vue logo", src="../assets/logo.png")
      p Click me to say hello

      .create-sequence
        h3 Cria uma sequência
        
        input(v-model="newSequenceName" placeholder="Nome da sequência")
        button(@click="createNewSequence()") Criar

      .sequences-buttons
        h4 Lista de sequências existentes
        
        .sequence-button(
          v-for="(sequence, index) in sequences"
          :key="sequence + index"
          @click="selectSequence(sequence)"
          :style="{border: sequence.name == currentSequence.name ? '2px solid red' : ''}"
        )
          span {{ sequence.name }}

      .row
        #module-box.col-xs-2
          .module-box(v-for="moduleBlock in getModulesFunction" :key="moduleBlock.id")
            .module-title
              span {{ moduleBlock.label }}
              //- Tooltip.tooltip {{ moduleBlock.description }}

            .list-function-box(:id="functionIdPrefix + moduleBlock.id")
              .function-box(
                v-for="functionBlock in moduleBlock.functions"
                :key="functionBlock.id"
                :id="JSON.stringify(functionBlock)"
              )
                p {{ functionBlock.label }} / {{ functionBlock.arity}}
                .description-box
                  p {{ functionBlock.description }}

        .col-xs-8
          #sequence-area.sequence-area-box
            //- .sequence-block(
            //-   v-for="sequenceBlock in localCurrentSequence"
            //-   :key="sequenceBlock.id + sequenceBlock.position"
            //- ) {{ sequenceBlock.id}}
        .col-xs-2
          //- p {{ currentSequence }}
          h4 Lixeira
          #trash-area

      //- button(v-if="currentSequence.id" @click="validateSequence('update')") Update sequence
      //- button(v-else @click="validateSequence('create')") Create sequence
</template>


<script>
// link: http://sortablejs.github.io/Sortable/

import { eventBus } from '@/main.ts'
import { mapState, mapGetters, mapActions } from 'vuex'
import Sortable from '@/sortable/sortable.js'

// Mixins.
import Notifications from '@/core/compatibility/Notifications.js'

// Functions.
import { 
  setSequence,
  updateSequence
} from '@/requests/requests'

export default {
  name: 'VueDraggableNext',
  beforeMount () {
    eventBus.$on('create-sortables', this.createSortables)
  },
  beforeDestroy () {
    eventBus.$off('create-sortables', this.createSortables)
  },
  mixins: [Notifications],
  data () {
    return {
      functionIdPrefix: 'function-box',
      newSequenceName: '',
      localCurrentSequence: []
    }
  },
  computed: {
    ...mapState({
      modulesFunctions: state => state.workflow.modulesFunctions,
      sequences: state => state.workflow.sequences,
      currentSequence: state => state.workflow.currentSequence
    }),
    ...mapGetters({
      getModulesFunction: 'workflow/getModulesFunction'
    })
  },
  methods: {
    ...mapActions({
      setCurrentSequence: 'workflow/setCurrentSequence'
    }),
    createSortables () {
      let sequenceArea = document.getElementById('sequence-area')
      let trashArea = document.getElementById('trash-area')
      let self = this
      
      // Criando Sortables para os blocos das funções.
      for (let moduleBlock of this.getModulesFunction) {
        let functionList = document.getElementById(this.functionIdPrefix + moduleBlock.id)

        Sortable.create(functionList, {
          group: {
            name: 'mount-sequence',
            pull: 'clone',
            put: false
          },
          sort: false,
          animation: 600,
          ghostClass: 'ghost-class',
          onEnd: function (/**Event*/evt) {
            // var itemEl = evt.item;  // dragged HTMLElement
            // evt.to;    // target list
            // evt.from;  // previous list
            // evt.oldIndex;  // element's old index within old parent
            // evt.newIndex;  // element's new index within new parent
            // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
            // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
            // evt.clone // the clone element
            // evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
            
            // // Removendo da lista o item movido.
            // let choosedItem = self.myArray.splice(evt.oldIndex, 1)
            // // Colocando na lista o item movido, na sua nova posição.
            // self.myArray.splice(evt.newIndex, 0, choosedItem[0])
          }
        });
      }

      // Criando Sortable da sequência.
      Sortable.create(sequenceArea, {
        group: 'mount-sequence',
        animation: 600,
        ghostClass: 'sequence-block',
        onAdd: function (/**Event*/evt) {
          console.log('ON ADD')
          // var itemEl = evt.item;  // dragged HTMLElement
          // evt.to;    // target list
          // evt.from;  // previous list
          // evt.oldIndex;  // element's old index within old parent
          // evt.newIndex;  // element's new index within new parent
          // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
          // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
          // evt.clone // the clone element
          // evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving

          // console.log(evt)
          
          console.log('Function id: ', evt.item.id, evt.newDraggableIndex)

          let tempCurrentSequence = JSON.parse(JSON.stringify(self.localCurrentSequence))

          // Tive que colocar esta parte porque estava aparecendo null quando se adicionava as funções.
          tempCurrentSequence = tempCurrentSequence.filter(el => {
            return el
          })

          // console.log('function by id: ', this.getFunctionById(evt.item.id))
          console.log(tempCurrentSequence)
          tempCurrentSequence.splice(
            evt.newDraggableIndex,
            0,
            {
              ...(JSON.parse(evt.item.id)),
              position: 0
            }
          )

          // for (let i = 0; i < tempCurrentSequence.length; i++) {
          //   tempCurrentSequence[i].position = i
          // }

          self.localCurrentSequence = tempCurrentSequence

          // Removendo item para que não influencie na definição das posições dos elementos.
          // evt.item.remove()
        },
        onEnd: function (/**Event*/evt) {
          console.log('ON END')
          // var itemEl = evt.item;  // dragged HTMLElement
          // evt.to;    // target list
          // evt.from;  // previous list
          // evt.oldIndex;  // element's old index within old parent
          // evt.newIndex;  // element's new index within new parent
          // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
          // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
          // evt.clone // the clone element
          // evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving

          // document.getElementsByClassName('sequence-')
          console.log('De ' + evt.oldIndex + ' para ' + evt.newIndex)
          
          let tempCurrentSequence = JSON.parse(JSON.stringify(self.localCurrentSequence))
          // Removendo da lista o item movido.
          let choosedItem = tempCurrentSequence.splice(evt.oldIndex, 1)
          // Colocando na lista o item movido, na sua nova posição.
          tempCurrentSequence.splice(evt.newIndex, 0, choosedItem[0])

          self.localCurrentSequence = tempCurrentSequence
        }
      })

      // Criando Sortable da lixeira.
      Sortable.create(trashArea, {
        group: 'mount-sequence',
        animation: 600,
        ghostClass: 'sequence-block',
        onAdd: function (/**Event*/evt) {
          console.log('ON ADD')
          // var itemEl = evt.item;  // dragged HTMLElement
          // evt.to;    // target list
          // evt.from;  // previous list
          // evt.oldIndex;  // element's old index within old parent
          // evt.newIndex;  // element's new index within new parent
          // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
          // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
          // evt.clone // the clone element
          // evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving

          // console.log(evt)
          
          console.log('Function id: ', evt.item, evt.oldDraggableIndex)

          let tempCurrentSequence = JSON.parse(JSON.stringify(self.localCurrentSequence))

          // Tive que colocar esta parte porque estava aparecendo null quando se removia as funções.
          tempCurrentSequence = tempCurrentSequence.filter(el => {
            return el
          })
          
          console.log(tempCurrentSequence)
          // // console.log('function by id: ', this.getFunctionById(evt.item.id))

          // if (tempCurrentSequence.length > 1) {
            tempCurrentSequence.splice(
              evt.oldDraggableIndex,
              1
            )
            console.log('ti', tempCurrentSequence)

          // } else {
          //   tempCurrentSequence = []
          //   console.log('t', tempCurrentSequence)
          // }

          // for (let i = 0; i < tempCurrentSequence.length; i++) {
          //   tempCurrentSequence[i].position = i
          // }

          self.localCurrentSequence = tempCurrentSequence
          console.log(self.localCurrentSequence)
          // Removendo item para que não influencie na definição das posições dos elementos.
          evt.item.remove()
        }
      })
    },
    removeAllChildren (comp) {
      // Removendo todos os componentes que estão na área de sequência.
      while (comp.firstChild) {
        comp.removeChild(comp.firstChild)
      }
    },
    createNewSequence() {
      console.log(this.newSequenceName, this.sequences)
      let sequence = this.sequences.find(s => {
        return s.name === this.newSequenceName
      })

      if (sequence == undefined) {
        this.sequences.push({
          description: '',
          name: this.newSequenceName,
          functions_sequence: []
        })

        this.localCurrentSequence = []
        // Componente da área de sequências.
        let sequenceArea = document.getElementById('sequence-area')
        // Removendo todos os componentes da área de sequência.
        this.removeAllChildren(sequenceArea)
      }

      this.setCurrentSequence({
        name: this.newSequenceName,
        description: '',
        functions_sequence: this.localCurrentSequence.map(f => {return f.id})
      })
    },
    availableFunctions() {
      let functions = []

      for (let moduleBlock of this.modulesFunctions) {
        functions = functions.concat(moduleBlock.functions)
      }

      return functions
    },
    selectSequence(sequence) {
      console.log(sequence, this.modulesFunctions)
      this.setCurrentSequence(sequence)
      
      // Montando sequência de funções.
      let objFunctionsSequence = sequence.functions_sequence.map(fid => {
        return (this.availableFunctions()).find(f => {
          return f.id == fid
        })
      })

      // Setando a sequência de funções de acordo com a sequência selecionada.
      this.localCurrentSequence = objFunctionsSequence
      console.log('Sequencia de funções: ', objFunctionsSequence)

      let fb = null
      let desc = null
      let el_p = null
      let t = null

      // Componente da área de sequências.
      let sequenceArea = document.getElementById('sequence-area')
      // Removendo todos os componentes da área de sequência.
      this.removeAllChildren(sequenceArea)

      for(let func of objFunctionsSequence) {
        console.log(func.label)

        // Criando function box.
        fb = document.createElement('div')
        fb.classList.add('function-box')
        // Criando description.
        desc = document.createElement('div')
        desc.classList.add('description-box')

        t = document.createTextNode(func.description)
        el_p = document.createElement('p')
        el_p.appendChild(t)
        desc.appendChild(el_p)


        fb.appendChild(desc)
        fb.style['-webkit-scrollbar'] = 'display: none;'
        fb.style.cssText = `cursor: move;
          display: inline-block;
          width: calc(20% - 30px);
          max-width: 200px;
          height: 120px;
          overflow-y: scroll;
          padding: 10px;
          margin: 5px;
          border-radius: 6px;
          background-color: #fff;
        `
        // Adicionando componente na área de sequência.
        sequenceArea.appendChild(fb)
      }

    },
    showList () {
      for (let item of this.localCurrentSequence.filter(el => {
        return el
      })) {
        console.log(item.label)
      }
    },
    validateSequence (cleanedSeq) {
      let validSequence = false

      // Tive que colocar esta parte pq estava aparecendo undefined quando removia as funções da lista.
      let sequenceFunctions = cleanedSeq
      
      if (sequenceFunctions.length == 0) {
        console.log('A sequência está vazia.')
      } else if (sequenceFunctions.length == 1) {
        validSequence = true
      } else {
        let parsedArgument = null
        let matchResponseArgument = false
        let someNoMatch = false

        for (let i = 1; i < sequenceFunctions.length; i++) {
          // console.log(sequenceFunctions[i - 1].responsesType, sequenceFunctions[i].argumentsType, (sequenceFunctions[i].argumentsType).length == 0)

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
        return false
      } else {
        this.notifValidSequence()
        return true
      }
    },
    saveCurrentSequence() {

      let cleanedSeq = this.cleanLocalCurrentSequence()
      let isValidSequence = this.validateSequence(cleanedSeq)
      if (isValidSequence) {
        
        let currSequence = this.currentSequence
        console.log('SAVE', this.localCurrentSequence)
        currSequence.functions_sequence = cleanedSeq.map(f => {
          return f.id
        })

        console.log(currSequence)
        
        if (currSequence.id) {
          console.log('UPDATE SEQUENCE')
          updateSequence(currSequence)
            .then(resp => {
              console.log(resp)
            })
            .catch(error => {
              console.error(error)
            })
        } else {
          console.log('CREATE SEQUENCE')
          setSequence(currSequence)
            .then(resp => {
              console.log(resp)
            })
            .catch(error => {
              console.error(error)
            })
        }
      }
    },
    cleanLocalCurrentSequence() {
      return this.localCurrentSequence.filter(el => {
        return el
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.vue-draggable {
  // max-height: 100vh;
  padding-bottom: 40px;
}
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

.list-function-box {
  .function-box {
    cursor: pointer;
    border: 2px dotted skyblue;
    border-radius: 15px;
    margin: 5px 0;
    padding: 5px;

    .description-box {
      display: none;
    }
  }
}
.sequence-area-box {
  background-color: #ddf;
  border: 2px solid purple;
  width: 100%;
  height: 100%;
  text-align: start;

  .function-box {
    cursor: move;
    display: inline-block;
    width: calc(20% - 30px);
    max-width: 200px;
    height: 100px;
    overflow-y: scroll;
    padding: 10px;
    margin: 5px;
    border-radius: 6px;
    background-color: #fff;
  }

  .function-box::-webkit-scrollbar {
    display: none;
  }
}

#trash-area {
  width: 100%;
  height: 300px;
  border: 2px dashed #faa;
}
</style>