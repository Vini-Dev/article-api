import Tag from '../models/Tag';
import yup from '../lib/yup';

class TagController {
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
      const response = await Tag.findById({ _id: id });

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

      const data = await Tag.find({
        filed: false,
      })
        .skip(skip)
        .limit(limit);

      const totalSize = await Tag.countDocuments({
        filed: false,
      });

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
    const { name } = req.body;

    try {
      // Validação
      const schema = yup.object().shape({
        name: yup
          .string()
          .min(1)
          .required()
          .label('Nome'),
      });

      await schema.validate({ name });

      const response = await Tag.create({
        name,
        created_by: req.body.user_id,
        updated_by: req.body.user_id,
      });

      return res.status(201).json({ data: response });
    } catch (err) {
      // Caso ocorrer algum erro, cria um array de mensagens
      const validationErrors = {};
      if (err) {
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
    const { _id, name } = req.body;

    try {
      // Validação
      const schema = yup.object().shape({
        _id: yup
          .string()
          .length(24)
          .required()
          .label('id'),
        name: yup
          .string()
          .min(1)
          .required()
          .label('Nome'),
      });

      await schema.validate(
        { _id, name },
        {
          abortEarly: false,
        }
      );

      // Verifica se o id existe
      const check = await Tag.findById({ _id });

      if (!check) res.status(400).json({ errors: { id: 'id não encontrado' } });

      // Atualiza para arquivado
      const response = await Tag.findByIdAndUpdate(
        { _id },
        {
          $set: {
            name,
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
      const check = await Tag.findById({ _id: id });

      if (!check) res.status(400).json({ errors: { id: 'id não encontrado' } });

      // Atualiza para arquivado
      const response = await Tag.findByIdAndUpdate(
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

export default new TagController();
