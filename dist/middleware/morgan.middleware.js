import morgan from 'morgan';
import logger from '../utils/logger.js';
// Direct morgan log stream directly through our Winston logger's http level
const stream = {
    write: (message) => logger.http(message.trim()),
};
// Define custom morgan logging format to capture all status codes and complete request/response diagnostic parameters
const morganMiddleware = morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms - :user-agent', { stream });
export default morganMiddleware;
//# sourceMappingURL=morgan.middleware.js.map