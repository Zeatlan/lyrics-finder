<template>
  <div class="container">
    <div class="lyrics">
      <Search @music="music" />
      <Lyrics :url="urlMusix" />

      <p v-if="!error" class="info-body">
        Click on a song to get his lyrics.
      </p>
      <p v-else class="info-body">
        Woops. Can't find any music corresponding your research.
      </p>
    </div>
    
    <MusicList :url="urlSpotify" @error="switch_error" @displaySong="display_song" />
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
      error: false,
    }
  },
  watch: {
    // Display song informations and lyrics
    displaySong(nextVal, perviousVal) {
      const gsap = this.$gsap;

      const tl = gsap.timeline();
      const tl2 = gsap.timeline();

      // On music information (+ Lyrics)
      if(nextVal === true){
        tl
        .to(".music-list .card", 0.2, {
          opacity: 0,
          y: 100,
          stagger: {
            each: 0.1,
            from: "center"
          }
        })
        .to(".music-list", 0.2, {
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
          display: "none"
        })
        .to(".show-lyrics", 0.6, {
          opacity: 1,
          display: "block",
        });

        if(window.innerWidth > 1200){
          gsap.set('.lyrics', {
            position: 'absolute'
          });
          gsap.set('.music-info', {
            position: 'fixed'
          });
        }

      }else { // On music list
        tl.to(".music-info", 0.5, {
          opacity: 0,
          y: -300,
          display: "none"
        })
        .to(".music-list", 0.2, {
          opacity: 1,
          y: 0,
          display: "flex"
        })
        .to(".music-list .card", 0.2, {
          opacity: 1,
          y: 0,
          stagger: 0.1
        });

        tl2.to(".show-lyrics", 0.6, {
          opacity: 0,
          display: "none"
        })
        .to(".info-body", 0.6, {
          opacity: 1,
          display: "block"
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
    // Going back to music listing
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
    switch_error(error) {
      this.error = error;
    },
    // Animation on the index page
    // on the first opening of the website.
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
        .to("#search h1, #search input", 0.3, {
          opacity: 0
        })
        .to('#search input', 0.1, {
          width: inputs.width,
          margin: '0',
        })
        .to("#search", 0.3, {
          width: "100%",
          padding: "0",
        })
        .to("p.hint", 0.5, {
          y: 300,
          opacity: 0,
          display: "none"
        })
        // Window is moving
        // Music list is appearing
        .to('.lyrics', 1, {
          css: lyrics
        })
        .to('#search h1', 0.3, { opacity: 1, y:0, scale: 1})
        .to('#search input', 0.3, {
          width: inputs.width,
          opacity: 1,
          y:0,
          scale: 1,
        })
        .to(".music-list", 0.3, {
          opacity: 1,
          y: 0,
          display: "flex",
          stagger: 0.3
        })
        .to('.info-body', 0.3, { display:"block", opacity: 1});

        this.firstTime = false;
    }
  }
}
</script>