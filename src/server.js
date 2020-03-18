import server from './App';

const port = process.env.APP_PORT;
const host = '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Server is running on Url: ${host}/${port}`);
});
