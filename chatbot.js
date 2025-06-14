// load-chatbot.js
window.chtlConfig = { chatbotId: "7743599443" };

const script = document.createElement('script');
script.src = "https://chatling.ai/js/embed.js";
script.async = true;
script.setAttribute("data-id", "7743599443");
script.id = "chtl-script";

document.head.appendChild(script);
