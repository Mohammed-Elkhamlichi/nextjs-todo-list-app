import Link from "next/link";
import axios from "axios";
import { useRef, useEffect } from "react";
import { useUserContext } from "../../context/state";
import Alert from "../../components/Alert";
import { useRouter } from "next/router";
import apiUrlManager from "../../utils/apiUrlManager";
import { setCookies } from "cookies-next";

const Login = () => {
   const [userState, userDispatch] = useUserContext();
   const router = useRouter();

   const emailRef = useRef(null);
   const passwordRef = useRef(null);

   // handle the login form
   const handleLoginForm = (e) => {
      try {
         e.preventDefault();
         setTimeout(() => {
            userDispatch({
               type: "REGISTER",
               userAlert: { msg: null, classes: null },
            });
         }, 5000);
         // the inputs value
         let emailValue = emailRef.current.value;
         let passwordValue = passwordRef.current.value;
         // if the inputs are empty
         if (!emailValue && !passwordValue) {
            userDispatch({ type: "LOGIN", userAlert: { msg: "Enter Your Email and Password", classes: "bg-red-500" } });
         } else if (!emailValue) {
            userDispatch({ type: "LOGIN", userAlert: { msg: "Enter Your Email", classes: "bg-red-500" } });
         } else if (!passwordValue) {
            userDispatch({ type: "LOGIN", userAlert: { msg: "Enter Your Password", classes: "bg-red-500" } });
         }
         // check the info types is correct or not
         let emailRegEx = /\S+@\S+\.\S+/g;
         let validEmail = emailRegEx.test(emailValue);
         let validPassword = passwordValue.length >= 8;
         // if the email type error should be like exemple@domain.com
         if (!validEmail) {
            userDispatch({ type: "LOGIN", userAlert: { msg: "Email Type Error", classes: "bg-red-500" } });
         }
         // if the password less then 8 har
         if (!validPassword) {
            userDispatch({
               type: "LOGIN",
               userAlert: { msg: "Password Should be bigger Then 8 Chars", classes: "bg-red-500" },
            });
         }
         // if the email and password is valid patterns
         if (validEmail) {
            // if the inputs not empty
            if (emailValue && passwordValue) {
               axios
                  .post(apiUrlManager('users/login/'), { user: { email: emailValue.toLowerCase(), password: passwordValue } })
                  .then(async (res) => {
                     const msg = await res.data.msg;
                     const success = await res.data.success;
                     const user = await res.data.isUserExist;
                     const jwt = await res.data.jwt;
                     if (success) {
                        localStorage.setItem("token", jwt);
                        setCookies('accessToken', jwt)
                        userDispatch({
                           type: "LOGIN",
                           userAlert: { msg, classes: "bg-green-500" },
                           jwt,
                           user,
                        });
                        setTimeout(() => {
                           router.push("/");
                        }, 1000);
                     }

                     if (!success) {
                        userDispatch({
                           type: "LOGIN",
                           userAlert: { msg: "Incorrect Email Or Password", classes: "bg-red-500" },
                        });
                     }
                  })
                  .catch((err) => {
                     userDispatch({
                        type: "LOGIN",
                        userAlert: { msg: "Incorrect Email Or Password", classes: "bg-red-500" },
                     });
                  });
               emailRef.current.value = "";
               passwordRef.current.value = "";
            }
         }
      } catch (error) {
         userDispatch({
            type: "LOGIN",
            userAlert: { msg: "Internal Server Error", classes: "bg-red-500" },
         });
      }
   };

   return (
      <>
         <section className="">
            <form
               method='post'
               action=""
               className="bg-slate-700 flex flex-col items-center mt-20 w-11/12 m-auto rounded sm:w-3/4 md:w-2/4"
               onSubmit={(e) => {
                  handleLoginForm(e);
               }}>
               <h1 className="text-4xl sm:text-5xl text-sky-300 font-bold my-10">Login </h1>
               <Alert msg={userState?.userAlert?.msg ?? ""} classes={userState?.userAlert?.classes ?? ""} />
               <div className="flex flex-col items-center my-5 w-10/12 sm:w-3/4 lg:w-2/4">
                  <div className="my-2 m-auto w-full">
                     <input
                        ref={emailRef}
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Email"
                        autoCorrect="false"
                        autoComplete="false"
                        autoCapitalize="false"
                        className="py-2 px-3 text-lg rounded outline-yellow-600 outline-4 placeholder:text-yellow-600 placeholder:opacity-80 w-full"
                     />
                  </div>
                  <div className="my-2 m-auto w-full">
                     <input
                        ref={passwordRef}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        autoCorrect="false"
                        autoComplete="false"
                        className="py-2 px-3 text-lg rounded outline-yellow-600 outline-4 placeholder:text-yellow-600  placeholder:opacity-80  w-full"
                     />
                  </div>
                  <div>
                     <button
                        type="submit"
                        className="bg-yellow-500 my-4 py-2 px-5 rounded hover:text-white hover:shadow-lg shadow-slate-600">
                        Login
                     </button>
                  </div>
                  <div className="my-3 text-sm font-mono  text-white flex flex-row items-center">
                     Don't have an account?
                     <Link href="/users/register">
                        <a
                           className=""
                           onClick={() => {
                              userDispatch({
                                 type: "LOGIN",
                                 userAlert: { msg: "", classes: "" },
                              });
                           }}>
                           <span className="bg-yellow-600 py-1  px-3 mx-2 rounded ">Sign Up</span>
                        </a>
                     </Link>
                  </div>
               </div>
            </form>
         </section>
      </>
   );
};
export default Login;
