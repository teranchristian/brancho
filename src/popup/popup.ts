import { getBranchoHistory } from '../core/storage';

const copyToClipboard = (branchName: string) => {
  navigator.clipboard.writeText(branchName).then(() => {
    chrome.runtime.sendMessage({
      type: 'branchCopied',
      branchName,
    });
  });
};
document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.getElementById(
    'cardContainer'
  ) as HTMLDivElement;
  const emptyMessage = document.getElementById(
    'emptyMessage'
  ) as HTMLDivElement;

  getBranchoHistory().then((history) => {
    console.log('history', history);
    if (history.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }
    emptyMessage.style.display = 'none';
    history.forEach((item) => {
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
          <div class="date">${item.date}</div>
        </div>
        <div class="link">
          <a id="link"  href="#" style="color: ${linkColor}">${item.branchName}</a>
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
      cardContainer.appendChild(cardElement);
    });
  });
});
