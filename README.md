# Access4All — Universal Website Accessibility Extension

**Access4All** is a lightweight Chrome extension that instantly adds accessibility tools to **any website**, helping users with dyslexia, visual impairments, focus difficulties, and reading challenges.

No accounts. No payments. No setup per site.
It works everywhere.

---

## 🌍 Why Access4All?

Many websites are not designed with accessibility in mind.
Access4All empowers users by letting them **adapt the web to their needs**, instead of relying on every site to do the right thing.

### Who it helps

* People with **dyslexia**
* Users with **low vision**
* People who benefit from **high contrast**
* Users who need **text-to-speech**
* Anyone who wants a distraction-free reading experience

---

## ✨ Features

### Reading & Dyslexia

* **Dyslexia-Friendly Mode**
  Improves readability with better spacing, line height, and font clarity.
* **Larger Text Mode**
  Increases text size across the entire page.

### Vision & Focus

* **High Contrast Mode**
  Converts pages to dark background with bright text.
* **Focus Mode**
  Hides ads, nav bars, sidebars, and visual clutter.

### Assistive

* **Read Selected Text Aloud**
  Select any text on a page → click “Read Selected Text” → instant speech.
  (Nothing is read unless the user selects text.)

---

## 🔒 Privacy

* Runs **entirely in the browser**
* No data collection
* No external servers
* No tracking
* No accounts

---

## 🧠 How It Works (Technical Overview)

* **Content Script** injects accessibility styles directly into the page
* **Popup UI** controls features with synced toggle state
* Uses:

  * Native browser APIs
  * `speechSynthesis` for text-to-speech
  * CSS injection for accessibility transformations
* Designed to work on:

  * Static websites
  * Dynamic sites (React, Next.js, SPAs)
  * Pages that update content live

---

## 🚀 How to Run Access4All on Your Computer (Chrome)

### 1️⃣ Download the Project and unzip it

Make sure you have these files in **one folder**:

```
Access4All/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
```

---

### 2️⃣ Open Chrome Extensions Page

* Open Google Chrome
* Go to:
  **chrome://extensions**

---

### 3️⃣ Enable Developer Mode

* Toggle **Developer mode** ON (top-right corner)

---

### 4️⃣ Load the Extension

* Click **“Load unpacked”**
* Select the `Access4All` folder

✅ The extension is now installed.

---

### 5️⃣ Use the Extension

1. Visit **any website**
2. Click the **Access4All icon** in the Chrome toolbar
3. Toggle accessibility features instantly
4. Select text → click **Read Selected Text** to hear it aloud

No page reloads required.

---

## 🛠️ Known Limitations

* Some extremely locked-down sites may partially override styles
* Read-aloud depends on browser speech support (available in Chrome by default)

---

## 📌 Future Improvements

* Per-site saved preferences
* Keyboard shortcuts
* Reading ruler / line focus
* Color-blindness modes
* Firefox & Edge support

---

## 🏆 Hackathon Notes

* Zero paid APIs
* Zero setup for users
* Works immediately on any site
* Designed with accessibility best practices in mind

---
