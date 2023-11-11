// ./src/api/strainApi.js

import { createApi } from "./apiConfig";
import axios from "axios";
import { handleApiResponse, handleApiError } from "./apiConfig";
const strainApi = createApi("strains");

strainApi.associateWithStore = (strainId, storeId) =>
  axios
    .post(`/strains/${strainId}/stores/${storeId}`)
    .then(handleApiResponse)
    .catch(handleApiError);

strainApi.disassociateFromStore = (strainId, storeId) =>
  axios
    .delete(`/strains/${strainId}/stores/${storeId}`)
    .then(handleApiResponse)
    .catch(handleApiError);

export default strainApi;
