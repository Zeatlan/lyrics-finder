import qs from "qs";

export const state = () => ({
  username: process.env.NUXT_ENV_CLIENT_ID,
  password: process.env.NUXT_ENV_CLIENT_SECRET,
  TOKEN: process.env.NUXT_ENV_TOKEN_SPOTIFY,
  data: {}
});

export const mutations = {
  // get Duration in minutes : seconds
  duration(state, ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds}`;
  },
}

export const actions = {
  // Refreshing the token if expired
  refreshToken(context, link) {
    console.log("Token is refreshing", context.state.username);
    const headers = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: context.state.username,
        password: context.state.password,
      },
    };

    const data = {
      grant_type: 'client_credentials',
    };

    this.$axios.$post('https://accounts.spotify.com/api/token', qs.stringify(data), headers)
      .then(response => {
        context.state.TOKEN = response.access_token;
        context.commit('refreshToken', response);
        context.dispatch('sendRequest', link)
      })
      .catch(error => {
        console.log(error);
      });
  },
  // Get informations from Spotify
  sendRequest(context, link) {
    console.log("Request : ", link);
    // Call spotify API for Informations
    return new Promise((resolve, reject) => {
      this.$axios.$get(link, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.TOKEN
        }
      })
        .then(response => {
          const data = response;
          if (!data) throw data;

          console.log("Resolving...")
          resolve(data)
        })
        .catch(data => {
          if (!data) {
            return false;
          } else {
            context.dispatch('refreshToken', link);
          }
        })
    })
  },
}