document.querySelectorAll("button").forEach(btn => {
  btn.onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toggleFeature,
      args: [btn.dataset.action]
    });
  };
});

function toggleFeature(action) {
  window.dispatchEvent(new CustomEvent("accessall-toggle", {
    detail: action
  }));
}
