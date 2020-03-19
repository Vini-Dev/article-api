import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import Article from '../models/Article';

class ArticleController {
  async index(req, res) {
    const { id } = req.params;
    const response = await Article.findById({ _id: id });

    return res.json({ data: response });
  }

  async list(req, res) {
    const response = await Article.find({
      filed: false,
    });

    return res.json({ data: response });
  }

  async store(req, res) {
    const { filename } = req.file;
    const { title, content } = req.body;

    const response = await Article.create({
      title,
      content,
      cover: filename,
      created_by: req.body.user_id,
      updated_by: req.body.user_id,
    });

    return res.status(201).json({ response });
  }

  async update(req, res) {
    const { _id } = req.body;

    const response = await Article.update(
      { _id },
      {
        $set: {
          ...req.body,
          updated_at: Date.now(),
          updated_by: req.body.user_id,
        },
      }
    );

    return res.json({
      response,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const item = await Article.findById({ _id: id });

    const response = await Article.deleteOne({ _id: id });

    promisify(fs.unlink)(
      path.resolve(__dirname, '..', '..', 'tmp', 'uploads', item.cover)
    );

    return res.json({ response });
  }
}

export default new ArticleController();
