function errorHandler(err, req, res, next) {
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Такая запись уже есть' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Не найдено' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Связанная запись не найдена' });
  }
  console.log(err);
  res.status(500).json({ error: 'Ошибка сервера' });
}

module.exports = errorHandler;
