import path from 'path';
import fileUpload from 'express-fileupload';

export default fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'temp'),
});
