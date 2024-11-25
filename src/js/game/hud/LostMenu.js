// LostMenu.js
import { canvas } from '../Canvas.js';
import Events from '../Events.js';
import Button from './elements/Button.js';
import Text from './elements/Text.js';
import Title from './elements/Title.js';

export default class LostMenu {
  constructor() {
    this.title = new Title({ text: 'Game Over!', x: canvas.width / 2, y: canvas.height / 2 - 100 });
    this.text1 = new Text({ text: 'Enter your name to submit your high score!', x: canvas.width / 2, y: canvas.height / 2 - 50 });
    this.input = { x: canvas.width / 2 - 100, y: canvas.height / 2 - 20, width: 200, height: 30, value: '' }; // Input box
    this.submitButton = new Button({ text: 'Submit High Score', x: canvas.width / 2, y: canvas.height / 2 + 50 });
    this.events = new Events();

    // Prepare event handlers but do not bind them yet
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  // Event handler for the submit button click
  async onSubmitClick() {
    const playerName = this.input.value || 'Anonymous'; // Use input value or default to 'Anonymous'
    const randomScore = Math.floor(Math.random() * 50000 + 1000); // Generate random score

    try {
      // POST the high score to the API
      const response = await fetch('https://si-game-highscores-func.azurewebsites.net/api/SaveHighScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score: randomScore }),
      });

      if (response.ok) {
        alert('High score submitted successfully!');
        this.events.emit('start'); // Emit an event to restart the game
      } else {
        alert('Failed to submit high score. Try again!');
      }
    } catch (error) {
      console.error('Error submitting high score:', error);
      alert('An error occurred while submitting the high score.');
    }
  }

  // Event handler for keyboard input
  onKeyDown(event) {
    if (event.key.length === 1) {
      this.input.value += event.key; // Append typed character
    } else if (event.key === 'Backspace') {
      this.input.value = this.input.value.slice(0, -1); // Remove last character
    }
  }

  // Bind event listeners when the menu is active
  bind() {
    // Bind submit button click
    this.submitButton.events.on('click', this.onSubmitClick);

    // Bind keyboard input for name entry
    window.addEventListener('keydown', this.onKeyDown);
  }

  // Unbind event listeners when the menu is inactive
  unbind() {
    // Unbind submit button click
    this.submitButton.events.off('click', this.onSubmitClick);

    // Unbind keyboard input
    window.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    // Overlay
    canvas.ctx.fillStyle = '#000000dd';
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    this.title.render();

    // Instruction text
    this.text1.render();

    // Input field
    canvas.ctx.fillStyle = '#ffffff';
    canvas.ctx.fillRect(this.input.x, this.input.y, this.input.width, this.input.height);
    canvas.ctx.fillStyle = '#000000';
    canvas.ctx.font = '16px Arial';
    canvas.ctx.fillText(this.input.value, this.input.x + 5, this.input.y + 20);

    // Submit button
    this.submitButton.render();
  }
}
