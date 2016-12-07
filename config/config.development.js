export default {
  isTest: false,
  server: {
    port: 3333,
    host: 'localhost'
  },
  bodyParser: {
    extended: true
  },
  mongodb: {
    uri: 'mongodb://localhost:27017/killer_api'
  },
  consign: {
    verbose: false
  }
};
