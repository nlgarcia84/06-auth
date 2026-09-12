import { logout, registerUser } from "./auth";
import { loginUser } from "./auth/login.action";

export const server = {
  // actions

  // auth
  registerUser,
  loginUser,
  logout,
};
