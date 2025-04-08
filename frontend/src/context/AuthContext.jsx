        import {  createContext, useContext, useEffect, useState } from "react";
        import { requestHandler } from "../utils/accessory";
        import { loginWorker, registerWorker } from "../api/api";
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

        const useAuth = () => {
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
                        setError(error || error.message)
                        setIsloading(false)
                    }
                )
            }



            const login =async () => {
                setIsloading(true)


                await requestHandler (
                    async () =>  loginWorker(),
                    setIsloading,
                    (res) =>{
                        alert("Login Success")

                        const { loginUser ,accessToken, refreshToken} = res.data

                        if(loginUser && accessToken){
                            setUser(loginUser)
                            setToken(accessToken)
                            setIsAuthenticate(true)


                            localStorage.setItem("user", JSON.stringify(loginUser))
                            localStorage.setItem('token', accessToken)
                            localStorage.setItem("refreshToken", refreshToken)

                            navigate('/')
                        } else {
                            alert("Invalid Credentials")
                            console.error(error || error.message);
                            
                        }
                    },
                    (error) => {
                        console.error("Login error:", error);
                        setError(error); 
                        setIsloading(false);
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
                        console.log(error || error.message);
                        setError(error || error.message)
                        
                    }
                )

            }


            useEffect(()=>{

                const token = localStorage.getItem("token")
                const storedUser = localStorage.getItem("user")

                if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser)
                    setUser(parsedUser)
                    setToken(token)
                    setIsAuthenticate(true)
                } catch (e) {
                    console.error("Failed to parse user:", e)
                }
                } else {
                console.warn("Token not found or invalid user")
                }

            },[])

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
                        logout
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