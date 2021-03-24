<template lang="pug">
  .vue-draggable
    h1 DRAGGABLE
    #simpleList.list-group.row
      .list-group-item(v-for="item in myArray" :key="item.id")
        span.glyphicon-move  X 
        span {{ item.name }}


    button(@click="addItem") Add item
    button(@click="showList") Show List
</template>


<script>
// link: http://sortablejs.github.io/Sortable/

export default {
  name: 'VueDraggableNext',
  mounted () {
    let simpleList = document.getElementById('simpleList')
    let self = this
    Sortable.create(simpleList, {
      animation: 1000,
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
        
        // Removendo da lista o item movido.
        let choosedItem = self.myArray.splice(evt.oldIndex, 1)
        // Colocando na lista o item movido, na sua nova posição.
        self.myArray.splice(evt.newIndex, 0, choosedItem[0])
      }
    });
  },
  data () {
    return {
      myArray: [
        { id: 1, name: 'igor' },
        { id: 2, name: 'igoru' }
      ]
    }
  },
  methods: {
    addItem () {
      this.myArray.push(
        {
          id: this.myArray.length + 1,
          name: 'igor' + this.myArray.length
        }
      )
    },
    showList () {
      for (let item of this.myArray) {
        console.log(item.name)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.list-group-item {
  margin: 3px;
  width: 100px;
  height: 100px;
  background-color: peachpuff;
  transition: all .5s;

  &.ghost-class {
    // transform: scale(.8)
  }

}

.ghost-class {
  background-color: plum;
  // transform: scale(.8);
}
</style>