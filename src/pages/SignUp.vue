<template lang="pug">
  #sign-up
    //- Modais
    ThankYouModal
    GuideModal

    .sign-up-header
      h3 Sign Up Header

    .sign-up-box.row
      .sign-up-left.col-xs
        p Descrição aqui
      
      .sign-up-right.col-xs
        p Formulário

        .form-box
          .design1-input.start-xs
            .input-label Seu nome:
            .full-box-input
              .input-box-input(:class="{ 'comp-in-focus': componentInFocus == 'name' }")
                input.comp-input(
                  id="name"
                  name="name"
                  placeholder="Sua nome"
                  type="text"
                  @focus="componentInFocus = 'name'"
                  @blur="componentInFocus = ''"
                  v-model.trim="signUp.name"
                )

          .design1-input.start-xs
            .input-label Seu e-mail:
            .full-box-input
              .input-box-input(:class="{ 'comp-in-focus': componentInFocus == 'email' }")
                input.comp-input(
                  id="email"
                  name="email"
                  placeholder="fernando@gmail.com"
                  type="text"
                  @focus="componentInFocus = 'email'"
                  @blur="componentInFocus = ''"
                  v-model.trim="signUp.email"
                )

          .design1-input.start-xs
            .input-label Seu whatsapp:
            .full-box-input
              .input-box-input(:class="{ 'comp-in-focus': componentInFocus == 'whatsapp' }")
                input.comp-input(
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="(88) 94288-2321"
                  type="text"
                  @focus="componentInFocus = 'whatsapp'"
                  @blur="componentInFocus = ''"
                  v-model.trim="signUp.whatsapp"
                  @input="signUp.whatsapp = maskInput('phone', $event.target.value)"
                )

        .finish-sign-up.row.center-xs
          .finish-button(@click="finishRegister")
            span Me cadastrar
</template>

<script>
import { mapActions } from 'vuex'

// Components.
import ThankYouModal from '@/components/Modal/ThankYouModal.vue'
import GuideModal from '@/components/Modal/GuideModal.vue'

// Mixins.
import InputMask from '@/inputMasks/maskInput.js'

// Functions.
import { 
  registerClient
} from '@/requests/requests'

export default {
  name: 'SignUp',
  data () {
    return {
      componentInFocus: '',
      signUp: {
        name: '',
        email: '',
        whatsapp: ''
      }
    }
  },
  mixins: [InputMask],
  components: {
    ThankYouModal,
    GuideModal
  },
  methods: {
    ...mapActions({
      showModal: 'global/showModal',
      // hideModal: 'global/hideModal',
    }),
    // showAllModals() {
    //   this.showModal('first')
    //   this.showModal('second')
    // }
    finishRegister() {
      console.log('Client data: ', this.signUp)

      // Registrando cliente.
      registerClient(this.signUp)
        .then(resp => {
          console.log(resp)
          if (resp && resp.status == 200 && resp.data && resp.data.data) {
            let result = resp.data.data
            // Efetuar redirecionamentos de página.
            if (result.result && result.result.redirect_to) {
              this.$router.push({name: result.result.redirect_to})

            } else if(result.result && result.result.redirect_directly_to) {
              window.open(result.result.redirect_directly_to, '_blank')

            } else if(result.result && result.result.show_modal) {
              this.showModal(result.result.show_modal)
            }
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#sign-up {
  .sign-up-box {
    .sign-up-right {
      .form-box {
        padding: 20px;
        max-width: 400px;
      }

      .finish-sign-up {
        .finish-button {
          margin-top: 20px;
          width: 250px;
          border-radius: 23px;
          padding: 10px;
          background-color: #00d09f;
          cursor: pointer;

          span {
            font-size: 18px;
            color: #fff;
          }

        }
      }
    }
  }
}
</style>