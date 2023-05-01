import app from "./server";
import dotenv from "dotenv";

dotenv.config();

// Start the application by listening to specific port
const port = Number(process.env.PORT ?? 5001);
app.listen(port, () => {
  console.info("Express application started on port: " + port.toString());
});
