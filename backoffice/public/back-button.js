document.addEventListener('DOMContentLoaded', () => {
  addBackButton();
});

// This is a fix as AdminJS can behave as an SPA and 'DOMContentLoaded' is not triggered but we still want to display the logo
const intervalId = setInterval(() => {
  if (!addBackButton()) {
    clearInterval(intervalId);
  }
}, 300);

const addBackButton = () => {
  if (document.querySelector('[data-css="sidebar-back-button"]')) {
    return;
  }

  const logoElement = document.querySelector('[data-css="sidebar-logo"]');
  if (logoElement) {
    const backButton = document.createElement('a');
    backButton.dataset.css = 'sidebar-back-button';
    backButton.href = window.location.origin; // Replace with your frontend URL

    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        `;

    const textNode = document.createTextNode('Back to the tool');
    backButton.appendChild(iconSpan);
    backButton.appendChild(textNode);
    logoElement.insertAdjacentElement('afterend', backButton);
    return backButton;
  }
};
