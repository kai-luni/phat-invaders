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
    this.input = { x: canvas.width / 2 - 100, y: canvas.height / 2 - 20, width: 200, height: 30 }; // Input box dimensions
    this.submitButton = new Button({ text: 'Submit High Score', x: canvas.width / 2, y: canvas.height / 2 + 50 });
    this.events = new Events();
    this.highScore = 0; // Initialize with 0 as default

    // Create and style the input element
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.placeholder = 'Enter your name';
    this.inputElement.maxLength = 20;

    this.inputElement.style.position = 'absolute';
    this.inputElement.style.zIndex = 1000;
    this.inputElement.style.background = '#ffffff';
    this.inputElement.style.color = '#000000';
    this.inputElement.style.fontSize = '16px';
    this.inputElement.style.textAlign = 'center';
    this.inputElement.style.border = '1px solid #000000';
    this.inputElement.style.borderRadius = '5px';
    this.inputElement.style.padding = '5px';
    this.inputElement.style.display = 'none'; // Hide initially

    document.body.appendChild(this.inputElement);

    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.positionInput = this.positionInput.bind(this);
  }

  // Event handler for the submit button click
  async onSubmitClick() {
    const playerName = this.inputElement.value || 'Anonymous'; // Get value from the input element

    try {
      // POST the high score to the API
      const response = await fetch('https://si-game-highscores-func.azurewebsites.net/api/SaveHighScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score: this.highScore }),
      });

      if (response.ok) {
        alert('High score submitted successfully!');
        // Optionally, emit an event to restart the game
        // this.events.emit('start');
      } else {
        alert('Failed to submit high score. Try again!');
      }
    } catch (error) {
      console.error('Error submitting high score:', error);
      alert('An error occurred while submitting the high score.');
    }
  }

  // Position the input element over the canvas
  positionInput() {
    const rect = canvas.el.getBoundingClientRect(); // Corrected line

    const inputX = rect.left + this.input.x;
    const inputY = rect.top + this.input.y;

    this.inputElement.style.left = `${inputX}px`;
    this.inputElement.style.top = `${inputY}px`;
    this.inputElement.style.width = `${this.input.width}px`;
    this.inputElement.style.height = `${this.input.height}px`;
  }

  // Bind event listeners when the menu is active
  bind() {
    // Bind submit button click
    this.submitButton.events.on('click', this.onSubmitClick);

    // Show and focus the input element
    this.inputElement.style.display = 'block';
    this.inputElement.focus();

    // Position the input element
    this.positionInput();

    // Handle window resize to reposition the input
    window.addEventListener('resize', this.positionInput);
  }

  // Unbind event listeners when the menu is inactive
  unbind() {
    // Unbind submit button click
    this.submitButton.events.off('click', this.onSubmitClick);

    // Hide the input element
    this.inputElement.style.display = 'none';

    // Remove the resize event listener
    window.removeEventListener('resize', this.positionInput);
  }

  setHighScore(score) {
    this.highScore = score;
  }

  render() {
    // Overlay
    canvas.ctx.fillStyle = '#000000dd';
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    this.title.render();

    // Instruction text
    this.text1.render();

    // Display high score
    const highScoreText = new Text({ 
      text: `Your Score: ${this.highScore}`, 
      x: canvas.width / 2, 
      y: canvas.height / 2 - 75 
    });
    highScoreText.render();

    // Submit button
    this.submitButton.render();
  }

  // Clean up the input element when no longer needed
  destroy() {
    this.inputElement.remove();
  }
}
