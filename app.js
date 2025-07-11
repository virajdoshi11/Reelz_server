import 'dotenv/config.js'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// import { query, closePool } from './utils/connectDB.js';
import { query, closePool } from './dbFuncs/pgFuncs.js';
import { authRouter, userDataRouter, searchRouter, chatRouter } from './api/routes/index.js';
import { initTypesense, syncTypeSense } from './dbFuncs/typesenseFuncs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT_NUM || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin:'*'}));
// app.set("view engine", "ejs");
// app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api/auth", authRouter);
app.use("/api/user", userDataRouter);
app.use("/api/llm", chatRouter);
app.use("/api", searchRouter);

//TypeSence Functions ---------------------------
// await initTypesense();
// await syncTypeSense();

// if(process.env.NODE_ENV == "production") {
//   setInterval(syncTypeSense, 60 * 60 * 1000); // Hourly
// }
// ----------------------------------------------

app.get("/", async (req, res) => {
  //fetch all the latests posts and storise by users following list
  const result = await query("SELECT * FROM users");
  res.json(result)
});


// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log("Server started on port: " + PORT);
});

// Close the connection pool when the server shuts down
async function shutDownServer() {
  console.log("The server is shutting down");
  await closePool();
}

process.on('SIGINT' | 'SIGTERM', shutDownServer);