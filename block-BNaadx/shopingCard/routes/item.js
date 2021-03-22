var express = require("express");
const { render } = require("../app");
var router = express.Router();
var Items = require("../models/Items");
var Card = require("../models/Card");

router.get("/", (req, res, next) => {
  var session = req.session.userId;
  Items.find({}, (err, content) => {
    if (err) return next(err);
    res.render("listItem", { data: content, session });
  });
});

router.get("/:id/list", (req, res, next) => {
  var id = req.params.id;
  Items.findById({ adminId: id }, (err, content) => {
    if (err) return next(err);
    res.render("listOfAdminProduct", { data: content });
  });
});

router.get("/:id/detail", (req, res, next) => {
  Items.findById(req.params.id)
    .populate("adminId")
    .exec((err, item) => {
      res.render("singleItem", { data: item });
    });
});

router.get("/:id/likes", (req, res, render) => {
  var id = req.session.userId;
  Items.findById(req.params.id, (err, content) => {
    if (err) return next(err);
    if (!req.session.userId) {
      return res.redirect("/users/login");
    }
    if (content.likes.includes(id)) {
      content.likes.pull(id);
    } else {
      content.likes.push(id);
    }
    Items.findByIdAndUpdate(
      req.params.id,
      { likes: content.likes },
      (err, updateContent) => {
        if (err) return next(err);
        res.redirect("/items/" + req.params.id + "/detail");
      }
    );
  });
});

router.get("/:id/edit", (req, res, next) => {
  Items.findById(req.params.id)
    .populate("adminId")
    .exec((err, item) => {
      if (item.adminId.id === req.session.userId) {
        res.render("editItem", { data: item });
      } else {
        res.redirect("/users/login");
      }
    });
});

router.post("/:id/edit", (req, res, next) => {
  Items.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, content) => {
      if (err) return next(err);
      res.redirect("/items/" + req.params.id + "/detail");
    }
  );
});

router.get("/:id/delete", (req, res, next) => {
  Items.findById(req.params.id)
    .populate("adminId")
    .exec((err, item) => {
      if (item.adminId.id === req.session.userId) {
        Items.findByIdAndDelete(req.params.id, (err, content) => {
          res.redirect("/admin/" + item.adminId.id + "/dasboardAdmin");
        });
      } else {
        res.redirect("/users/login");
      }
    });
});

router.get("/:id/cart", (req, res, next) => {
  var sessionId = req.session.userId;
  Card.findOne({ userId: sessionId }, (err, content) => {
      console.log(content)
    if(err) return next(err);
    if (content === null) {
      req.body.userId = req.session.userId;
      Card.create(req.body, (err, createContent) => {
        if (err) return next(err);
       createContent.listItems =  createContent.listItems.push(req.params.id);
        console.log(createContent , "undefine")
        res.redirect('/items');
      });
    } else {
      if (content.listItems.includes(req.params.id)) {
          console.log("alredy includes")
        res.redirect('/items');
      } else {
        content.listItems.push(req.params.id);
        console.log(content , "alredy user")
        res.redirect('/items');
      }
    }
  });
});

router.get("/carts", (req, res,next) => {
    console.log(req.session.userId)
    Card.findOne({userId: req.session.userId} , (err ,content)=> {
        console.log(content)
    })
//   Card.findOne({ userId: req.session.userId })
//     .populate("listItems")
//     .exec((err, items) => {
//         console.log(items);
//       if (err) return next(err);
//       res.render("listcarts", { data: items.listItems });
//     });
});

module.exports = router;
