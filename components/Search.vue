<template>
  <div id="search">
    <h1 class="center">Lyrics Finder</h1>
    <input v-model="title" class="search__input" type="text" placeholder="Search your song" @keyup.enter="$emit('music', title_space)">
    <p class="hint">Press <span>↵ Enter</span> key for searching the lyrics of your song.</p>
  </div>
</template>

<script>
  export default {
    emits: ['music'],
    data() {
      return {
        artist: "",
        title: "",
      }
    },
    computed: {
      title_space() {
        return this.title.split(' ').join('%20');
      }
    }
  }
</script>