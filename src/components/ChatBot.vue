<template>
  <div class="chatbot-popup">
    <button class="fechar" @click="$emit('fechar')">✖</button>
    <iframe
      src="https://www.chatbase.co/chatbot-iframe/NYPitmz9QeDR0Wm4kEm-H"
      width="300"
      height="400"
      frameborder="0"
    ></iframe>
  </div>
</template>

<style scoped>
.chatbot-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}
.fechar {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  position: absolute;
  top: 4px;
  right: 8px;
  cursor: pointer;
}
</style>
