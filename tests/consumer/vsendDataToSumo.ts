const axios = require('axios');
import { test_data } from '../../tests/testData';

(async () => {
    try{
        const uri = 'https://endpoint4.collection.sumologic.com/receiver/v1/http/ZaVnC4dhaV1cpd9ZEWxreFfcRJfASW7-kRZSAa2s36JCq6g1B0qRlSaqzhHJlPsJvl7UXIT_qhwXy-ICJbiGwyt2AuNbRouTzhXurWMLQXTHa8Em8nKkRw==';
        const body = test_data;
        const headers = null;
        const expectedStatusCode = 200;
        const response = await pushDataToSumo(uri, body, headers, expectedStatusCode);
        console.log('Response body: ', response.body);
    }catch(error){
        console.error('An error occurred while pushing data to Sumo:', error);
    }
  })();

async function pushDataToSumo(uri, body, headers, expectedStatusCode) {
    try {
      // Perform the PUT request using Axios
      const response = await axios.put(uri, body, { headers });
  
      // Check if the response status matches the expected status code
      if (response.status === expectedStatusCode) {
        console.log(`Request successful with status code: ${response.status}`);
      } else {
        console.error(`Expected status code ${expectedStatusCode}, but got ${response.status}`);
      }
  
      // Return the response for further processing or verification
      return response;
    } catch (error) {
      // Handle errors, including cases where the server responds with a status code outside the 2xx range
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(`Server responded with status code ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response was received');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
  
      throw error; // Rethrow the error for further handling if necessary
    }
}