import { formatState } from '../types/formatState'

export const state: formatState = {
  modulesFunctions: [],
  sequences: [],
  currentSequence: {
    centerX: 10,
    centerY: 10,
    scale: 1,
    nodes: [
      {
        id: 1,
        x: 200,
        y: 200,
        type: 'Início',
        label: 'Início'
      }
    ],
    links: []
  }
}
