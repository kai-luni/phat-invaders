import { canvas } from '../Canvas.js'
import Events from '../Events.js'
import { Button } from './elements/Button.js';
import { Text } from './elements/Text.js';
import { Title } from './elements/Title.js';

export default class {
  constructor () {
    this.title = new Title({ text: 'Space Invaders', x: canvas.width / 2, y: canvas.height / 2 - 75 })
    this.text1 = new Text({ text: 'Welcome on this game!', x: canvas.width / 2, y: canvas.height / 2 - 25 })
    this.text2 = new Text({ text: 'Do you want to start ?', x: canvas.width / 2, y: canvas.height / 2 + 25 })
    this.btn = new Button({ text: 'Start', x: canvas.width / 2, y: canvas.height / 2 + 50 })
    this.events = new Events()

    this.initListeners()
  }

  initListeners () {
    this.btn.events.on('click', () => {
      this.events.emit('start')
    });


    // Add a keydown event listener for the spacebar
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {  // Check if the pressed key is Space
        this.events.emit('start');
      }
    });
  }

  render () {
    // overlay
    canvas.ctx.fillStyle = '#000000dd'
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height)

    // title
    this.title.render()

    // Text
    this.text1.render()
    this.text2.render()

    // resume button
    this.btn.render()
  }
}
