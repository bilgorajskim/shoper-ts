import axios from "axios";

export default axios.create({
  timeout: 15000,
});
