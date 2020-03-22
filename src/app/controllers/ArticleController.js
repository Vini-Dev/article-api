import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Article from '../models/Article';
import yup from '../lib/yup';

/**
 * FIXME:
 * - Validar somente o ID e verificar se ele existe antes de validar o
 * restante dos parâmetros enviados
 */
class ArticleController {
  async index(req, res) {
    const { id } = req.params;

    try {
      // Validação
      const schema = yup.object().shape({
        id: yup
          .string()
          .length(24)
          .required()
          .label('id'),
      });

      await schema.validate(
        { id },
        {
          abortEarly: false,
        }
      );

      // Verifica se o id existe
      const response = await Article.findById({ _id: id });

      if (!response)
        res.status(400).json({ errors: { id: 'id não encontrado' } });

      return res.json({ data: response });
    } catch (err) {
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        return res.status(400).json({ errors: validationErrors });
      }
    }

    return res.status(500).json({});
  }

  async list(req, res) {
    const { perPage, page } = req.query;

    try {
      // Validação
      const schema = yup.object().shape({
        perPage: yup
          .number()
          .min(1)
          .label('Quantidade por página'),
        page: yup
          .number()
          .min(1)
          .label('Página'),
      });

      await schema.validate(
        { perPage, page },
        {
          abortEarly: false,
        }
      );

      // Definindo limit e offset
      const limit = perPage ? Number(perPage) : 10;
      const skip = (Number(page) - 1) * limit;

      const data = await Article.find({
        filed: false,
      })
        .skip(skip)
        .limit(limit)
        .populate('tags');

      const totalSize = await Article.countDocuments({
        filed: false,
      });

      return res.json({
        page: Number(page),
        perPage: limit,
        totalSize,
        data,
      });
    } catch (err) {
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        return res.status(400).json({ errors: validationErrors });
      }
    }

    return res.status(500).json({});
  }

  async store(req, res) {
    const cover = req.files ? req.files.cover : {};
    const { title, content, tags } = req.body;

    try {
      // Validação
      const schema = yup.object().shape({
        title: yup
          .string()
          .min(5)
          .required()
          .label('Título'),
        content: yup
          .string()
          .min(5)
          .required()
          .label('Conteúdo'),
        tags: yup
          .array()
          .of(yup.string().length(24))
          .label('Tags'),
        name: yup
          .string()
          .required()
          .label('Capa'),
        mimetype: yup
          .string()
          .test(value => {
            const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];

            if (allowedMimes.includes(value)) return true;

            return false;
          })
          .required()
          .label('Tipo'),
        size: yup
          .number()
          .max(1048576, 'O tamanho máximo é de 1 mb')
          .required()
          .label('Tamanho'),
      });

      const parsedTags = tags ? JSON.parse(tags) : [];

      await schema.validate(
        { title, content, parsedTags, ...cover },
        {
          abortEarly: false,
        }
      );

      // Cria uma hash para previnir imagens com nomes iguais
      const buf = crypto.randomBytes(16);
      const newNameImage = `${buf.toString('hex')}-${cover.name}`;

      cover.mv(
        path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          'tmp',
          'uploads',
          newNameImage
        )
      );

      const response = await Article.create({
        title,
        content,
        cover: newNameImage,
        tags: parsedTags,
        created_by: req.body.user_id,
        updated_by: req.body.user_id,
      });

      return res.status(201).json({ data: response });
    } catch (err) {
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err.inner) {
        console.log(err);
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        return res.status(400).json({ errors: validationErrors });
      }
    }

    return res.status(500).json({});
  }

  async update(req, res) {
    const cover = req.files ? req.files.cover : {};
    const { _id, title, content, tags } = req.body;

    try {
      // Validação
      const schema = yup.object().shape({
        _id: yup
          .string()
          .length(24)
          .required()
          .label('id'),
        title: yup
          .string()
          .min(5)
          .required()
          .label('Título'),
        content: yup
          .string()
          .min(5)
          .required()
          .label('Conteúdo'),
        tags: yup
          .array()
          .of(yup.string().length(24))
          .label('Tags'),
        name: yup.string().label('Capa'),
        mimetype: yup
          .string()
          .test(value => {
            if (!value) return true;

            const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];

            if (allowedMimes.includes(value)) return true;

            return false;
          })
          .label('Tipo'),
        size: yup
          .number()
          .max(1048576, 'O tamanho máximo é de 1 mb')
          .label('Tamanho'),
      });

      const parsedTags = tags ? JSON.parse(tags) : [];

      await schema.validate(
        { _id, title, tags: parsedTags, content, ...cover },
        {
          abortEarly: false,
        }
      );

      // Verifica se o id existe
      const check = await Article.findById({ _id });

      if (!check) res.status(400).json({ errors: { id: 'id não encontrado' } });

      let imageName = check.cover;

      if (req.files) {
        fs.unlinkSync(
          path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'tmp',
            'uploads',
            check.cover
          )
        );

        console.log(check.cover);
        // Cria uma hash para previnir imagens com nomes iguais
        const buf = crypto.randomBytes(16);

        imageName = `${buf.toString('hex')}-${cover.name}`;

        cover.mv(
          path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', imageName)
        );
      }

      // Atualiza para arquivado
      const response = await Article.findByIdAndUpdate(
        { _id },
        {
          $set: {
            title,
            content,
            cover: imageName,
            tags: parsedTags,
            updated_at: new Date(),
            updated_by: req.body.user_id,
          },
        }
      );
      return res.json({ data: response });
    } catch (err) {
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        return res.status(400).json({ errors: validationErrors });
      }
    }

    return res.status(500).json({});
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      // Validação
      const schema = yup.object().shape({
        id: yup
          .string()
          .length(24)
          .required()
          .label('id'),
      });

      await schema.validate(
        { id },
        {
          abortEarly: false,
        }
      );

      // Verifica se o id existe
      const check = await Article.findById({ _id: id });

      if (!check) res.status(400).json({ errors: { id: 'id não encontrado' } });

      // Atualiza para arquivado
      const response = await Article.findByIdAndRemove({ _id: id });

      fs.unlinkSync(
        path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', check.cover)
      );

      return res.json({ data: response });
    } catch (err) {
      console.error(err);
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        return res.status(400).json({ errors: validationErrors });
      }
    }

    return res.status(500).json({});
  }
}

export default new ArticleController();
