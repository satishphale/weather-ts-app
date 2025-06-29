import app from './app';

import { initDB } from './init-db';
const PORT = process.env.PORT || 3000;

(async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
