<template>
  <div class="music-box music-info">
  
    <a class="back-link" @click="$emit('back')"><font-awesome-icon :icon="['fas', 'arrow-circle-left']" /> Go back</a>

    <div v-if="error" class="error">
      <div class="question-mark">?</div>
      <p>Error : Can't find the music, please retry.</p>
    </div>

    <!-- Informations -->
    <div v-if="title" class="informations">
      
      <div class="contain">
        <!-- Main info -->
        <div class="main-info">
          <a :href="music_url" target="_blank"><h2>{{ title }}</h2></a>
          <p>
            <span v-for="(artist, idx) in artists" :key="idx">
            <a :href="artists_url[idx]" target="_blank">{{ artist }}</a></span>
          </p>
          <a :href="album_url" target="_blank"><p>{{ album }}</p></a>
        </div>
        <!-- END Main Info-->

        <!-- More infos -->
        <div class="info-sup">
          <div class="info-row">
            <span>Release date:</span> 
            <span>{{ release_date }}</span>
          </div>
          
          <div class="info-row"> <span>Length:</span> <span>{{ duration }}</span> </div>

          <div class="info-row">
            <span>Popularity:</span> 
            <span>{{ popularity }}</span>
          </div>

          <div class="info-row">
            <span>Track number:</span> 
            <span>{{ track_number }}</span>
          </div>
        </div>
        <!-- END More infos -->
      </div>
      
    </div>
    <!-- END Informations -->

    <!-- Music portrait -->
    <div class="thumb">
      <div v-if="imgTrack" class="thumbnail" :style="`background-image:linear-gradient(to bottom, rgba(56,31,80,0), rgba(7, 2, 17, 1) 100%), url('${imgTrack}')`"></div>
    </div>
    
    <!-- Spotify music -->
    <iframe v-if="idTrack" :src="`https://open.spotify.com/embed/track/${idTrack}`" 
      width="600" height="80" 
      frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
  </div>
</template>

<script>

  export default {
    name: "Info",
    props: {
      id: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        song: {},
        idTrack: "",
        imgTrack: "",
        title: "",
        album: "",
        artists: [],
        release_date: "",
        duration: "",
        popularity: 0,
        track_number: 0,
        music_url: "",
        artists_url: [],
        album_url: "",
        error: false,
      }
    },
    watch: {
      id(nextLink, prevLink) {
        this.$store.dispatch('spotify/sendRequest', `https://api.spotify.com/v1/tracks/${nextLink}`).then(data => {
          if(data === false) this.error = true;
          else this.assignData(data);
        });
      }
    },
    methods: {
      assignData(data) {
          this.song = data;

          // Error reset
          this.error = false;

          // Informations
          this.idTrack = data.id;
          this.imgTrack = data.album.images[0].url;
          this.title = data.name;
          this.album = data.album.name;
          this.release_date = data.album.release_date;
          this.popularity = data.popularity;
          this.track_number = data.track_number;

          // Links
          this.music_url = data.external_urls.spotify;
          this.album_url = data.album.external_urls.spotify;

          // Duration
          this.duration = this.$store.commit('spotify/duration', data.duration_ms);
          
          // Artists
          this.artists = [];
          this.artists_url = [];

          for(let i = 0; i < data.artists.length; i++){
            this.artists.push(data.artists[i].name);
            this.artists_url.push(data.artists[i].external_urls.spotify);
          }

      },
    }
  }
</script>