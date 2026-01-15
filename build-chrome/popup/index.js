// src/popup/index.ts
var browserAPI = chrome?.browser || chrome;
var sendButton = document.getElementById("sendToVSCode");
var errorDiv = document.getElementById("error");
if (sendButton) {
  sendButton.addEventListener("click", () => {
    browserAPI.runtime.sendMessage({ action: "open" }, (response) => {
      if (response?.success) {
        window.close();
      } else if (errorDiv) {
        errorDiv.textContent = response?.error || "Unknown error";
        errorDiv.style.display = "block";
      }
    });
  });
}
