// --- BAGIAN 1: Kode untuk Menu, Favicon, dan Iklan ---
(function(){
  // ======= PENGATURAN =======
  var showAd = true;
  var menuItems = [
    { text: "Home", link: "#" },
    { text: "Produk", link: "#" },
    { text: "Kontak", link: "#" }
  ];
  var faviconPath = 'https://raw.githubusercontent.com/animalpsychic/chatai/refs/heads/main/public/favicon.png';
  var faviconType = 'image/png';
  // ==========================

  // Pasang favicon
  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = faviconType;
  link.href = faviconPath;
  document.head.appendChild(link);

  // CSS untuk seluruh halaman dan chat widget
  var css = `
    /* Aturan global */
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
    }

    /* Header Menu */
    .top-menu {
      background: #222;
      color: #fff;
      display: flex;
      gap: 20px;
      padding: 10px 20px;
    }
    .top-menu a {
      color: #fff;
      text-decoration: none;
      font-weight: bold;
    }
    .top-menu a:hover {
      text-decoration: underline;
    }

    /* Header styling */
    header {
      text-align: center;
      padding: 40px 20px;
      background-color: #2c3e50;
      color: white;
    }

    /* Chat toggle button container */
    .chat-toggle-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    /* Main chat button style */
    .open-chat-button {
      background-color: #4caf50;
      color: white;
      border: none;
      padding: 15px 30px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 18px;
      cursor: pointer;
      border-radius: 50px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .open-chat-button:hover {
      background-color: #45a049;
      transform: translateY(-2px);
    }

    .open-chat-button i {
      margin-right: 10px;
    }

    /* Main chat widget container - Hidden by default */
    .chat-container {
      display: none;
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    /* Class to show the chat widget */
    .chat-container.active {
      display: flex;
    }

    /* Chat header */
    .chat-header {
      background-color: #2c3e50;
      color: #fff;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .chat-header p {
      margin: 0;
      font-weight: bold;
    }

    .close-chat-button {
      background: none;
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
    }

    /* Chat messages area */
    .chat-messages {
      flex-grow: 1;
      padding: 20px;
      overflow-y: auto;
    }

    /* Individual message styling */
    .message {
      margin-bottom: 10px;
      display: flex;
    }

    .user-message {
      justify-content: flex-end;
    }

    .assistant-message {
      justify-content: flex-start;
    }

    .user-message p {
      background-color: #007bff;
      color: white;
      border-radius: 20px 20px 0 20px;
      padding: 10px 15px;
      max-width: 80%;
    }

    .assistant-message p {
      background-color: #e2e2e2;
      color: #333;
      border-radius: 20px 20px 20px 0;
      padding: 10px 15px;
      max-width: 80%;
    }

    /* Typing indicator */
    .typing-indicator {
      padding: 10px 20px;
      color: #888;
      font-style: italic;
      display: none;
    }

    .typing-indicator.visible {
      display: block;
    }

    /* Message input area */
    .message-input {
      display: flex;
      padding: 10px;
      border-top: 1px solid #ddd;
    }

    #user-input {
      flex-grow: 1;
      border: 1px solid #ccc;
      border-radius: 20px;
      padding: 10px;
      resize: none;
      margin-right: 10px;
      box-sizing: border-box;
    }

    #send-button {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 16px;
    }

    #send-button:hover {
      background-color: #0056b3;
    }

    /* Footer styling */
    footer {
      text-align: center;
      padding: 20px;
      background-color: #333;
      color: white;
    }

    /* Floating Ad */
    .floating-ad {
      position: fixed;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: calc(100% - 40px);
      background: #ffcc00;
      color: #000;
      text-align: center;
      font-weight: bold;
      padding: 10px 10px;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.15);
      z-index: 9999;
    }
    .floating-ad a {
      color: inherit;
      text-decoration: none;
    }
    .close-btn {
      position: absolute !important;
      top: 50% !important;
      right: 10px !important;
      transform: translateY(-50%) !important;
      background: #000 !important;
      color: #fff !important;
      border: none !important;
      border-radius: 50% !important;
      width: 22px !important;
      height: 22px !important;
      font-size: 16px !important;
      line-height: 20px !important;
      text-align: center !important;
      cursor: pointer !important;
      z-index: 2147483647 !important;
      display: inline-block !important;
    }

    /* --- Media Query untuk perangkat mobile --- */
    @media (max-width: 600px) {
      .chat-container {
        bottom: 60px;
        right: 0;
        width: 100%;
        height: calc(100% - 60px);
        border-radius: 0;
        box-shadow: none;
        transition: none;
      }
    
      body {
        padding-bottom: 60px;
      }
    
      /* Aturan untuk iklan melayang di mobile */
      .floating-ad {
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        border-radius: 0;
        padding: 10px;
        box-sizing: border-box; /* Ditambahkan */
      }
    }
  `;

  var style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);

  // Menu Header
  var menu = document.createElement('div');
  menu.className = 'top-menu';
  menu.innerHTML = menuItems.map(item => `<a href="${item.link}">${item.text}</a>`).join('');
  document.body.insertBefore(menu, document.body.firstChild);

  // Floating Ad
  if(showAd){
    var ad = document.createElement('div');
    ad.className = 'floating-ad';

    var btn = document.createElement('button');
    btn.className = 'close-btn';
    btn.innerHTML = '&times;';
    btn.addEventListener('click', function(){
      ad.remove();
    });

    var link = document.createElement('a');
    link.href = '#';
    link.target = '_blank';
    link.textContent = '🔥 Promo Spesial! Diskon 50%';

    ad.appendChild(btn);
    ad.appendChild(link);
    document.body.appendChild(ad);
  }
})();

// --- BAGIAN 2: Kode untuk Chat App yang sudah diperbaiki ---

// Inisialisasi DOM elements dan event listeners
function initializeChatWidget() {
  const openChatBtn = document.getElementById("open-chat-button");
  const closeChatBtn = document.getElementById("close-chat-button");
  const chatWidget = document.getElementById("chat-widget");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const typingIndicator = document.getElementById("typing-indicator");

  // Chat state
  let chatHistory = [
    {
      role: "assistant",
      content: "Ceritain mimpi kamu hari ini, nanti aku kasih tahu angkanya?",
    },
  ];
  let isProcessing = false;

  // Logika untuk Buka/Tutup Chat Widget
  if (openChatBtn && closeChatBtn && chatWidget) {
    openChatBtn.addEventListener("click", () => {
      chatWidget.classList.add("active");
      openChatBtn.style.display = "none";
    });

    closeChatBtn.addEventListener("click", () => {
      chatWidget.classList.remove("active");
      openChatBtn.style.display = "block";
    });
  }

  // Auto-resize textarea as user types
  userInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Send message on Enter (without Shift)
  userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Send button click handler
  sendButton.addEventListener("click", sendMessage);

  /**
   * Sends a message to the chat API and processes the response
   */
  async function sendMessage() {
    const message = userInput.value.trim();

    // Don't send empty messages
    if (message === "" || isProcessing) return;

    // Disable input while processing
    isProcessing = true;
    userInput.disabled = true;
    sendButton.disabled = true;

    // Add user message to chat
    addMessageToChat("user", message);

    // Clear input
    userInput.value = "";
    userInput.style.height = "auto";

    // Show typing indicator
    typingIndicator.classList.add("visible");

    // Add message to history
    chatHistory.push({ role: "user", content: message });

    try {
      // Create new assistant response element
      const assistantMessageEl = document.createElement("div");
      assistantMessageEl.className = "message assistant-message";
      assistantMessageEl.innerHTML = "<p></p>";
      chatMessages.appendChild(assistantMessageEl);

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Send request to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatHistory,
        }),
      });

      // Handle errors
      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Process streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let responseText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode chunk
        const chunk = decoder.decode(value, { stream: true });

        // Process SSE format
        const lines = chunk.split("\n");
        for (const line of lines) {
          try {
            const jsonData = JSON.parse(line);
            if (jsonData.response) {
              // Append new content to existing text
              responseText += jsonData.response;
              assistantMessageEl.querySelector("p").textContent = responseText;

              // Scroll to bottom
              chatMessages.scrollTop = chatMessages.scrollHeight;
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }

      // Add completed response to chat history
      chatHistory.push({ role: "assistant", content: responseText });
    } catch (error) {
      console.error("Error:", error);
      addMessageToChat(
        "assistant",
        "Sorry, there was an error processing your request."
      );
    } finally {
      // Hide typing indicator
      typingIndicator.classList.remove("visible");

      // Re-enable input
      isProcessing = false;
      userInput.disabled = false;
      sendButton.disabled = false;
      userInput.focus();
    }
  }

  /**
   * Helper function to add message to chat
   */
  function addMessageToChat(role, content) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${role}-message`;
    messageEl.innerHTML = `<p>${content}</p>`;
    chatMessages.appendChild(messageEl);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

async function loadChatWidget() {
  try {
    const response = await fetch('chat-widget.html');
    const htmlContent = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv.firstChild);

    // Setelah widget chat dimuat, baru kita panggil fungsi inisialisasi
    initializeChatWidget();

  } catch (error) {
    console.error("Gagal memuat chat widget:", error);
  }
}

// Panggil fungsi ini saat halaman sudah dimuat
document.addEventListener('DOMContentLoaded', loadChatWidget);
