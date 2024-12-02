// LostMenu.js
import { canvas } from '../Canvas.js';
import Events from '../Events.js';
import Button from './elements/Button.js';
import Text from './elements/Text.js';
import Title from './elements/Title.js';

export default class LostMenu {
  constructor() {
    this.title = new Title({
      text: 'Game Over!',
      x: canvas.width / 2,
      y: canvas.height / 2 - 100,
    });
    this.text1 = new Text({
      text: 'Your Score:',
      x: canvas.width / 2,
      y: canvas.height / 2 - 50,
    });
    this.submitButton = new Button({
      text: 'Submit High Score',
      x: canvas.width / 2,
      y: canvas.height / 2 + 50,
    });
    this.events = new Events();
    this.highScore = 0; // Initialize with 0 as default

    this.onSubmitClick = this.onSubmitClick.bind(this);
  }

  // Event handler for the submit button click
  async onSubmitClick() {
    // Use prompt to get the player's name
    const playerName = prompt('Enter your name to submit your high score:', 'Anonymous');

    // Check if the user canceled the prompt
    if (playerName === null) {
      // User canceled the prompt
      alert('High score submission canceled.');
      return;
    }

    // Use prompt to get the player's email address
    let email = prompt('Enter your email address (optional):', '');

    // Check if the user canceled the email prompt
    if (email === null) {
      // User canceled the prompt; set email to empty string
      email = '';
    }

    // Validate the email address format if provided
    if (email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Invalid email address format. Please try again.');
        return;
      }
    }

    try {
      // Prepare the data to be sent
      const data = {
        name: playerName,
        score: this.highScore,
      };

      // Include the email if provided
      if (email !== '') {
        data.email = email;
      }

      // POST the high score to the API
      const response = await fetch(
        'https://si-game-highscores-func.azurewebsites.net/api/SaveHighScore',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

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

  // Bind event listeners when the menu is active
  bind() {
    // Bind submit button click
    this.submitButton.events.on('click', this.onSubmitClick);
  }

  // Unbind event listeners when the menu is inactive
  unbind() {
    // Unbind submit button click
    this.submitButton.events.off('click', this.onSubmitClick);
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

    // Display "Your Score:"
    this.text1.render();

    // Display the actual high score
    const highScoreText = new Text({
      text: `${this.highScore}`,
      x: canvas.width / 2,
      y: canvas.height / 2 - 20,
    });
    highScoreText.render();

    // Submit button
    this.submitButton.render();
  }
}
