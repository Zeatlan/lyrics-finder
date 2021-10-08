<template>
    <div class="music-box music-list">
      <div v-for="(song, idx) in songs" :key="idx" class="card" @click="$emit('displaySong', song.id, song.name, song.artists[0].name)">
        <div class="thumbnail-list"
        :style="`background-image:linear-gradient(to right, rgba(56,31,80,0), rgba(7, 2, 17, 1) 100%), url('${song.album.images[0].url}')`">
        </div>

        <div class="details">
          <div class="infos">
            <h3>{{ song.name }}</h3>
            <span>{{ artists_list(song) }}</span>
            <span>Album: 【{{ song.album.name}}】</span>
            <p>{{ duration(song.duration_ms) }} </p>
          </div>

          <div class="play-button">
            <font-awesome-icon :icon="['fas', 'play']" />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import qs from "qs";

  export default {
    name: "MusicList",
    props: {
      url: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        songs: [],
        TOKEN: process.env.VUE_APP_TOKEN_SPOTIFY,
        error: false,
      }
    },
    watch: {
      url(nextLink, prevLink) {
        this.sendRequest(nextLink)
      }
    },
    methods: {
      // Get Artists list
      artists_list(song) {
        let arts = "";
        for(let i = 0; i < song.artists.length; i++){
          arts += song.artists[i].name;
          if(song.artists[i+1] !== undefined) arts += ", ";
        }
        return arts;
      },
      // Get music duration in minutes and seconds
      duration(ms) {
          const minutes = Math.floor(ms / 60000);
          const seconds = ((ms % 60000) / 1000).toFixed(0);
          return `${minutes}:${seconds}`;
      },
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
        console.log(process.env.VUE_APP_CLIENT_ID, process.env.VUE_APP_CLIENT_SECRET);
        // Call spotify API for Informations
        this.$axios.$get(`https://api.spotify.com/v1/search?${link}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.TOKEN
          }
        })
        .then(response => {
          const data = response.tracks.items;
          if(!data) throw data;

          // Error reset
          this.error = false;

          this.songs = data;
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