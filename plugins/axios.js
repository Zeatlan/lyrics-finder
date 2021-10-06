const prod = process.env.NODE_ENV === "production";
const prefix = "/api/";

export default function({ $axios }) {
  
  $axios.onRequest(config => {

    alert(process.env.NODE_ENV)
    
    // The proxy is disabled in prod mode => write own rewritePath here
    if (prod && config.url.startsWith(prefix)) {
      config.url = config.url.replace(prefix, process.env.API_BASEURL);
    }
    
    return config;
  });
}