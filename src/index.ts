import { app } from './app';

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('2FA Server Running..');
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
