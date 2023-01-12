const app = require('./server');
const { db } = require('./db/index');

const PORT = 3000;

// db
//   .sync({ alter: true })
//   .then((res) => {
//     app.listen(PORT, () => {
//       console.log(`Server listening on port: ${PORT}`)
//     })
//   })
//   .catch((err) => console.log(err))

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
  db.sync({ force: true })
})