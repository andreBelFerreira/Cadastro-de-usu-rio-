const express = require("express");
const exphbs = require("express-handlebars");
const port = 3000;
const conn = require("./db/conexao");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/cadastro", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  } else {
    res.render("signup");
  }
});

app.get("/usuario", (req, res) => {
  res.render("usuario");
});

app.get("/home", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  } else {
    const sql = "SELECT * FROM usuarios";
    conn.query(sql, function (err, data) {
      if (err) {
        console.log(err);
        return;
      }
      const users = data;
      const session = req.session.user;
      res.render("index", { users, session });
    });
  }
});

app.get("/editar/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM usuarios WHERE id = ${id}`;

  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    const usuario = data[0];
    res.render("editar", { usuario });
  });
});

app.post("/signup", (req, res) => {
  const { username, senha } = req.body;
  const sql = `SELECT * FROM usuarios WHERE USERNAME = ?`;

  conn.query(sql, [username], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      const user = result[0];
      if (bcrypt.compareSync(senha, user.Senha)) {
        req.session.user = user;
        res.redirect("/home");
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  });
});

app.post("/cadastrar", (req, res) => {
  const user = req.body.txtUser;
  const nome = req.body.txtName;
  const email = req.body.email;
  const cargo = req.body.txtCargo;
  var senha = "";

  if (req.body.txtPass === req.body.re_pass) {
    senha = req.body.txtPass;
    const hashedPassword = bcrypt.hashSync(senha, 10);
    const sql = `INSERT INTO usuarios (nome, username, cargo, senha, email) VALUES (?,?,?,?,?)`;

    conn.query(sql, [nome, user, cargo, hashedPassword, email], function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        res.redirect("/home");
      }
    });
  } else {
    const message = "Senhas diferentes";
    console.log(message);
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.txtId;
  const user = req.body.txtUser;
  const nome = req.body.txtName;
  const email = req.body.email;
  const cargo = req.body.txtCargo;

  const sql = `UPDATE usuarios SET username = '${user}', nome = '${nome}', email = '${email}',cargo = '${cargo}' WHERE id = ${id}`;

  conn.query(sql, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/");
  });
});

app.post("/deletar/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM usuarios WHERE id = ${id}`;

  conn.query(sql, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/home");
  });
});

app.get("/", (req, res) => {
  res.render("login");
});
app.listen(port);
