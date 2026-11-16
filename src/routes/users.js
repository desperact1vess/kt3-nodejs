const express = require('express');
const Joi = require('joi');
const prisma = require('../config/db');
const validate = require('../middleware/validate');

const router = express.Router();

const createUser = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  role: Joi.string().valid('USER', 'ADMIN')
});

const updateUser = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  role: Joi.string().valid('USER', 'ADMIN')
});

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const total = await prisma.user.count();
    const data = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' }
    });
    res.json({
      data,
      meta: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        posts: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createUser), async (req, res, next) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validate(updateUser), async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    await prisma.post.deleteMany({ where: { authorId: id } });
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
