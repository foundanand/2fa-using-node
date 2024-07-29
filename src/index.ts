import { app } from './app';
import connectDB from './config/db';

const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('2FA Server Running..');
  });

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  // Connect to MongoDB
  await connectDB();
});
