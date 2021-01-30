// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

   // GET route for getting all of the Bills
   app.get("/api/bills", function(req, res) {
    // Add sequelize code to find all bills, and return them to the user with res.json
    db.Bill.findAll({}).then(function(dbBills) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbBills);
    });
  });

   // Get route for returning Bills of a specific category
   app.get("/api/bills/category/:category", function(req, res) {
    // Add sequelize code to find all posts where the category is equal to req.params.category,
    // return the result to the user with res.json
    db.Bill.findAll({
      where: {
        category: req.params.category
      }
    }).then(function(dbBills) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbBills);
    });
  });

  // Get route for retrieving a single post
  app.get("/api/bills/:id", function(req, res) {
    // Add sequelize code to find a single post where the id is equal to req.params.id,
    // return the result to the user with res.json
    db.Bill.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(dbBills) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbBills);
    });
  });

  // POST route for saving a new post
  app.post("/api/bills", function(req, res) {
    // Add sequelize code for creating a post using req.body,
    // then return the result using res.json
    db.Bill.create({
      category: req.body.category,
      amount: req.body.amount,
      date: req.body.date
    }).then(function(dbBills) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbBills);
    });
  });

    // DELETE route for deleting posts
    app.delete("/api/bills/:id", function(req, res) {
      // Add sequelize code to delete a post where the id is equal to req.params.id, 
      // then return the result to the user using res.json
      db.Bill.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(dbBills) {
        // We have access to the todos as an argument inside of the callback function
        res.json(dbBills);
      });
    });

    // PUT route for updating posts
    app.put("/api/bills", function(req, res) {
      // Add code here to update a post using the values in req.body, where the id is equal to
      // req.body.id and return the result to the user using res.json
      db.Bill.update({
        category: req.body.category,
        amount: req.body.amount,
        date: req.body.date
        }, 
        {
          where: {
            id: req.body.id
          }
        }
      ).then(function(dbBills) {
        // We have access to the todos as an argument inside of the callback function
        res.json(dbBills);
      });
    });
};
