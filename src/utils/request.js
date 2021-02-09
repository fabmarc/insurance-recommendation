import axios from 'axios';
import { endpointHost } from '../config';

axios.defaults.baseURL = endpointHost;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
