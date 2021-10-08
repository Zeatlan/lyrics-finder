<template>
  <div class="container">
    <div class="lyrics">
      <Search @music="music" />
      <Lyrics :url="urlMusix" />

      <p class="info-body">
        Click on a song to get his lyrics.
      </p>
    </div>
    
    <MusicList :url="urlSpotify" @displaySong="display_song" />
    <Info :id="musicId" @back="back" />
    
  </div>
</template>

<script>
import Search from '../components/Search.vue';
import MusicList from '../components/MusicList.vue';
import Info from '~/components/Info.vue';

export default {
  components: {
    Search,
    MusicList,
    Info
  },
  data() {
    return {
      urlMusix: '',
      urlSpotify: '',
      musicId: '',
      firstTime: true,
      displaySong: false,
    }
  },
  watch: {
    displaySong(nextVal, perviousVal) {
      const gsap = this.$gsap;

      const tl = gsap.timeline();
      const tl2 = gsap.timeline();

      if(nextVal === true){
        tl.to(".music-list", 0.5, {
          opacity: 0,
          y: 300,
          display: "none"
        })
        .to(".music-info", 0.5, {
          opacity: 1,
          y: 0,
          display: "flex"
        });

        tl2.to(".info-body", 0.6, {
          opacity: 0,
          display: "none",
          y: 300
        })
        .to(".show-lyrics", 0.6, {
          opacity: 1,
          display: "block",
          y:0
        });

        if(window.innerWidth > 1200){
          gsap.set('.lyrics', {
            position: 'absolute'
          });
          gsap.set('.music-info', {
            position: 'fixed'
          });
        }

      }else {
        tl.to(".music-info", 0.5, {
          opacity: 0,
          y: 300,
          display: "none"
        })
        .to(".music-list", 0.5, {
          opacity: 1,
          y: 0,
          display: "flex"
        });

        tl2.to(".show-lyrics", 0.6, {
          opacity: 0,
          display: "none",
          y:300
        })
        .to(".info-body", 0.6, {
          opacity: 1,
          display: "block",
          y: 0
        });
        
        if(window.innerWidth > 1200){
          gsap.set('.lyrics', {
            position: 'fixed'
          });
        }
      }
    }
  },
  methods: {
    back() {
      this.displaySong = false;
    },
    // Display music list
    music(title) {
      if(this.firstTime){
        this.animateFirstTime();
      }

      this.displaySong = false;
      this.urlSpotify = `q=${title}&type=track%2Cartist&limit=10`;
    },
    // Display the song with his lyrics and informations
    display_song(id, title, artist) {
      this.displaySong = true;
      this.musicId = id;
      this.urlMusix = `q_artist=${artist}&q_track=${title}`;
    },
    animateFirstTime() {
      const gsap = this.$gsap;
      // Timeline First time
      // Load everything
      const tlFt = gsap.timeline();

      // INFO: Inputs value
      const inputs = {
        width: "90%"
      }

      // INFO: Lyrics block
      const lyrics = {
        position: 'fixed',
        width: "33%",
        display: "block",
        minHeight: "100vh",
        background: "#15092e",
      }

      // INFO: Tablet responsive
      if(window.innerWidth <= 768){
        inputs.width = "75%";
        lyrics.position = 'relative';
        lyrics.width = "100%";
        lyrics.minHeight = "auto";
      }

      // INFO: Mobile responsive
      if(window.innerWidth <= 480) {
        lyrics.minHeight = "auto";
      }

      tlFt
        // First transition
        .to('#search h1', {opacity: 0, y:-300, duration: 0.3})
        .to('#search input', { css: {
          x: -300,
          width: '34%',
          margin: '0',
          opacity: 0,
        }, duration: 0.3})
        .to("p.hint", 0.3, { css: {
          x: -300
        }})
        .to("#search", 0.3, { css: { 
          scale: 0
        }})
        .to("p.hint", 0.3, { css: {
          display: "none"
        }})
        // Window is moving + Appear
        .to('.lyrics', 1, {
          css: lyrics
        })
        .to("#search", 0.3, { css: {
          background: "none",
          width: "100%",
          padding: "0",
          boxShadow: "none",
          scale: 1
        }})
        .to('#search h1', { opacity: 1, y:0, duration: 0.3})
        .to('#search input', { css: {
          width: inputs.width,
          opacity: 1,
          x:0
        }, duration: 0.3})
        .to(".music-list", 0.3, {
          opacity: 1,
          y: 0,
          display: "flex"
        })
        .to('.info-body', 0.3, { css: { display:"block", opacity: 1}});

        this.firstTime = false;
    }
  }
}
</script>