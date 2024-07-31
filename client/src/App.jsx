  import React, { useEffect, useState } from "react";
  import "bootstrap/dist/css/bootstrap.min.css";
  import Routing from "./Router/Routing";
  import contextApi from "./contextApi/ContextApi";
  import axios from "axios";

  const App = () => {
    const [user, setUser] = useState({});
    const [history, setHistory] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loginModal, setLoginModal] = useState(false)

    useEffect(() => {
      const autoLogin = async () => {
        if (token) {
          try {
            const res = await axios.get("https://shortlypro.vercel.app/auth/user", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });
            setUser(res.data.user);
          } catch (error) {
            console.error("Auto login failed", error);
            localStorage.removeItem("token");
          }
        }
      };
      autoLogin();
    }, [token]);

    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8080/auth/urls", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setHistory(res.data.url);
      } catch (error) {
        console.log("Server error", error);
      }
    };

    useEffect(() => {
      if (localStorage.getItem("token")) {
        fetchHistory();
      }
    }, [token]);

    const handleLoginSuccess = () => {
      fetchHistory();
    };

    return (
      <contextApi.Provider
        value={{ setUser, user, token, history, setHistory, handleLoginSuccess, setLoginModal, loginModal }}
      >
        <Routing />
      </contextApi.Provider>
    );
  };

  export default App;
