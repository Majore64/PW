<template>
    <div class="card mb-3 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">{{ title }}</h5>
        <p class="card-text text-muted">{{ location }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      location: String
    }
  }
  </script>