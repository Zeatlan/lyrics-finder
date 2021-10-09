<template>
    <div class="music-box music-list">    
      
      <div v-if="error" class="error">
        <div class="question-mark">?</div>
        <p>Error : Can't find the music, please retry.</p>
      </div>

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
        error: false,
      }
    },    
    watch: {
      url(nextLink, prevLink) {
        this.$gsap.to(".music-list .card", 0.3, {
          display: "none",
          opacity: 0
        })

        this.$store.dispatch('spotify/sendRequest', `https://api.spotify.com/v1/search?${nextLink}`).then(predata => {
          if(predata === false){
             this.error = true;
          }else {
            this.error = false;
            const data = predata.tracks.items;
            this.songs = data;
          
            this.$gsap.to(".music-list .card", 0.3, {
              display: "flex",
              opacity: 1
            })
          }
          
          this.$emit('error', this.error);
        }).catch(() => {
          this.error = true;
        })
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
    
      duration(ms) {
        return this.$store.commit('spotify/duration', ms);
      }
    }
  }
</script>