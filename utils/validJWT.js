import { getCookie } from "cookies-next";
import { useUserContext } from "../context/state";

const jwt = require("jsonwebtoken");

export const validJWT = async (router) => {
   const token = await getCookie('accessToken')
   const PRIVATE_KEY = process.env.PRIVATE_KEY;
   if (token) {
      const checkJWT = await jwt.decode(token, PRIVATE_KEY);
      if (checkJWT) {
         router.push("/");
      } else {
         router.push("/users/login");
      }
   } else {
      router.push("/users/login");
   }
};
