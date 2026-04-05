import app from './src/app.js';
import { testDB } from './src/config/db.js';

// const app = express();
const port = 3000;

app.listen(port, () => {
  console.log('Server started on port ' + port);
});

testDB();
