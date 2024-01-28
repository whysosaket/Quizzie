import { createContext } from "react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const GlobalContext = createContext();
let url = import.meta.env.VITE_URL;

const GlobalState = (props) => {
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState({ name: "", email: "", quizCreated: 0, questionsCreated: 0, totalImpressions: 0});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const toastMessage = (message, type) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else toast.info(message);
  };

  const login = async (email, password) => {
    setProgress(20);
    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      setProgress(40);
      const data = await response.json();
      setProgress(60);
      if (data.success) {
        setUser({
          name: data.data.name,
          email: data.data.email,
          quizCreated: data.data.quizCreated,
          questionsCreated: data.data.questionsCreated,
          totalImpressions: data.data.totalImpressions
        });
        localStorage.setItem("token", data.token);
        toastMessage(data.info, "success");
        setIsAuthenticated(true);
        setProgress(100);
        return true;
      } else {
        toastMessage(data.error, "warning");
        setProgress(100);
        return false;
      }
    } catch (error) {
      setProgress(100);
      console.log(error);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    setProgress(20);
    try {
      const response = await fetch(`${url}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      setProgress(40);
      const data = await response.json();
      setProgress(60);
      if (data.success) {
        toastMessage(data.info, "success");
        setProgress(100);
        return true;
      } else {
        toastMessage(data.error, "warning");
        setProgress(100);
        return false;
      }
    } catch (error) {
      console.log(error);
      setProgress(100);
      return false;
    }
  };


  const handleLogout = () => {
    console.log("logout");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser({ name: "", email: "", mobile: "" });
    return true;
  };

  return (
    <GlobalContext.Provider
      value={{ login, signup, progress,setProgress, user, handleLogout, isAuthenticated, toastMessage }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export { GlobalState };

export default GlobalContext;
