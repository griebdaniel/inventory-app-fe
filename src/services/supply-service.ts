import Supply from "../models/supply";
import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const getSupplies = async (): Promise<Supply> => {
  let res;
  const query = `
    query {
      supplies {
        name,
        quantity
      }
    }`;
  res = await axios.post(serverUrl + '/graphql', { query });
  return res.data.data.supply;
};