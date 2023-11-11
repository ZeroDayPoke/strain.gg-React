// ./src/api/storeApi.js

import { createApi } from './apiConfig';
import axios from 'axios';
import { handleApiResponse, handleApiError } from './apiConfig';

const storeApi = createApi('stores');

storeApi.associateWithStrain = (storeId, strainId) =>
  axios
    .post(`/stores/${storeId}/strains/${strainId}`)
    .then(handleApiResponse)
    .catch(handleApiError);

storeApi.disassociateFromStrain = (storeId, strainId) =>
  axios
    .delete(`/stores/${storeId}/strains/${strainId}`)
    .then(handleApiResponse)
    .catch(handleApiError);

export default storeApi;
