import axios from "axios";

const ApiClient = axios.create({
  baseURL: "http://localhost:8000",
  params: {
    key: "",
  },
});

export default ApiClient;
