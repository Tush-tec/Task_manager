        import {  createContext, useContext, useEffect, useState } from "react";
        import { requestHandler } from "../utils/accessory";
        import { deleteWorker, getAllWorkerFromDB, loginWorker, registerWorker, workerLoginOrRegisterWithGoogle, workerLogout } from "../api/api";
        import { useNavigate } from "react-router-dom";
        import Loader from "../Component/Loader";

        const AuthContext = createContext(
            {
                user :null,
                token:null,
                register : async () =>{},
                login : async () => {},
                logout : async () => {},
                fetchAndDeleteWorker: async () => {},
                fetchWorkers : async () => {}
            }
        )

        const   useAuth = () => {
            return useContext(AuthContext)
        }


        const AuthProvider = ({children}) => {
            
            const [isLoading, setIsloading] = useState(false)
            const[error,  setError] = useState(null)
            const [user, setUser] = useState(null)
            const [workers, setWorkers] = useState(null)
            const [token, setToken] =useState(null)
            const [isAuthenticate, setIsAuthenticate] = useState(false)
            const [ready, setIsReady] = useState(false)
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
            
            
            const fetchWorkers = async () => {
                try {
                  const res = await getAllWorkerFromDB();                  
                  setWorkers(res.data.data);
                } catch (error) {
                  console.error("Error fetching workers:", error);
                  setError(error);
                }
              };

              const fetchAndDeleteWorker = async (workerId) => {
                setIsloading(true);
              
                await requestHandler(
                  async () => deleteWorker(workerId),
                  setIsloading,
                  () => {

                    setWorkers((prev) => prev.filter((w) => w._id !== workerId));
                  },
                  (err) => setError(err)
                );
              };
              
              
            const logout =async () => {

                setIsloading(true)

                await requestHandler(

                    async () => workerLogout(),
                    setIsloading,
                    ()=>{
                        localStorage.clear()
                        
                        setUser(null),
                        setToken(null),
                        setIsAuthenticate(false)
                        navigate("/login")
                    },
                    (error) =>{
                        console.log(error);
                        setError(error)
                        
                    }
                )

            }


            useEffect(() => {
                const token = localStorage.getItem("token");
                const storedUser = localStorage.getItem("user");
              
                if (token && storedUser) {
                  try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setToken(token);
                    setIsAuthenticate(true);
                  } catch (e) {
                    console.error("Failed to parse user from localStorage:", e);
                  }
                }
                  setIsReady(true)              
              
              }, []);
              
            

            return (
                <AuthContext.Provider value={
                    {
                        user,
                        workers,
                        token,
                        error,
                        isAuthenticate,
                        isLoading,
                        register,
                        login,
                        logout,
                        fetchWorkers,
                        fetchAndDeleteWorker,
                        setUser,             
                        setToken,           
                        setIsAuthenticate  ,
                        ready
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