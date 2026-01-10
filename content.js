// This runs on every page automatically
console.log("[Access4All] Content script running on", location.href);

if (!window.access4allInitialized) {
  window.access4allInitialized = true;

  // State
  window.access4allState = {
    dyslexia: false,
    largeText: false,
    letterSpacing: false,
    contrast: false,
    focus: false,
    night: false,
    highlight: false,
    highlightButtons: false,
    ruler: false,
    colorBlind: ""
  };

  // Create style element with !important everywhere
  const styleEl = document.createElement("style");
  styleEl.id = "access4all-styles";
  styleEl.textContent = ""; // Start empty
  
  // Insert at the very start of head
  if (document.head) {
    document.head.insertBefore(styleEl, document.head.firstChild);
  } else if (document.documentElement) {
    document.documentElement.insertBefore(styleEl, document.documentElement.firstChild);
  }

  console.log("[Access4All] Style element inserted");

  // Load saved state
  const hostname = location.hostname;
  console.log("[Access4All] Loading state for hostname:", hostname);
  
  chrome.storage.local.get([hostname], (data) => {
    console.log("[Access4All] Storage data:", data);
    if (data[hostname]) {
      window.access4allState = { ...window.access4allState, ...data[hostname] };
      console.log("[Access4All] Loaded state:", window.access4allState);
    }
    applyStyles();
  });

  function saveState() {
    chrome.storage.local.set({ [hostname]: window.access4allState });
    console.log("[Access4All] State saved");
  }

  function applyStyles() {
    const s = window.access4allState;
    console.log("[Access4All] Applying styles with state:", s);
    
    let css = "";

    // DYSLEXIA MODE
    if (s.dyslexia) {
      css += `
        html * { 
          font-family: Arial, Verdana, Tahoma, sans-serif !important;
          letter-spacing: 0.12em !important;
          line-height: 1.8 !important;
          word-spacing: 0.1em !important;
        }
      `;
      console.log("[Access4All] Dyslexia mode ON");
    }

    // LARGE TEXT
    if (s.largeText) {
      css += `
        html { font-size: 18px !important; }
        body { font-size: 18px !important; }
        h1 { font-size: 32px !important; }
        h2 { font-size: 28px !important; }
        h3 { font-size: 24px !important; }
        p, span, div, a, button, input { font-size: 18px !important; }
      `;
      console.log("[Access4All] Large text ON");
    }

    // LETTER SPACING
    if (s.letterSpacing) {
      css += `
        html * {
          letter-spacing: 0.08em !important;
        }
      `;
      console.log("[Access4All] Letter spacing ON");
    }

    // HIGH CONTRAST
    if (s.contrast) {
      css += `
        html { background: #000 !important; }
        body { 
          background: #000 !important; 
          color: #fff !important; 
        }
        * { 
          background: transparent !important;
          color: #fff !important;
          border-color: #fff !important;
        }
        a { 
          color: #ffff00 !important; 
          text-decoration: underline !important;
        }
        button { 
          background: #fff !important; 
          color: #000 !important; 
          border: 2px solid #fff !important;
        }
        input { 
          background: #333 !important; 
          color: #fff !important; 
          border: 2px solid #fff !important;
        }
        img, video { 
          filter: brightness(1.3) contrast(1.4) !important; 
          opacity: 0.9 !important;
        }
      `;
      console.log("[Access4All] High contrast ON");
    }

    // NIGHT MODE
    if (s.night) {
      css += `
        html { filter: invert(1) hue-rotate(180deg) !important; }
      `;
      console.log("[Access4All] Night mode ON");
    }

    // FOCUS MODE
    if (s.focus) {
      css += `
        nav { display: none !important; }
        aside { display: none !important; }
        footer { display: none !important; }
        [role="banner"] { display: none !important; }
        [role="navigation"] { display: none !important; }
        [role="complementary"] { display: none !important; }
        .ad, .advertisement, .sidebar { display: none !important; }
        main, article, [role="main"] { 
          max-width: 900px !important; 
          margin: 0 auto !important; 
        }
      `;
      console.log("[Access4All] Focus mode ON");
    }

    // HIGHLIGHT LINKS
    if (s.highlight) {
      css += `
        a { 
          outline: 3px solid #ff9800 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 8px rgba(255, 152, 0, 0.8) !important;
        }
      `;
      console.log("[Access4All] Highlight links ON");
    }

    // HIGHLIGHT BUTTONS
    if (s.highlightButtons) {
      css += `
        button { 
          outline: 3px solid #ff9800 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 8px rgba(255, 152, 0, 0.8) !important;
        }
        input[type="button"],
        input[type="submit"],
        input[type="reset"] {
          outline: 3px solid #ff9800 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 8px rgba(255, 152, 0, 0.8) !important;
        }
      `;
      console.log("[Access4All] Highlight buttons ON");
    }

    // COLOR BLINDNESS
    if (s.colorBlind === "protanopia") {
      css += `html { filter: grayscale(0.6) hue-rotate(-15deg) !important; }`;
      console.log("[Access4All] Protanopia mode ON");
    } else if (s.colorBlind === "deuteranopia") {
      css += `html { filter: grayscale(0.6) hue-rotate(30deg) !important; }`;
      console.log("[Access4All] Deuteranopia mode ON");
    } else if (s.colorBlind === "tritanopia") {
      css += `html { filter: grayscale(0.6) hue-rotate(60deg) !important; }`;
      console.log("[Access4All] Tritanopia mode ON");
    }

    // Apply CSS
    const style = document.getElementById("access4all-styles");
    if (style) {
      style.textContent = css;
      console.log("[Access4All] Styles applied to DOM");
    } else {
      console.error("[Access4All] Style element not found!");
    }

    // Handle ruler
    if (s.ruler) {
      initRuler();
    } else {
      removeRuler();
    }
  }

  // READING RULER
  let rulerDiv = null;
  let rulerTop = 0;

  function initRuler() {
    if (rulerDiv) return;
    
    rulerDiv = document.createElement("div");
    rulerDiv.id = "access4all-ruler";
    rulerDiv.style.cssText = `
      position: fixed !important;
      top: 40% !important;
      left: 0 !important;
      width: 100% !important;
      height: 3em !important;
      background: rgba(255, 255, 0, 0.4) !important;
      border-top: 4px solid #ff6600 !important;
      border-bottom: 4px solid #ff6600 !important;
      pointer-events: none !important;
      z-index: 999999 !important;
      box-shadow: 0 0 20px rgba(255, 102, 0, 0.8) !important;
    `;
    
    if (document.body) {
      document.body.appendChild(rulerDiv);
    }
    
    rulerTop = window.scrollY + window.innerHeight * 0.4;
    document.addEventListener("keydown", handleRulerKey);
    console.log("[Access4All] Ruler initialized");
  }

  function removeRuler() {
    if (rulerDiv) {
      rulerDiv.remove();
      rulerDiv = null;
      document.removeEventListener("keydown", handleRulerKey);
      console.log("[Access4All] Ruler removed");
    }
  }

  function handleRulerKey(e) {
    if (!rulerDiv) return;
    
    if (e.key === "ArrowUp") {
      rulerTop = Math.max(0, rulerTop - 30);
      window.scrollTo({ top: rulerTop, behavior: "smooth" });
      e.preventDefault();
      console.log("[Access4All] Ruler moved up to:", rulerTop);
    } else if (e.key === "ArrowDown") {
      rulerTop += 30;
      window.scrollTo({ top: rulerTop, behavior: "smooth" });
      e.preventDefault();
      console.log("[Access4All] Ruler moved down to:", rulerTop);
    }
    
    if (rulerDiv) {
      rulerDiv.style.top = (rulerTop - window.scrollY) + "px";
    }
  }

  // MESSAGE HANDLER
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("[Access4All] Message received:", msg);

    if (msg.action === "tts") {
      const text = window.getSelection().toString().trim();
      console.log("[Access4All] TTS text:", text);
      
      if (text && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        u.pitch = 1;
        u.volume = 1;
        window.speechSynthesis.speak(u);
        sendResponse({ ok: true });
      } else {
        alert("Please select some text to read aloud");
        sendResponse({ ok: false });
      }
    } else if (msg.action === "getState") {
      console.log("[Access4All] State requested, returning:", window.access4allState);
      sendResponse(window.access4allState);
    } else if (msg.action in window.access4allState) {
      const oldValue = window.access4allState[msg.action];
      window.access4allState[msg.action] = msg.value !== undefined ? msg.value : !window.access4allState[msg.action];
      
      console.log(`[Access4All] Toggled ${msg.action}: ${oldValue} -> ${window.access4allState[msg.action]}`);
      
      applyStyles();
      saveState();
      sendResponse({ ok: true });
    }
  });

  // Auto-apply styles on DOM changes (SPA support)
  let applyTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(applyTimeout);
    applyTimeout = setTimeout(applyStyles, 100);
  });
  
  if (document.documentElement) {
    observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true,
      attributes: false,
      characterData: false
    });
  }

  console.log("[Access4All] Content script fully initialized");
}
