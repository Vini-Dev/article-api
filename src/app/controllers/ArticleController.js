import Article from '../models/Article';
import yup from '../lib/yup';

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
      if (err) {
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
        .limit(limit);

      const totalSize = await Article.count({
        filed: false,
      });

      // Ajustando url da imagem
      data.map(d => ({
        ...d,
        cover_path_url: `${process.env.APP_URL}/image/${d.cover}`,
      }));

      return res.json({ page: Number(page), perPage: limit, totalSize, data });
    } catch (err) {
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        return res.status(400).json({ errors: validationErrors });
      }
    }

    return res.status(500).json({});
  }

  async store(req, res) {
    const { title, content } = req.body;

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
      });

      await schema.validate(
        { title, content },
        {
          abortEarly: false,
        }
      );

      const response = await Article.create({
        title,
        content,
        cover: '',
        created_by: req.body.user_id,
        updated_by: req.body.user_id,
      });

      return res.status(201).json({ data: response });
    } catch (err) {
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        return res.status(400).json({ errors: validationErrors });
      }
    }

    return res.status(500).json({});
  }

  async update(req, res) {
    const { _id, title, content } = req.body;

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
      });

      await schema.validate(
        { _id, title, content },
        {
          abortEarly: false,
        }
      );

      // Verifica se o id existe
      const check = await Article.findById({ _id });

      if (!check) res.status(400).json({ errors: { id: 'id não encontrado' } });

      // Atualiza para arquivado
      const response = await Article.updateOne(
        { _id },
        {
          $set: {
            title,
            content,
            updated_at: Date.now(),
            updated_by: req.body.user_id,
          },
        }
      );
      return res.json({ data: response });
    } catch (err) {
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err) {
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
      const response = await Article.updateOne(
        { _id: id },
        {
          $set: {
            filed: true,
            updated_at: Date.now(),
            updated_by: req.body.user_id,
          },
        }
      );
      return res.json({ data: response });
    } catch (err) {
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err) {
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
