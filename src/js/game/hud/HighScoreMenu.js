// HighScoreMenu.js
import Events from '../Events.js';

export default class HighScoreMenu {
  constructor() {
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
    this.modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.modalOverlay.style.display = 'none'; // Hidden by default
    this.modalOverlay.style.zIndex = '1000'; // Ensure it appears above other elements

    // Create the modal content container
    this.modalContent = document.createElement('div');
    this.modalContent.style.position = 'absolute';
    this.modalContent.style.top = '50%';
    this.modalContent.style.left = '50%';
    this.modalContent.style.transform = 'translate(-50%, -50%)';
    this.modalContent.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Translucent background
    this.modalContent.style.padding = '20px';
    this.modalContent.style.borderRadius = '5px';
    this.modalContent.style.textAlign = 'center';
    this.modalContent.style.width = '400px';

    // Create the heading
    const heading = document.createElement('h2');
    heading.textContent = 'High Scores';
    heading.style.color = '#9AF11C'; // Set font color

    // Create the high score list container
    this.scoreListContainer = document.createElement('div');
    this.scoreListContainer.style.marginTop = '20px';

    // Create a loading indicator
    this.loadingIndicator = document.createElement('p');
    this.loadingIndicator.textContent = 'Loading high scores...';
    this.loadingIndicator.style.color = '#9AF11C'; // Set font color

    // Back button to return to the previous menu
    this.backButton = document.createElement('button');
    this.backButton.textContent = 'Back';
    this.backButton.style.width = '100%';
    this.backButton.style.padding = '10px';
    this.backButton.style.marginTop = '20px';
    this.backButton.style.backgroundColor = '#9AF11C'; // Green background
    this.backButton.style.color = 'black'; // Text color black
    this.backButton.style.border = 'none'; // Remove border
    this.backButton.style.borderRadius = '5px';
    this.backButton.style.fontSize = '16px';
    this.backButton.style.cursor = 'pointer';

    // Append elements to modal content
    this.modalContent.appendChild(heading);
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
      const response = await fetch(
        'https://si-game-highscores-func.azurewebsites.net/api/GetHighScores'
      );
      if (response.ok) {
        const highScores = (await response.json()).highScores;
        // console.log('>>>>>>API Response:', highScores);
        // console.log('>>>>>>API Response 2:', highScores.highScores);
        this.displayHighScores(highScores);
      } else {
        this.loadingIndicator.textContent = 'Failed to load high scores.';
      }
    } catch (error) {
      console.error('Error fetching high scores:', error);
      this.loadingIndicator.textContent = 'An error occurred while loading high scores.';
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

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const rankHeader = document.createElement('th');
    rankHeader.textContent = 'Rank';
    rankHeader.style.borderBottom = '1px solid #9AF11C';
    rankHeader.style.padding = '5px';
    rankHeader.style.color = '#9AF11C';

    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Name';
    nameHeader.style.borderBottom = '1px solid #9AF11C';
    nameHeader.style.padding = '5px';
    nameHeader.style.color = '#9AF11C';

    // Assuming the high score entries have a 'score' field
    const scoreHeader = document.createElement('th');
    scoreHeader.textContent = 'Score';
    scoreHeader.style.borderBottom = '1px solid #9AF11C';
    scoreHeader.style.padding = '5px';
    scoreHeader.style.color = '#9AF11C';

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

      const nameCell = document.createElement('td');
      nameCell.textContent = entry.name;
      nameCell.style.padding = '5px';
      nameCell.style.color = '#9AF11C';
      nameCell.style.borderBottom = '1px solid #9AF11C';

      const scoreCell = document.createElement('td');
      scoreCell.textContent = entry.score; // Adjust if 'score' field has a different name
      scoreCell.style.padding = '5px';
      scoreCell.style.color = '#9AF11C';
      scoreCell.style.borderBottom = '1px solid #9AF11C';

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
    this.loadingIndicator.textContent = 'Loading high scores...';
    this.scoreListContainer.innerHTML = '';

    this.modalOverlay.style.display = 'block';

    // Fetch and display high scores
    this.fetchHighScores();
  }

  hideModal() {
    this.modalOverlay.style.display = 'none';
  }

  // Bind event listeners when the menu is active
  bind() {
    // Show the modal when the HighScoreMenu is bound
    this.showModal();
  }

  // Unbind event listeners when the menu is inactive
  unbind() {
    // Hide the modal when the HighScoreMenu is unbound
    this.hideModal();
  }

  // Clean up the modal when no longer needed
  destroy() {
    this.modalOverlay.remove();
  }
}
