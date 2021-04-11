import axios from 'axios'
import configs from '../config'

class AuthService {
     login = async (username: String, password: String) => {
          const response = await axios
               .post(configs.API_URL + "/auth/login", {
                    username,
                    password
               });
          if (response.data.token) {
               localStorage.setItem("user", JSON.stringify(response.data));
               return null
          }else {
               return response.data.error
          }
     }

     logout = () => {
          localStorage.removeItem("user");
     }

     register = (username: String, email: String, password: String) => {
          return axios.post(configs.API_URL + "/auth/register", {
               username,
               email,
               password
          });
     }

     getCurrentUser = () => {
          return localStorage.getItem('user')
     }
}

export default new AuthService();