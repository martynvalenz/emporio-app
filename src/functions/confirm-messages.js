import {
  Dialog
} from 'quasar'

export function confirmMessage(message) {
   Dialog.create({
      title: 'Confirmar cuenta',
      message: message
   })
}