import fs from 'fs';
import path from 'path';

class ImageController {
  async index(req, res) {
    const { fileName } = req.params;
    const relativePath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'uploads',
      fileName
    );

    const readStream = fs.createReadStream(relativePath);

    readStream.on('open', () => {
      readStream.pipe(res);
    });

    readStream.on('error', () => {
      res.status(404).end();
    });
  }
}

export default new ImageController();
