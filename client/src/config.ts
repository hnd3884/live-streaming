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
     API_URL: 'http://localhost:5000',
     MONTH_NAME : [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
     ]
}

export default configs