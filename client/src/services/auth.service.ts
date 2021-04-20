import axios from 'axios'
import configs from '../config'

class AuthService {
     login = async (username: String, password: String) => {
          const response = await axios.post(configs.API_URL + "/auth/login", {
               username,
               password
          });
          if (response.data.token) {
               localStorage.setItem("user", JSON.stringify(response.data));
               return null
          } else {
               return response.data.error
          }
     }

     logout = () => {
          localStorage.removeItem("user");
     }

     register = async (username: String, email: String, password: String, name: String) => {
          const response = await axios.post(configs.API_URL + "/user/add", {
               username,
               name,
               email,
               password
          });

          return response
     }

     getCurrentUser = () => {
          return localStorage.getItem('user')
     }
}

export default new AuthService();