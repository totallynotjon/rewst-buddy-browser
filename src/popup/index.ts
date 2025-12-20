// Browser API polyfill for cross-browser compatibility
const browserAPI = (chrome as any)?.browser || chrome;

// Get the button element
const sendButton = document.getElementById('sendToVSCode');

if (sendButton) {
  sendButton.addEventListener('click', () => {
    // Send message to background script to get tab data
    browserAPI.runtime.sendMessage({ action: 'getTabData' }, () => {
      // Close the popup after sending the message
      window.close();
    });
  });
}

console.log("index");

// Export to make this a module (prevents global scope pollution)
export {};

