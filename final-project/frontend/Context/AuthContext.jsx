// import { createContext, useEffect, useState } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");

//     // If the user is logged in and data is available in localStorage
//     if (storedUser) {
//       setUser(storedUser);
//       setIsLoading(false);
//     } else {
//       setIsLoading(false);
//     }
//   }, []);

//   const fetchUserData = async (email) => {
//     try {
//       console.log(email);
//       const response = await fetch(`http://localhost:5000/auth/profile/${email}`);

//       const data = await response.json();
//       console.log(data);

//       if (data.success) {
//         setUser(data.user);
//         localStorage.setItem("user", JSON.stringify(data.user)); 
//       }
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const login = async (userData) => {
//     localStorage.setItem("isLoggedIn", "true");
//     // localStorage.setItem("user", JSON.stringify(userData));
//     setIsLoggedIn(true);

//     fetchUserData(userData.email);
//   };

//   const logout = () => {
//     localStorage.setItem("isLoggedIn", "false");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// // };












import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");

    if (storedUser) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/profile/${email}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    fetchUserData(userData.email);
  };

  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoggedIn, login, logout, isLoading, fetchUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};



