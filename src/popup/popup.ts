import { BranchoItem } from '../core/interface';
import { getBranchoHistory } from '../core/storage';
import Fuse from 'fuse.js';

const fuseOptions = {
  isCaseSensitive: false,
  includeScore: false,
  shouldSort: true,
  threshold: 0.5,
  includeMatches: true,
  findAllMatches: true,
  ignoreLocation: true,
  keys: [
    { name: 'issueKey', weight: 1.5 },
    { name: 'title', weight: 2 },
    'type',
    'date',
  ],
};

const copyToClipboard = (branchName: string) => {
  navigator.clipboard.writeText(branchName).then(() => {
    chrome.runtime.sendMessage({
      type: 'branchCopied',
      branchName,
    });
  });
};

const formatDate = (d: string) => {
  const date = new Date(d);
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  } as const;
  debugger;

  // Using toLocaleString and custom formatting to get the exact format
  const dateString = date.toLocaleString('en-US', options);
  const [monthDay, yearTime] = dateString.split(', ');
  const [year, time] = yearTime.split('at');

  return `${monthDay}, ${time.trim()}`;
};

document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.getElementById(
    'cardContainer'
  ) as HTMLDivElement;

  const searchInput = document.getElementById(
    'searchInput'
  ) as HTMLInputElement;

  const cleanBtn = document.getElementById('clearButton') as HTMLButtonElement;
  cleanBtn.addEventListener('click', () => {
    searchInput.value = '';
  });

  const emptyMessage = document.getElementById(
    'emptyMessage'
  ) as HTMLDivElement;

  getBranchoHistory().then((history) => {
    if (history.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }

    const fuse = new Fuse(history, fuseOptions);

    const createCard = (item: BranchoItem) => {
      const cardElement = document.createElement('div');
      const linkColor = '#0052cc';
      const borderColor = item.type === 'jira' ? '#0052cc' : '#24292e';
      cardElement.className = `card ${item.type.toLowerCase()}-card`;
      cardElement.style.borderColor = borderColor;
      cardElement.innerHTML = `
        <div class="header">
          <div class="type">
            <img src="../img/${item.type}.svg" alt="jira" />
            <span>${item.issueKey}</span>
          </div>
          <div class="date">${formatDate(item.date)}</div>
        </div>
        <div class="link">
          <a href="#" style="color: ${linkColor}">${item.branchName}</a>
        </div>
        <div class="title">${item.title}</div>
      `;

      cardElement.addEventListener('click', () => {
        copyToClipboard(item.branchName);
      });

      const linkElement = cardElement.querySelector('.link a');
      linkElement?.addEventListener('click', (event) => {
        event.preventDefault();
        window.open(item.url, '_blank');
      });

      return cardElement;
    };

    const updateCards = (results: BranchoItem[]) => {
      cardContainer.innerHTML = '';
      if (results.length === 0) {
        emptyMessage.style.display = 'block';
      } else {
        emptyMessage.style.display = 'none';
        results.forEach((item) => {
          const cardElement = createCard(item);
          cardContainer.appendChild(cardElement);
        });
      }
    };

    searchInput.addEventListener('input', () => {
      const searchPattern = searchInput.value.trim();
      if (searchPattern === '') {
        updateCards(history);
        return;
      }

      const results = fuse.search(searchPattern);
      const formattedResults = results.map((r) => r.item);
      updateCards(formattedResults);
    });

    updateCards(history); // Initial population of cards
  });
});
