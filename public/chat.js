// --- BAGIAN 1: Kode untuk Menu, Favicon, dan Iklan (Sama seperti sebelumnya) ---
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

  // CSS untuk menu dan iklan
  var css = `
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
      padding: 10px 40px 10px 10px;
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
