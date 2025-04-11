import { styleInjector } from '@content/commentToggler/styleInjector'
import { addCommentToggler } from '@content/commentToggler/addCommentToggler';
import { SELECTORS } from '@content/commentToggler/constants';

styleInjector();

const commentElements = document.querySelectorAll(SELECTORS.comment);
if (commentElements.length) {
  addCommentToggler(commentElements);
}

new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type !== 'childList') {
      return;
    }

    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const newComments = (node as Element).querySelectorAll(SELECTORS.comment);
      if (newComments.length === 0) {
        return;
      }

      addCommentToggler(newComments);
    });
  }
}).observe(document.body, { childList: true, subtree: true });
