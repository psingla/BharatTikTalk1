import { useContext } from "react";

import AuthContext from "./context";
import authStorage from "./storage";

export default useAuth = () => {
  const {user, setUser } = useContext(AuthContext);
  //const user = JSON.parse(user);
  const logIn = (user) => {
    setUser(user);
    authStorage.storeUser(user);
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
  };

  return {user, logIn, logOut };
};
