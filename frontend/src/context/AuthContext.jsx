        import {  createContext, useContext, useEffect, useState } from "react";
        import { requestHandler } from "../utils/accessory";
        import { loginWorker, registerWorker, workerLoginOrRegisterWithGoogle } from "../api/api";
        import { useNavigate } from "react-router-dom";
        import Loader from "../pages/Loader";


        const AuthContext = createContext(
            {
                user :null,
                token:null,
                register : async () =>{},
                login : async () => {},
                logout : async () => {}
            }
        )

        const   useAuth = () => {
            return useContext(AuthContext)
        }


        const AuthProvider = ({children}) => {
            
            const [isLoading, setIsloading] = useState(false)
            const[error,  setError] = useState(null)
            const [user, setUser] = useState(null)
            const [token, setToken] =useState(null)
            const [isAuthenticate, setIsAuthenticate] = useState(false)
            const navigate = useNavigate()


            const register = async (data) => {
                setIsloading(true)

                await requestHandler(
                    async () =>  registerWorker(data),
                    setIsloading,
                    (res) =>{
                        alert("Worker Registered successFully.")
                        navigate("/login")
                    },
                    (error) =>{
                        setError(error )
                        setIsloading(false)
                    }
                )
            }



            const login = async (data) => {
                setIsloading(true)
            
                await requestHandler(
                    async () => loginWorker(data),
                    setIsloading,
                    (res) => {
                        alert("Login Success")
                        
                        const { data } = res;
                        const { worker, accessToken, refreshToken } = data;
                        
                        if (worker && accessToken) {
                          setUser(worker);
                          setToken(accessToken);
                          setIsAuthenticate(true);
                        
                          localStorage.setItem("user", JSON.stringify(worker)); 
                          localStorage.setItem("token", accessToken);
                          localStorage.setItem("refreshToken", refreshToken);
                        
                          navigate("/");
                        } else {
                          alert("Invalid Credentials");
                          console.error("Worker or token missing in response.");
                        }
                        
                    },
                    (error) => {
                        console.error("Login error:", error)
                        setError(error)
                        setIsloading(false)
                    }
                )
            }
            
            
            const googleLogin = async () => {

                setIsloading(true)

                await requestHandler (
                    async () => workerLoginOrRegisterWithGoogle(),
                    setIsloading,
                    (res) => {
                        console.log(res);
                        
                    }
                )
            }


            const logout =async () => {

                setIsloading(true)

                await requestHandler(
                    async () => logoutWorker(),
                    setIsloading,
                    ()=>{
                        setUser(null),
                        setToken(null),
                        setIsAuthenticate(false)
                        localStorage.clear()

                        navigate(login)
                    },
                    (error) =>{
                        console.log(error);
                        setError(error)
                        
                    }
                )

            }


            useEffect(() => {
                const token = localStorage.getItem("token")
                const storedUser = localStorage.getItem("user")
            
                if (token && storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser) // ✅ Fix
                        setUser(parsedUser)
                        setToken(token)
                        setIsAuthenticate(true)
                    } catch (e) {
                        console.error("Failed to parse user from localStorage:", e)
                    }
                } else {
                    console.warn("Token not found or invalid user")
                }
            }, [])
            

            return (
                <AuthContext.Provider value={
                    {
                        user,
                        token,
                        error,
                        isAuthenticate,
                        isLoading,
                        register,
                        login,
                        logout,
                        setUser,             
                        setToken,           
                        setIsAuthenticate  
                    }
                }>

                { isLoading  ? <Loader/> : children}
                </AuthContext.Provider>
            )

        }

        export {
            AuthContext,
            AuthProvider,
            useAuth
        }