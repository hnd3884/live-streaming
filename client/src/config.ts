const configs = {
     VIDEO_CONSTRAINS: {
          video: true,
          audio: true
     },
     STUN_CONFIG: {
          iceServers: [
               {
                    urls: ["stun:stun.l.google.com:19302"]
               }
          ]
     },
     API_URL: 'http://localhost:5000'
}

export default configs