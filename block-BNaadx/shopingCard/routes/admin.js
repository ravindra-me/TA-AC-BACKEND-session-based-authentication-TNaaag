var express = require("express");
var router = express.Router();
var Users = require("../models/Users");
var Card = require("../models/card");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("signup", { error: req.flash("error") });
});

router.get("/login", (req, res, next) => {
  res.render("adminLogin", { error: req.flash("error") });
});

router.post("/signup", (req, res, next) => {
  const user = { ...req.body };
  if (req.body.isAdmin === "on") {
    console.log("hello admin");
    user.isAdmin = true;
    Users.create(user, (err, content) => {
      if (err) {
        if (err.name === "MongoError") {
          req.flash("error", "This email is already used");
          return res.redirect("/admin");
        }
        if (err.name === "ValidationError") {
          req.flash("error", err.message);
          return res.redirect("/admin");
        }
      }
      res.redirect("/admin/login");
    });
  } else {
    user.isAdmin = false;
    Users.create(user, (err, content) => {
      Card.create({ userId: content._id }, (err, card) => {
        if (err) {
          if (err.name === "MongoError") {
            req.flash("error", "This email is already used");
            return res.redirect("/admin");
          }
          if (err.name === "ValidationError") {
            req.flash("error", err.message);
            return res.redirect("/admin");
          }
        }
        res.redirect("/users/login");
      });
    });
  }
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/password required");
    return res.redirect("/admin/login");
  }
  Users.findOne({ email, isAdmin: true }, (err, admin) => {
    if (err) return next(err);
    if (!admin) {
      req.flash("error", "User doesnt exist!! Please signup");
      return res.redirect("/admin/login");
    }
    admin.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", "password is incorrect");
        return res.redirect("/admin/login");
      }
      req.session.userId = admin.id;
      res.redirect("/");
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie();
  res.redirect("/admin/login");
});

module.exports = router;
