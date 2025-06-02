const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

console.log("🛠 Middleware de rutas registrándose...");

app.use("/api/user", require("./routes/user.routes"));
app.use("/api/movies", require("./routes/movie.routes"));
app.use("/api/schedules", require("./routes/schedule.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api/foods", require("./routes/food.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
