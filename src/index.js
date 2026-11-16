const express = require('express');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();

app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log('Server started on port ' + config.port);
});
