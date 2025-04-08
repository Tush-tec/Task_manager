const requestHandler = async (api, setLoading, onSuccess, onError) => {
    try {
      console.log("RequestHandler: about to call API function...");
  
      if (typeof api !== "function") {
        throw new Error("api must be a function");
      }
  
      setLoading && setLoading(true);
  
      const response = await api(); // <-- this should trigger registerWorker
      console.log("RequestHandler: API called successfully");
  
      const { data, status } = response || {};
      console.log("API Response:", data);
  
      if (status >= 200 && status < 300) {
        if (data?.success) {
          onSuccess(data);
        } else {
          console.error("Unexpected API Response:", data);
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
  
      console.log("Caught error in requestHandler:", errorMessage);
      onError(errorMessage);
  
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.log("Unauthorized! Token might be invalid or expired.");
      }
    } finally {
      setLoading && setLoading(false);
    }
  };

  export {
    requestHandler
  }