import axios from 'axios';
axios.defaults.withCredentials = true;
async function t() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/user/login', {
      email: 'testingadmin@gmail.com',
      password: 'password'
    });
    const cookies = res.headers['set-cookie'];
    console.log("Logged in. Cookies:", cookies);
    
    // now try profile update
    const res2 = await axios.put('http://localhost:5000/api/v1/user/update', {
        fullName: "Test Update"
    }, {
      headers: { Cookie: cookies[0] }
    });
    console.log("Update success:", res2.data);
  } catch(e) {
    if(e.response) {
      console.log("Error status:", e.response.status);
      console.log("Error data:", e.response.data);
    } else {
      console.log("Error:", e.message);
    }
  }
}
t();
