<template lang="pug">
  #sign-up
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
  methods: {
    finishRegister() {
      console.log('Client data: ', this.signUp)

      // Registrando cliente.
      registerClient(this.signUp)
        .then(resp => {
          console.log(resp)
          // if (resp && resp.status == 200) {
          //   console.log('sequences: ', resp.data)
          //   this.setSequences(resp.data.data)

          //   eventBus.$emit('create-sortables')
          // }
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