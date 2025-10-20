import { createApp } from './app.js';
import { config } from './config/env.js';

const app = await createApp();


app.listen(config.port, async () => {
console.log(`Server running on http://localhost:${config.port}`);
});