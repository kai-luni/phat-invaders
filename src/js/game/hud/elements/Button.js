import { canvas } from '../../Canvas.js';
import Events from '../../Events.js';

export default class Button {
  constructor({ text = 'Button', x = 50, y = 50, color = '#ba55ad', textColor = '#fff' }) {
    this.fontSize = 24;
    this.width = (text.length * this.fontSize) * 0.6;
    this.height = this.fontSize * 2;

    this.text = text;
    this.x = x - this.width / 2; // Center the button horizontally at the given x
    this.y = y;
    this.color = color;
    this.textColor = textColor;

    this.events = new Events();
    this.initListeners();
  }

  /**
   * Scales mouse coordinates from screen space to canvas logical space.
   */
  getMousePosition(event) {
    const rect = canvas.el.getBoundingClientRect(); // Get the actual size of the canvas on the screen
    const scaleX = canvas.el.width / rect.width;   // Horizontal scale factor
    const scaleY = canvas.el.height / rect.height; // Vertical scale factor

    return {
      x: (event.clientX - rect.left) * scaleX, // Translate and scale the x coordinate
      y: (event.clientY - rect.top) * scaleY,  // Translate and scale the y coordinate
    };
  }

  /**
   * Initialize event listeners for the button.
   */
  initListeners() {
    canvas.el.addEventListener('click', (e) => {
      const { x, y } = this.getMousePosition(e); // Scale mouse position to logical space

      // Check if the click is within the button bounds
      if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
        this.events.emit('click');
      }
    });
  }

  /**
   * Render the button on the canvas.
   */
  render() {
    // Draw the button rectangle
    canvas.ctx.fillStyle = this.color;
    canvas.ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw the button text
    canvas.ctx.font = `${this.fontSize}px VT323`;
    canvas.ctx.fillStyle = this.textColor;
    canvas.ctx.textAlign = 'center';
    canvas.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.fontSize * 1.3);
  }
}
