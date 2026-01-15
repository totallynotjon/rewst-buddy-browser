// Browser API polyfill for cross-browser compatibility
const browserAPI = (chrome as any)?.browser || chrome;

const sendButton = document.getElementById('sendToVSCode');
const errorDiv = document.getElementById('error');

if (sendButton) {
  sendButton.addEventListener('click', () => {
    browserAPI.runtime.sendMessage({ action: 'open' }, (response: any) => {
      if (response?.success) {
        window.close();
      } else if (errorDiv) {
        errorDiv.textContent = response?.error || 'Unknown error';
        errorDiv.style.display = 'block';
      }
    });
  });
}

export {};

