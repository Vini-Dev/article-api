import server from './App';

const { APP_HOST, APP_PORT } = process.env;

server.listen(APP_PORT, APP_HOST, () => {
  console.log(`Server is running on Url: ${APP_HOST}/${APP_PORT}`);
});
