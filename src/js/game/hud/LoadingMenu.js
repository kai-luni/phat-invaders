import { canvas } from '../Canvas.js'
import { Title } from './elements.js'

export default class {
  constructor () {
    this.title = new Title({ text: 'Loading...', x: canvas.width / 2, y: canvas.height / 2 })
  }

  render () {
    // overlay
    canvas.ctx.fillStyle = '#000000dd'
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Loading title
    this.title.render()
  }
}
