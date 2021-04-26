<template>
  <modal :name="modalName" :show="modalsToShow.includes(modalName)">
    <template v-slot:header>
      <div class="center-header">
        <p>Próximos passos</p>
      </div>
    </template>

    <template v-slot:body>
      <div class="box-body">
        <p>Estamos quase lá! Agora você precisa apenas seguir os seguintes passos:</p>
        <ul>
          <li>Criar uma conta no nosso app: <a href="https://www.google.com.br"> baixar app</a></li>
          <li>Fazer login</li>
          <li>Postar seu primeiro produto</li>
        </ul>
      </div>
    </template>

    <template v-slot:footer>
      <div class="confirmation-button" @click="hideModal(modalName)">
        <button>Endendi</button>
      </div>
    </template>
  </modal>
</template>

<script>
import {mapState, mapActions} from 'vuex'

import Modal from './Modal';

export default {
  name: "GuideModal",
  components: {
    Modal
  },
  data () {
    return {
      modalName: 'guide_modal'
    }
  },
  computed: {
    ...mapState({
      modalsToShow: (state) => state.global.modalsToShow
    })
  },
  methods: {
    ...mapActions({
      hideModal: 'global/hideModal'
    })
  }
};
</script>

<style lang="scss">
.overflow-hidden {
  overflow: hidden;
}
.center-header {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;

  p {
    font-size: 32px;
  }
}
.box-body {
  max-width: 300px;
  padding-top: 15px;
  padding-bottom: 15px;
}

.confirmation-button {
  max-width: 250px;
  margin: 0 auto
}
</style>