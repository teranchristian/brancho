var cardSelector = 'div.cardeditor-topbar > div.buttons > button > .fui-btn-text';
var titleSelector = ' > div.cardfield.cardfield-title > div';
const favroRegex = /.*favro\.com\/organization\/[a-zA-Z0-9]*\/[a-zA-Z0-9]*\?(card)=(.*)/g;

chrome.commands.onCommand.addListener(function(browserTab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length !== 1) {
      return;
    }

    var tab = tabs[0];
    var matchUrl = false;
    while ((m = favroRegex.exec(tab.url)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === favroRegex.lastIndex) {
        favroRegex.lastIndex++;
      }
      matchUrl = true;
    }
    if (!matchUrl) {
      console.log('URL did not match');
      return;
    }

    chrome.tabs.executeScript(tab.id, {file: "js/content.js"}, function () {
      const lastErr = chrome.runtime.lastError;
      if (lastErr){
        console.log('tab: ' + tab.id + ' lastError: ' + JSON.stringify(lastErr));
      };
    // send a message to content script
    chrome.tabs.sendMessage(tab.id, "Background page", function (response) {
      var doc = htmlToDocument(response);
      var cardDiv = doc.querySelector(cardSelector);
      var cardId = null;
      if (cardDiv != null) {
        cardId = cardDiv.innerText.trim().toLowerCase();
      }

      var idDiv = doc.querySelector(".cardeditor");
      var cardId = null;
      if (cardDiv != null) {
        cardId = cardDiv.innerText.trim().toLowerCase();
      }

      var titleContainer = doc.querySelector('[id="'+idDiv.id+'"]');
      var titleDiv = titleContainer.querySelector("div.cardfield.cardfield-title > div")
      cardTitle = null;
      if (titleDiv != null) {
        cardTitle = titleDiv.innerText.trim();
        cardTitle = cardTitle.replace(/-/g, "");
        cardTitle = cardTitle.replace(/\s+/g, '-').toLowerCase();
      }
      branchName = null;
      if (cardId != null && cardTitle != null) {
        branchName = cardId + '-' + cardTitle;
        copyToClipboard(branchName);
        createNotification("Branch name on clipboard", branchName);
      } else {
        createNotification("Error", "Branch name not found");
      }
    });
  });
  });
});

function createNotification(title, branchName) {
  var opt = {
    type: "basic",
    title: title,
    message: branchName,
    iconUrl: "img/b-icon-24.png"
  };
  chrome.notifications.create(null, opt, function (notificationId) {
    timer = setTimeout(function () {
      chrome.notifications.clear(notificationId);
    }, 3000);
  });
}

function copyToClipboard(branchName) {
  const input = document.createElement("input");
  input.style.position = "fixed";
  input.style.opacity = 0;
  input.value = branchName;
  document.body.appendChild(input);
  input.select();
  document.execCommand("Copy");
  document.body.removeChild(input);
};

function htmlToDocument(str) {
  var template = document.createElement("template");
  if (template.content) {
    template.innerHTML = str;
    return template.content;
  }
}
