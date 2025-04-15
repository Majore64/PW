<template>
    <button class="btn btn-link text-dark text-decoration-none">
      <i class="bi" :class="`bi-${icon}`"></i>
      <small class="d-block">{{ text }}</small>
    </button>
  </template>
  
  <script>
  export default {
    props: {
      icon: String,
      text: String
    }
  }
  </script>