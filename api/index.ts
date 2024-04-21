import express from "express";
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3005, () => console.log("Server ready on port 3005."));

export default app;
