if (!window.accessAllLoaded) {
  window.accessAllLoaded = true;

  const style = document.createElement("style");
  style.id = "accessall-style";
  document.head.appendChild(style);

  window.addEventListener("accessall-toggle", e => {
    const action = e.detail;

    /* ---------- GLOBAL SITE-WIDE FEATURES ---------- */
    if (action === "dyslexia") {
      style.innerHTML += `
        body {
          font-family: Arial, Verdana, sans-serif !important;
          letter-spacing: 0.12em !important;
          line-height: 1.8 !important;
          text-align: left !important;
        }
      `;
    }

    if (action === "contrast") {
      style.innerHTML += `
        html, body {
          background: #000 !important;
          color: #fff !important;
        }
        img, video {
          filter: contrast(1.2) brightness(1.1) !important;
        }
      `;
    }

    if (action === "focus") {
      style.innerHTML += `
        nav, aside, footer, iframe, ads {
          display: none !important;
        }
      `;
    }

    if (action === "largeText") {
      style.innerHTML += `
        body {
          font-size: 125% !important;
        }
      `;
    }

    /* ---------- READ ALOUD (SELECTION ONLY) ---------- */
    if (action === "tts") {
      const selectedText = window.getSelection().toString().trim();

      if (!selectedText) {
        alert("Please select text to read aloud.");
        return;
      }

      // Stop any existing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(selectedText);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;

      speechSynthesis.speak(utterance);
    }
  });
}
