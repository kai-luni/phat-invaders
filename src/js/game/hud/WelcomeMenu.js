import { canvas } from '../Canvas.js';
import Events from '../Events.js';
import Button from './elements/Button.js';
import Text from './elements/Text.js';
import Title from './elements/Title.js';

export default class WelcomeMenu {
  constructor() {
    this.title = new Title({ text: 'Space Invaders', x: canvas.width / 2, y: canvas.height / 2 - 75 });
    this.text1 = new Text({ text: 'Welcome to this game!', x: canvas.width / 2, y: canvas.height / 2 - 25 });
    this.text2 = new Text({ text: 'Do you want to start?', x: canvas.width / 2, y: canvas.height / 2 + 25 });
    this.btn = new Button({ text: 'Start', x: canvas.width / 2, y: canvas.height / 2 + 50 });
    this.events = new Events();

    // Prepare event handlers but do not bind them yet
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  // Event handler for button click
  onButtonClick() {
    this.events.emit('start');
  }

  // Event handler for keydown event
  onKeyDown(e) {
    if (e.code === 'Space') { // Check if the pressed key is Space
      this.events.emit('start');
    }
  }

  // Bind event listeners when the menu is active
  bind() {
    // Bind the button click event
    this.btn.events.on('click', this.onButtonClick);

    // Bind the keydown event
    document.addEventListener('keydown', this.onKeyDown);
  }

  // Unbind event listeners when the menu is inactive
  unbind() {
    // Unbind the button click event
    this.btn.events.off('click', this.onButtonClick);

    // Unbind the keydown event
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    // Overlay
    canvas.ctx.fillStyle = '#000000dd';
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    this.title.render();

    // Text
    this.text1.render();
    this.text2.render();

    // Start button
    this.btn.render();
  }
}
