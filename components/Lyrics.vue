<template>
  <div class="show-lyrics">
    <div v-show="lyrics">
      <h3 class="center">Lyrics</h3>
      <div class="pre-formatted">{{ full }}</div>
    </div>

    <p v-show="error" class="error-body">
      Woops. Can't find the lyrics of this music in our database, please retry.
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      url: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        lyrics: "",
        error: false,
      }
    },
    computed: {
      full() {
        return this.lyrics.replace(/(^[A-Z][a-z]*)/g, '\n $1').trim();
      }
    },
    watch: {
      // Change Lyrics 
      url(nextLink, prevLink) {
        this.$axios.$get(`/api/matcher.lyrics.get?${nextLink}&apikey=${process.env.NUXT_ENV_API_KEY}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if(response.message.body.length === 0) throw response.message.body.length;

          // Error reset
          this.error = false;

          this.lyrics = response.message.body.lyrics.lyrics_body;
        })
        .catch(bodyLength => {
          if(bodyLength === 0)
            this.error = true;
        })
      }
    }
  }
</script>