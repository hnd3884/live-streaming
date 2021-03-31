export default config = {
     NODE_IP: 'localhost',
     NODE_PORT: 5000,
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
     }
}