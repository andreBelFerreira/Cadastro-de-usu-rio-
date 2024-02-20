const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const port = 3000;
const conn = require("./db/conexao");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/cadastro", (req, res) => {
  res.render("signup");
});

app.get("/usuario", (req, res) => {
  res.render("usuario");
});

app.get("/logar", (req, res) => {
  res.render("login");
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

app.post("/login", (req, res) => {
  const user = req.body.txtUsuario;
  const senha = req.body.txtSenha;
  const sql = `SELECT * FROM usuarios WHERE id = ${user} AND senha = '${senha}'`;
  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/home");
    }
  });
});

app.post("/signup", (req, res) => {
  const user = req.body.txtUsuario;
  const senha = req.body.txtSenha;
  const sql = `SELECT * FROM usuarios WHERE id = ${user} AND senha = '${senha}'`;
  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/home");
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
  } else {
    const message = "senha diferentes";
    console.log(message);
  }

  const sql = `INSERT INTO usuarios (nome, username, cargo, senha, email) VALUES ('${nome}','${user}', '${cargo}','${senha}','${email}')`;

  conn.query(sql, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
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
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  const sql = "SELECT * FROM usuarios";
  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    const users = data;
    res.render("index", { users });
  });
});
app.listen(port);
