export const getAuthHeader = () => {
     const user = localStorage.getItem('user');

     if (user) {
          const userJson = JSON.parse(user)
          return { 'x-access-token': userJson.accessToken };
     } else {
          return {};
     }
}