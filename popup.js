console.log("[Access4All Popup] Popup loaded");

function sendMsg(action, value) {
  console.log("[Access4All Popup] Sending message:", action, value);
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) {
      console.error("[Access4All Popup] No active tab found");
      return;
    }

    const tabId = tabs[0].id;
    console.log("[Access4All Popup] Sending to tab:", tabId);

    chrome.tabs.sendMessage(tabId, { action, value }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("[Access4All Popup] Error:", chrome.runtime.lastError.message);
      } else {
        console.log("[Access4All Popup] Got response:", response);
      }
    });
  });
}

function syncState() {
  console.log("[Access4All Popup] Syncing state from content script");
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) {
      console.error("[Access4All Popup] No active tab found for sync");
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { action: "getState" }, (state) => {
      if (chrome.runtime.lastError) {
        console.error("[Access4All Popup] Error getting state:", chrome.runtime.lastError);
        return;
      }

      console.log("[Access4All Popup] Got state:", state);

      if (!state) return;

      // Update all checkboxes
      document.querySelectorAll("input[type='checkbox']").forEach((cb) => {
        const action = cb.dataset.action;
        cb.checked = !!state[action];
        console.log("[Access4All Popup] Set checkbox", action, "to", cb.checked);
      });

      // Update select dropdown
      const select = document.querySelector("select[data-action='colorBlind']");
      if (select) {
        select.value = state.colorBlind || "";
        console.log("[Access4All Popup] Set color blind to:", state.colorBlind);
      }
    });
  });
}

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("[Access4All Popup] DOM ready, attaching listeners");

  // Checkbox listeners
  document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const action = checkbox.dataset.action;
      const value = checkbox.checked;
      console.log("[Access4All Popup] Checkbox changed:", action, "->", value);
      sendMsg(action, value);
    });
  });

  // Color blind dropdown listener
  const colorBlindSelect = document.querySelector("select[data-action='colorBlind']");
  if (colorBlindSelect) {
    colorBlindSelect.addEventListener("change", (e) => {
      console.log("[Access4All Popup] Color blind changed to:", e.target.value);
      sendMsg("colorBlind", e.target.value);
    });
  }

  // TTS button listener
  const ttsBtn = document.querySelector(".read-btn");
  if (ttsBtn) {
    ttsBtn.addEventListener("click", () => {
      console.log("[Access4All Popup] TTS button clicked");
      sendMsg("tts");
    });
  }

  // Sync state when popup opens
  syncState();
});
