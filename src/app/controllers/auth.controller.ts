import Role from "../../database/models/Role";
import Sequelize from "sequelize";
import User from "../../database/models/User";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

dotenv.config();

const Op = Sequelize.Op;

export function signup(req: express.Request, res: express.Response): void {
  if (
    req.body.username === undefined ||
    req.body.email === undefined ||
    req.body.password === undefined
  ) {
    res.status(400).send({ message: "Missing a required parameter." });
    return;
  }

  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      console.log("user: ", user);
      if (req.body.roles != null) {
        void Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          console.log("roles", roles);
          void user.setRoles(roles).then(() => {
            res.status(200).send({ message: "User registered successfully!" });
          });
        });
      } else {
        console.log("role 1");
        // user role = 1
        void Role.findOne({
          where: {
            name: "user",
          },
        }).then((role) => {
          if (role !== undefined && role !== null) {
            console.log("role", role);
            void user.setRoles([role]).then(() => {
              res
                .status(200)
                .send({ message: "User registered successfully!" });
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

export function signin(req: express.Request, res: express.Response): void {
  if (req.body.username === undefined || req.body.password === undefined) {
    res.status(400).send({ message: "Missing a required parameter." });
    return;
  }

  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (user == null) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      let authSecret = "";
      if (process.env.AUTH_SECRET !== undefined) {
        authSecret = process.env.AUTH_SECRET;
      } else {
        res.status(500).send("Authentication secret is unavailable.");
        return;
      }
      const token = jwt.sign({ id: user.id }, authSecret, {
        // 24 hours
        expiresIn: 86400,
      });

      const authorities = [] as string[];
      void user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toString().toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}
