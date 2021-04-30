<template lang="pug">
  #register-functions
    .register-functions-box
      h3 Registre funções

      .design1-input.mt30
        .input-label.blue-label Selecione o módulo
        .modules-box
          .chevron-icon-installment
            img(src="@/assets/arrow.png" alt="module arrow")

          select(name="modules" id="module" @change="selectModule($event)")
            option(:value="'{}'") Escolha um módulo
            option(v-for="mf in projectModulesFunctions" :key="mf.module" :value="JSON.stringify(mf)") {{ mf.module.replace('Elixir.', '') }}

      p {{ moduleExist ? 'Alterar módulo' : 'Registrar módulo' }}

      p {{ currentModule }}

      .design1-input
        .input-label Título do módulo:
        .full-box-input
          .input-box-input
            input(
              id="module-title"
              class="comp-input"
              name="module-title"
              placeholder="Enviar mensagens"
              type="text"
              v-model.trim="moduleTitle"
            )

      
      .design1-input
        .input-label Descrição do módulo:
        .full-box-input
          .input-box-input
            input(
              id="module-desc"
              class="comp-input"
              name="module-desc"
              placeholder="Enviar mensagens"
              type="text"
              v-model.trim="moduleDescription"
            )

      .function-box(v-if="currentModule.functions")
        .select-functions
          .input-label.blue-label Selecione a função
          .modules-box
            .chevron-icon-installment
              img(src="@/assets/arrow.png" alt="module arrow")

            select(name="functions" id="function" @change="selectFunction($event)")
              option(:value="'{}'") função ...
              option(v-for="func in currentModule.functions" :key="`${func.arity}${func.name}`" :value="JSON.stringify(func)") {{ func.name }}

        p {{ currentFunction }}

        .design1-input
          .input-label Título da função:
          .full-box-input
            .input-box-input
              input(
                id="function-title"
                class="comp-input"
                name="function-title"
                placeholder="Envia mensagem para whatsapp"
                type="text"
                v-model.trim="functionTitle"
              )

        
        .design1-input
          .input-label Descrição da função:
          .full-box-input
            .input-box-input
              input(
                id="function-desc"
                class="comp-input"
                name="function-desc"
                placeholder="Enviar mensagens de boas vindas"
                type="text"
                v-model.trim="functionDescription"
              )

        .design1-input
          .input-label Tipos dos argumentos de entrada:
          .full-box-input
            .input-box-input
              input(
                id="function-args-types"
                class="comp-input"
                name="function-args-types"
                placeholder="string, number | boolean"
                type="text"
                v-model.trim="argumentsType"
              )

        .design1-input
          .input-label Tipo do argumento de saída:
          .full-box-input
            .input-box-input
              input(
                id="function-resp-type"
                class="comp-input"
                name="function-resp-type"
                placeholder="string"
                type="text"
                v-model.trim="responsesType"
              )

        .button-register(@click="finishRegister")
          p Finalizar

      //- .list-modules(v-for="mf in modulesFunctions" :key="mf.id")
      //-   p Módulo: {{ mf.module }}
      //-   p Id: {{ mf.id }}
      //-   p Label: {{ mf.label }}
      //-   p Descrição: {{ mf.description }}
        
      //-   .list-functions(v-for="func in mf.functions" :key="func.id")
      //-     p Função: {{ func.function }}
      //-     p Label: {{ func.label }}
      //-     p Descrição: {{ func.description }}
      //-     p Aridade: {{ func.arity }}
      //-     p Argumentos de entrada: {{ func.argumentsType }}
      //-     p Dados da resposta: {{ func.responsesType }}

</template>

<script>
import { mapState } from 'vuex'

import { 
  getProjectModules,
  registerFunction,
  registerModule
} from '@/requests/requests'


export default {
  name: 'RegisterFunctions',
  data() {
    return {
      projectModulesFunctions: [],
      currentModule: {},
      currentFunction: {},
      titleRegister: '',
      moduleExist: false,
      functionExist: false,
      moduleTitle: '',
      moduleDescription: '',
      functionTitle: '',
      functionDescription: '',
      argumentsType: '',
      responsesType: ''
    }
  },
  computed: {
    ...mapState({
      modulesFunctions: state => state.workflow.modulesFunctions
    })
  },
  mounted() {
    // Buscando módulos disponíveis para manipulação.
    getProjectModules()
      .then(resp => {
        console.log(resp)
        if (resp && resp.status == 200) {
          console.log('project modules: ', resp.data)
          this.projectModulesFunctions = resp.data.data
        }
      })
      .catch(error => {
        console.error(error)
      })
  },
  methods: {
    finishRegister() {
      console.log(this.$data)

      if (!this.moduleExist) {
        let registerFunctionData = {
          function: this.currentFunction.name, 
          label: this.functionTitle,
          description: this.functionDescription,
          arity: this.currentFunction.arity,
          argumentsType: this.argumentsType ? this.argumentsType.split(',').map(arg => {
            return arg.replaceAll('|', ',').replaceAll(' ', '')
          }) : [],
          responsesType: this.responsesType ? [this.responsesType.replaceAll('|', ',').replaceAll(' ', '')] : []
        }

        console.log('Function data: ', registerFunctionData)
        // Buscando módulos disponíveis para manipulação.
        registerFunction(registerFunctionData)
          .then(resp => {
            console.log(resp)
            if (resp && resp.status == 200) {
              let functionId = resp.data.data.id

              let registerModuleData = {
                module: this.currentModule.module.replace('Elixir.', ''),
                label: this.moduleTitle,
                description: this.moduleDescription,
                module_functions: [functionId]
              }

              // Buscando módulos disponíveis para manipulação.
              registerModule(registerModuleData)
                .then(resp => {
                  console.log(resp)
                  if (resp && resp.status == 200) {
                    
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
      } else { // Caso o módulo selecionado já esteja registrado.

      }
    },
    selectModule(event) {
      let selmodule = JSON.parse(event.target.value)
      this.currentModule = selmodule
      console.log('Selected module: ', selmodule)
      console.log('Registered modules: ', this.modulesFunctions)

      let alredyRegistered = this.modulesFunctions.find(mf => {
        return mf.module == selmodule.module.replace('Elixir.', '')
      })

      if (alredyRegistered) {
        this.moduleExist = true
        this.moduleTitle = alredyRegistered.label
        this.moduleDescription = alredyRegistered.description
      } else {
        this.moduleExist = false
        this.moduleTitle = ''
        this.moduleDescription = ''
      }
    },
    selectFunction(event) {
      let selfunction = JSON.parse(event.target.value)
      this.currentFunction = selfunction
      console.log('Selected function: ', selfunction)

      let getModule = this.modulesFunctions.find(mf => {
        return mf.module == this.currentModule.module.replace('Elixir.', '')
      })

      console.log(getModule)

      let alredyRegistered = getModule.functions.find(f => {
        return f.arity == selfunction.arity && f.function == selfunction.name
      })

      console.log(alredyRegistered)

    console.log('Modules functions: ', this.modulesFunctions)


      if (alredyRegistered) {
        this.functionExist = true
        this.functionTitle = alredyRegistered.label
        this.functionDescription = alredyRegistered.description
        this.argumentsType = (alredyRegistered.argumentsType.map(arg => {
          return arg.replaceAll(',', '|')
        })).join(','),
        this.responsesType = (alredyRegistered.responsesType.map(arg => {
          return arg.replaceAll(',', '|')
        })).join(',')
      } else {
        this.functionExist = false
        this.functionTitle = ''
        this.functionDescription = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#register-functions {
  padding: 20px 40px;
  text-align: start;
  .register-functions-box {
    .modules-box {
      text-align: initial;
      margin-top: 10px;
      position: relative;
      height: 48px;
      width: 270px;
      background-color: #f3f7f8;
      border-radius: 30px;
      max-width: 100%;

      .chevron-icon-installment {
        position: absolute;
        right: 16px;
        top: 14px;
        z-index: 1;
        color: #646e70;

        img {
          width: 12px;
        }
      }

      input, select {
        cursor: pointer;
        position: absolute;
        top: 0;
        z-index: 2;
        color: #222;
        width: 100%;
        // max-width: 100%;
        height: 48px;
        outline: none;
        border: none;
        background-color: transparent;
        padding-left: 20px;
        padding-right: 35px;
        font-size: 1em;

        // Removendo setinha que vem por padrão.
        -webkit-appearance: none;
        -moz-appearance: none;
      }
    }

    .list-modules {
      border-bottom-width: 3px;
      border-bottom-style: solid;
      border-bottom-color: sienna;
      .list-functions {
        padding-left: 40px;
      }
    }
  }
}
</style>