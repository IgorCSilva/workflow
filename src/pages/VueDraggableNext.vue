<template lang="pug">
  .vue-draggable
    //- h1 DRAGGABLE
    //- #simpleList.list-group.row
    //-   .list-group-item(v-for="item in myArray" :key="item.id")
    //-     span.glyphicon-move  X 
    //-     span {{ item.name }}


    //- button(@click="addItem") Add item
    button(@click="showList") Show List

    .home
      img(alt="Vue logo", src="../assets/logo.png")
      p Click me to say hello

      .create-sequence
        h3 Cria uma sequência
        
        //- input(v-model="newSequenceName" placeholder="Nome da sequência")
        //- button(@click="createNewSequence()") Criar

      .sequences-buttons
        h4 Lista de sequências existentes
        
        //- .sequence-button(v-for="(sequence, index) in sequences" :key="sequence + index" @click="selectSequence(sequence)")
        //-   span {{ sequence.name }}

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
                :id="functionBlock.id"
              )
                p {{ functionBlock.label }} / {{ functionBlock.arity}}

        .col-xs-8
          #sequence-area.sequence-area-box
            .sequence-block(
              v-for="sequenceBlock in localCurrentSequence"
              :key="sequenceBlock.id + sequenceBlock.position"
            ) {{ sequenceBlock.id}}
        .col-xs-2
          //- .arguments-box(v-for="(sequenceBlocks, index) in listSequenceBlocks")
          //-   p {{ sequenceBlocks.module }} {{ sequenceBlocks.function }}

      //- button(v-if="currentSequence.id" @click="validateSequence('update')") Update sequence
      //- button(v-else @click="validateSequence('create')") Create sequence
</template>


<script>
// link: http://sortablejs.github.io/Sortable/

import { eventBus } from '@/main.ts'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'VueDraggableNext',
  beforeMount () {
    eventBus.$on('create-sortables', this.createSortables)
  },
  beforeDestroy () {
    eventBus.$off('create-sortables', this.createSortables)
  },
  data () {
    return {
      functionIdPrefix: 'function-box',
      localCurrentSequence: []
    }
  },
  computed: {
    ...mapState({
      sequences: state => state.workflow.sequences,
      currentSequence: state => state.workflow.currentSequence
    }),
    ...mapGetters({
      getModulesFunction: 'workflow/getModulesFunction'
    })
  },
  methods: {
    createSortables () {
      let sequenceArea = document.getElementById('sequence-area')
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

          tempCurrentSequence.splice(
            evt.newDraggableIndex,
            0,
            {
              id: evt.item.id,
              position: 0
            }
          )

          for (let i = 0; i < tempCurrentSequence.length; i++) {
            tempCurrentSequence[i].position = i
          }

          self.localCurrentSequence = tempCurrentSequence

          // Removendo item para que não influencie na definição das posições dos elementos.
          evt.item.remove()
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

          console.log('De ' + evt.oldIndex + ' para ' + evt.newIndex)
          
          let tempCurrentSequence = JSON.parse(JSON.stringify(self.localCurrentSequence))
          // Removendo da lista o item movido.
          let choosedItem = tempCurrentSequence.splice(evt.oldIndex, 1)
          // Colocando na lista o item movido, na sua nova posição.
          tempCurrentSequence.splice(evt.newIndex, 0, choosedItem[0])

          self.localCurrentSequence = tempCurrentSequence
        }
      })
    },
    addItem () {
      this.myArray.push(
        {
          id: this.myArray.length + 1,
          name: 'igor' + this.myArray.length
        }
      )
    },
    showList () {
      for (let item of this.localCurrentSequence) {
        console.log(item)
      }
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
.sequence-area-box {
  background-color: papayawhip;
  border: 2px solic purple;
  width: 100%;
  height: 100%;
  text-align: start;
  .sequence-block {
    display: inline-block;
    width: 20%;
    max-width: 200px;
    max-height: 100px;
    padding: 10px;
    margin: 5px;
    background-color: plum;
  }

}
</style>