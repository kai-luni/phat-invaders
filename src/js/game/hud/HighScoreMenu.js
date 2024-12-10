// HighScoreMenu.js
import Events from '../Events.js';

export default class HighScoreMenu {
  constructor(assets) {
    this.assets = assets;
    this.events = new Events();

    // Create the modal elements
    this.createModal();
  }

  createModal() {
    // Create the modal overlay
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.style.position = 'fixed';
    this.modalOverlay.style.top = '0';
    this.modalOverlay.style.left = '0';
    this.modalOverlay.style.width = '100%';
    this.modalOverlay.style.height = '100%';
    // More translucent background
    this.modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    this.modalOverlay.style.display = 'none'; 
    this.modalOverlay.style.zIndex = '1000';

    // Create the modal content container
    this.modalContent = document.createElement('div');
    this.modalContent.style.position = 'absolute';
    this.modalContent.style.top = '50%';
    this.modalContent.style.left = '50%';
    this.modalContent.style.transform = 'translate(-50%, -50%)';
    this.modalContent.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.modalContent.style.padding = '20px';
    this.modalContent.style.borderRadius = '5px';
    this.modalContent.style.textAlign = 'center';
    this.modalContent.style.width = '400px';
    this.modalContent.style.fontFamily = 'Arial'; // Set font to Arial

    // Use the assets class for the High Scores image
    const highScoresImage = this.assets.highscoreTextTexture;
    highScoresImage.style.width = '100%'; 
    highScoresImage.style.marginBottom = '20px';

    // High score list container
    this.scoreListContainer = document.createElement('div');
    this.scoreListContainer.style.marginTop = '20px';

    // Loading indicator (in German)
    this.loadingIndicator = document.createElement('p');
    this.loadingIndicator.textContent = 'Lade Bestenliste...';
    this.loadingIndicator.style.color = '#9AF11C'; 
    this.loadingIndicator.style.fontFamily = 'Arial';

    // Back button (in German)
    this.backButton = document.createElement('button');
    this.backButton.textContent = 'Nochmal spielen';
    this.backButton.style.width = '100%';
    this.backButton.style.padding = '10px';
    this.backButton.style.marginTop = '20px';
    this.backButton.style.backgroundColor = '#9AF11C'; 
    this.backButton.style.color = 'black';
    this.backButton.style.border = 'none';
    this.backButton.style.borderRadius = '5px';
    this.backButton.style.fontSize = '16px';
    this.backButton.style.cursor = 'pointer';
    this.backButton.style.fontFamily = 'Arial';

    // Append elements to modal content
    this.modalContent.appendChild(highScoresImage);
    this.modalContent.appendChild(this.loadingIndicator);
    this.modalContent.appendChild(this.scoreListContainer);
    this.modalContent.appendChild(this.backButton);

    // Append modal content to overlay
    this.modalOverlay.appendChild(this.modalContent);

    // Append modal overlay to body
    document.body.appendChild(this.modalOverlay);

    // Bind the back button click event
    this.backButton.addEventListener('click', this.onBackButtonClick.bind(this));
  }

  async fetchHighScores() {
    try {
      const response = await fetch('https://si-game-highscores-func.azurewebsites.net/api/GetHighScores');
      if (response.ok) {
        const highScores = (await response.json()).highScores;
        this.displayHighScores(highScores);
      } else {
        this.loadingIndicator.textContent = 'Fehler beim Laden der Bestenliste.';
      }
    } catch (error) {
      console.error('Fehler beim Laden der Bestenliste:', error);
      this.loadingIndicator.textContent = 'Ein Fehler ist beim Laden der Bestenliste aufgetreten.';
    }
  }

  displayHighScores(highScores) {
    // Clear the loading indicator
    this.loadingIndicator.style.display = 'none';

    // Create a table to display the scores
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '10px';
    table.style.fontFamily = 'Arial';

    // Table header (in German)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const rankHeader = document.createElement('th');
    rankHeader.textContent = 'Platz';
    rankHeader.style.borderBottom = '1px solid #9AF11C';
    rankHeader.style.padding = '5px';
    rankHeader.style.color = '#9AF11C';
    rankHeader.style.fontFamily = 'Arial';

    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Name';
    nameHeader.style.borderBottom = '1px solid #9AF11C';
    nameHeader.style.padding = '5px';
    nameHeader.style.color = '#9AF11C';
    nameHeader.style.fontFamily = 'Arial';

    const scoreHeader = document.createElement('th');
    scoreHeader.textContent = 'Punkte';
    scoreHeader.style.borderBottom = '1px solid #9AF11C';
    scoreHeader.style.padding = '5px';
    scoreHeader.style.color = '#9AF11C';
    scoreHeader.style.fontFamily = 'Arial';

    headerRow.appendChild(rankHeader);
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(scoreHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');

    highScores.forEach((entry, index) => {
      const row = document.createElement('tr');

      const rankCell = document.createElement('td');
      rankCell.textContent = index + 1; // Rank starts from 1
      rankCell.style.padding = '5px';
      rankCell.style.color = '#9AF11C';
      rankCell.style.borderBottom = '1px solid #9AF11C';
      rankCell.style.fontFamily = 'Arial';

      const nameCell = document.createElement('td');
      nameCell.textContent = entry.name;
      nameCell.style.padding = '5px';
      nameCell.style.color = '#9AF11C';
      nameCell.style.borderBottom = '1px solid #9AF11C';
      nameCell.style.fontFamily = 'Arial';

      const scoreCell = document.createElement('td');
      scoreCell.textContent = entry.score;
      scoreCell.style.padding = '5px';
      scoreCell.style.color = '#9AF11C';
      scoreCell.style.borderBottom = '1px solid #9AF11C';
      scoreCell.style.fontFamily = 'Arial';

      row.appendChild(rankCell);
      row.appendChild(nameCell);
      row.appendChild(scoreCell);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    this.scoreListContainer.appendChild(table);
  }

  onBackButtonClick() {
    // Hide the modal and emit an event if needed
    this.hideModal();
    this.events.emit('start');
  }

  showModal() {
    // Reset the modal content
    this.loadingIndicator.style.display = 'block';
    this.loadingIndicator.textContent = 'Lade Bestenliste...';
    this.scoreListContainer.innerHTML = '';

    this.modalOverlay.style.display = 'block';

    // Fetch and display high scores
    this.fetchHighScores();
  }

  hideModal() {
    this.modalOverlay.style.display = 'none';
  }

  bind() {
    this.showModal();
  }

  unbind() {
    this.hideModal();
  }

  destroy() {
    this.modalOverlay.remove();
  }
}
