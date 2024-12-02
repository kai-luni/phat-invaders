class Canvas {
  constructor({ el, logicalWidth = 1000, logicalHeight = 1000 }) {
    this.el = el;
    this.logicalWidth = logicalWidth;
    this.logicalHeight = logicalHeight;
    this.ctx = this.el.getContext('2d');
    
    // Set the logical size
    this.el.width = this.logicalWidth;
    this.el.height = this.logicalHeight;
  }

  get width() {
    return this.el.width;
  }

  get height() {
    return this.el.height;
  }

  fullscreen() {
    if (!document.fullscreenElement) {
      if (this.el.requestFullscreen) {
        this.el.requestFullscreen();
      } else if (this.el.mozRequestFullScreen) { /* Firefox */
        this.el.mozRequestFullScreen();
      } else if (this.el.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        this.el.webkitRequestFullscreen();
      } else if (this.el.msRequestFullscreen) { /* IE/Edge */
        this.el.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

// Access canvas
export let canvas;

// init canvas
export function initCanvas({ el }) {
  // Get the canvas element by selector
  const canvasElement = document.querySelector(el);

  // Set up the canvas with a fixed logical size
  const logicalWidth = 1000;
  const logicalHeight = 1000;

  canvas = new Canvas({
    el: canvasElement,
    logicalWidth,
    logicalHeight,
  });

  // Return the initialized canvas
  return canvas;
}