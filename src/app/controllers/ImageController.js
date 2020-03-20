import fs from 'fs';
import path from 'path';

class ImageController {
  async index(req, res) {
    const { image } = req.param;

    return fs
      .createReadStream(
        path.resolve(__dirname, '..', '..', 'tmp', 'uploads', image)
      )
      .pipe(res);
  }
}

export default new ImageController();
