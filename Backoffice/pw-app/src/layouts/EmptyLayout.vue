<template>
    <div class="empty-layout d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div class="card p-4" style="width: 100%; max-width: 400px;">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EmptyLayout'
  }
  </script>
  
  <style scoped>
  .empty-layout {
    background-color: #f8f9fa;
  }
  </style>