import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import express, { json } from "express";

const app = express();
app.use(json());

// CREATE
app.post("/users", async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const user = User.create({ name, email, role });
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
});
// READ
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
});
// UPDATE
app.put("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const { name, email, role } = req.body;

  try {
    const user = await User.findOneOrFail({ uuid });
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
});
// DELETE
app.delete("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const user = await User.findOneOrFail({ uuid });
    await user.remove();
    return res.status(204).json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
});
// FIND pass~~

createConnection()
  .then(async (connection) => {
    app.listen(3000, () => console.log("Server up at http://localhost:3000"));
  })
  .catch((error) => console.log(error));
