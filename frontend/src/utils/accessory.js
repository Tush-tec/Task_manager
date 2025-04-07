
const requestHandler = async (api, setLoading, onSucess, onError) => {

   try {
     if(typeof api !== "function"){
         throw new Error("api must be a function");
     }
 
     setLoading && setLoading (true)
 
     const response = await api()
 
     const {data, status} = response || {}
 
 
     console.log(`API Response for ${apiName}: ${data.message}`, data);
 
     if( status >= 200 && status < 300) {
         if(data?.success){
             onSucess(data)
         } else {
             console.error(`Unexpected API Response for ${apiName}:`, data);
             onError("Something went wrong with the API response");
             
         }
     } else {
         onError(data?.message || `Error: ${status}`);
     }
   } catch (error) {
    

        let errorMessage = "Something went wrong.";
        if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }

        onError(errorMessage);

        if (error?.response?.status === 401 || error?.response?.status === 403) {
            console.log("Unauthorized! Token might be invalid or expired.");
        }
    } finally {
        setLoading && setLoading(false);
    }
}


export {
    requestHandler,

}