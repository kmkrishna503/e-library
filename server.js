import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("./E_books.json");
const middlewares = jsonServer.defaults();
import bodyParser from "body-parser"; // Add this line
import cors from "cors";
server.use(cors());
server.use(bodyParser.json());

server.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const users = router.db.get("users").value();
  const nextUserId =
    users?.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const userExists = users?.find((u) => u.email === email);
  if (userExists) {
    return res.status(409).json({ message: "user already registered !" });
  }
  const newUser = { id: nextUserId, name, email, password };
  router.db.get("users").push(newUser).write();
  res.status(200).json({ message: "Registration successful", user: newUser });
});


server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await router.db.get("users").value();
  const user = users?.find(
    (user) => user.email === email && user.password === password
  );
  console.log(user);
  if (user) {
    res.status(200).json({ message: "Login successful", user });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Apply middleware and use router
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

// Start server
const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
