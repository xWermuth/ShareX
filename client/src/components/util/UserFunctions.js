import axios from "axios";
const proxy = "http://localhost:8000/auth/";

export const register = async (newUser) => {
  try {
    const request = await axios.post(
      `${process.env.REACT_APP_PROXY}auth/signup`,
      {
        email: newUser.email,
        handle: newUser.handle,
        password: newUser.password,
      }
    );

    localStorage.setItem("user_token", request.data);
    return request;
  } catch (err) {
    return err;
  }
};

export const login = async (user) => {
  try {
    const request = await axios.post(
      `${process.env.REACT_APP_PROXY}auth/login`,
      {
        email: user.email,
        password: user.password,
      }
    );

    localStorage.setItem("user_token", request.data.token);
    return request;
  } catch (err) {
    return err;
  }
};

export const getFeed = () => {
  let token = localStorage.getItem("user_token");

  if (token === null) {
    console.log("You have not logged in yet - handle error");
    // HANDLE ERROR HERE
  }

  return axios
    .get("screams/allScreams", {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      console.log(res.data.screams);
      return res.data;
    })
    .catch((err) => console.log(err));
};
