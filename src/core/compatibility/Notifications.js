
export default {
  name: 'CoreNotifications',
  methods: {
    notifEmptyMicrocart () {
      this.$snotify.warning(
        'Adicione algum produto ao carrinho.',
        'Carrinho vazio',
        {
          position: 'rightTop',
          timeout: 3000
        }
      );
    },
    notifInvalidSequence () {
      this.$snotify.error(
        'Alguma função incompatível com a seguinte.',
        'Sequência inválida',
        {
          position: 'rightTop',
          timeout: 3000
        }
      );
    },
    notifValidSequence () {
      this.$snotify.success(
        'Tudo certo.',
        'Sequência válida',
        {
          position: 'rightTop',
          timeout: 3000
        }
      );
    },
    notifWithParams (notificationBody) {
      this.$snotify.create(notificationBody)
    }
  }
}