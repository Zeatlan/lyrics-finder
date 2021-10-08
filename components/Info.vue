<template>
  <div class="music-box music-info">

    <div v-if="error" class="error">
      <div class="question-mark">?</div>
      <p>Error : Can't find the music, please retry.</p>
    </div>
  
    <a class="back-link" @click="$emit('back')"><font-awesome-icon :icon="['fas', 'arrow-circle-left']" /> Go back</a>

    <!-- Informations -->
    <div v-if="title" class="informations">
      <!-- Main info -->
      <div class="contain">
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
          
          <div class="info-row">
            <span>Length:</span> 
            <span>{{ duration }}</span>
          </div>

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
    <div v-if="imgTrack" class="thumbnail" :style="`background-image:linear-gradient(to bottom, rgba(56,31,80,0), rgba(7, 2, 17, 1) 100%), url('${imgTrack}')`"></div>

    
    <!-- Spotify music -->
    <iframe v-if="idTrack" :src="`https://open.spotify.com/embed/track/${idTrack}`" 
      width="600" height="80" 
      frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
  </div>
</template>

<script>
  import qs from "qs";

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
        TOKEN: process.env.VUE_APP_TOKEN_SPOTIFY,
        error: false,
      }
    },
    watch: {
      id(nextLink, prevLink) {
        this.sendRequest(nextLink)
      }
    },
    methods: {
      // Refreshing the token if expired
      refreshToken(link) {
        const headers = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: process.env.VUE_APP_CLIENT_ID,
            password: process.env.VUE_APP_CLIENT_SECRET,
          },
        };

        const data = {
          grant_type: 'client_credentials',
        };

        this.$axios.$post('https://accounts.spotify.com/api/token', qs.stringify(data), headers)
        .then(response => {
          this.TOKEN = response.access_token;
          this.sendRequest(link);
        })
        .catch(error => {
          console.log(error);
        });
      },
      // Get informations from Spotify
      sendRequest(link) {
        // Call spotify API for Informations
        this.$axios.$get(`https://api.spotify.com/v1/tracks/${link}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.TOKEN
          }
        })
        .then(response => {
          const data = response;
          if(!data) throw data;

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
          const minutes = Math.floor(data.duration_ms / 60000);
          const seconds = ((data.duration_ms % 60000) / 1000).toFixed(0);
          this.duration = `${minutes}min ${seconds}sec`;
          
          // Artists
          this.artists = [];
          this.artists_url = [];
          for(let i = 0; i < data.artists.length; i++){
            this.artists.push(data.artists[i].name);
            this.artists_url.push(data.artists[i].external_urls.spotify);
          }
        })
        .catch(data => {
          if(!data){
            this.error = true;
          }else{
            this.refreshToken(link);
          }
        })
      }
    }
  }
</script>