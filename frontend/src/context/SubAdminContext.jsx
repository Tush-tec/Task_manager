import { createContext, useContext, useState } from "react";
import { requestHandler } from "../utils/accessory";
import { changeRoleOfWorker, fetchAllSubAdmin, fetchManageWorker } from "../api/api";

const SubAdminContext =  createContext(
    {
        subAdmin: null,

        setSubAdmin: async () => {},
        getSubAdmin : async () => {},
        getManageWorker:  async() =>{},
        deleteSubAdmin: async () => {},
        isLoading: false,
        error: null,
    }
)

const useSubAdmin = () => {
   return  useContext(SubAdminContext)
}

const SubAdminProvider = ({children}) => {

    const [isSubAdmin , setisSubAdmin] = useState(null)
    const [subAdmin, setsubAdmin ] = useState([])
    const [manageWorker, setmanageWorker] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error , setError] = useState(null)


    const setSubAdmin = async (workerId) => {
        setIsLoading(true);
      
        await requestHandler(
          () => changeRoleOfWorker(workerId),
          setIsLoading,
          (res) => {
            const updatedWorker = res.data;
            setisSubAdmin(updatedWorker);
      

            setmanageWorker((prevWorkers) =>
              prevWorkers.map((worker) =>
                worker._id === updatedWorker._id ? { ...worker, role: updatedWorker.role } : worker
              )
            );
      
            setError(null);
          },
          (err) => {
            setError(err);
          }
        );
      };
      

    const getSubAdmin = async () => {
        setIsLoading(true)
        await requestHandler(
            () => fetchAllSubAdmin(),
            setIsLoading,
            (res) => {
                console.log(res);
                setsubAdmin(res.data)
                setError(null)
            },
            (err)=> {
                console.log(err);   
                setError(err)
            }
        
        )
    }
    const deleteSubAdmin = async (workerId) => {

    } 

    const getManageWorker = async (page, limit) => {
        setIsLoading(true)

        await requestHandler(
            () => fetchManageWorker(page, limit),
            setIsLoading,
            (res) => {
                setmanageWorker(res.data);
                setError(null)
            },
            (err) => {
                console.log(err);
                setError(err)
            }
        )
    }



    return (
        <SubAdminContext.Provider
    value={{
      subAdmin,           
      isSubAdmin,
      setSubAdmin,
      deleteSubAdmin,
      getSubAdmin,
      getManageWorker,
      isLoading,
      manageWorker,
      error,
    }}
  >
          {children}
        </SubAdminContext.Provider>
      );
}

export {
    SubAdminContext,
    SubAdminProvider,
    useSubAdmin,
}