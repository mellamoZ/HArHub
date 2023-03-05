const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { log } = require("console");
const port = process.env.PORT || 5000;
let authenticated = false;
app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
mongoose.connect(
  "mongodb+srv://Abdulaziz:524303zizu@cluster0.cc9lkwm.mongodb.net/harhubDB"
  // "mongodb://localhost:27017/harhubDB"
);

//multer files
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/assets/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: Storage });

const adminSchema = {
  email: String,
  password: String,
};

const eventSchema = {
  title: String,
  body: String,
  place: String,
  date: String,
  time: String,
  pic: String,
  fee: String,
};

const eventBooking = {
  eventid: String,
  eventName: String,
  bookingDate: String,
  eventDate: String,
  eventTime: String,
  fullName: String,
  email: String,
  phone: Number,
  time: String,
  fee: String,
  status: String,
};

const categorySchema = {
  categoryName: String,
};

const testimonialSchema = {
  firstName: String,
  comment: String,
  date: String,
  position: String,
  gender: String,
};

const blogSchema = {
  blogName: String,
  category: String,
  description: String,
  date: String,
  pic: String,
};

const admin = new mongoose.model("Admin", adminSchema);
const event = new mongoose.model("Event", eventSchema);
const category = new mongoose.model("Category", categorySchema);
const testimonial = new mongoose.model("Testimonial", testimonialSchema);
const blog = new mongoose.model("Blog", blogSchema);
const booking = new mongoose.model("Booking", eventBooking);

// const newAdmin = new admin({
//   email: "admin@gmail.com",
//   password: "123",
// });

// newAdmin.save(function (err) {
//   if (err) {
//     console.log(err);
//   }
// });

app.get("/", function (req, res) {
  authenticated = false;
  category.find({}, async (err, foundCategory) => {
    if (err) {
      console.log(err);
    }
    testimonial.find({}, async (err, foundTestimonials) => {
      if (err) {
        console.log(err);
      }
      blog.find({}, async (err, foundBlog) => {
        if (err) {
          console.log(err);
        }
        res.render("index", {
          categories: await foundCategory,
          testimonials: await foundTestimonials,
          blogs: await foundBlog,
        });
      });
    });
  });
});

app.get("/login", function (req, res) {
  category.find({}, async (err, foundCategory) => {
    if (err) {
      console.log(err);
    }

    res.render("login", {
      categories: foundCategory,
    });
  });
});

app.get("/dashboard", function (req, res) {
  if (authenticated) {
    blog.find({ status: "Active" }, async (err, foundActiveBlogs) => {
      blog.find({ status: "Pending" }, async (err, foundPendingBlogs) => {
        event.find({}, async (err, foundEvents) => {
          testimonial.find({}, async (err, foundTestimonials) => {
            res.render("dashboard", {
              completed: foundActiveBlogs.length,
              pending: foundPendingBlogs.length,
              events: foundEvents.length,
              testimonials: foundTestimonials.length,
            });
          });
        });
      });
    });
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});

app.get("/blog", function (req, res) {
  if (authenticated) {
    category.find({}, (err, category) => {
      if (err) {
        console.log(err);
      }
      res.render("blog", {
        categories: category,
      });
    });
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});

//Event app.get
app.get("/eventcards", function (req, res) {
  category.find({}, async (err, foundCategory) => {
    if (err) {
      console.log(err);
    }
    event.find({}, async (err, foundEvents) => {
      if (err) {
        console.log(err);
      }
      res.render("eventcards", {
        categories: foundCategory,
        events: foundEvents,
      });
    });
  });
});

// End Event app.get

app.get("/category", function (req, res) {
  if (authenticated) {
    res.render("category");
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});

app.get("/event", function (req, res) {
  if (authenticated) {
    res.render("event");
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }
      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});

//start pending events
app.get("/pendingevents", function (req, res) {
  if (authenticated) {
    booking.find({ status: "Pending" }, (err, foundBookings) => {
      res.render("pendingevents", {
        bookings: foundBookings,
      });
    });
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});
//end pending events

//start Approved events
app.get("/approvedevents", function (req, res) {
  if (authenticated) {
    booking.find({ status: "Approved" }, (err, foundBookings) => {
      res.render("approvedevents", {
        bookings: foundBookings,
      });
    });
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});
//end Approved events
let obj = { a: "lol1", b: "lol" };
//start pending blogs
app.get("/showevents", function (req, res) {
  if (authenticated) {
    event.find({}, (err, foundEvents) => {
      booking.find({ status: "Approved" }, (err, foundBookings) => {
        res.render("showevents", {
          events: foundEvents,
          bookings: foundBookings,
        });
      });
    });
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});
//end pending blogs
app.get("/completed", function (req, res) {
  if (authenticated) {
    blog.find({ status: "Active" }, (err, foundBlogs) => {
      res.render("completed", {
        blogs: foundBlogs,
      });
    });
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});

app.get("/testimonial", function (req, res) {
  if (authenticated) {
    res.render("testimonial");
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});
app.get("/testimonials", function (req, res) {
  if (authenticated) {
    testimonial.find({}, (err, foundTestimonials) => {
      if (err) {
        console.log(err);
      }
      res.render("testimonials", {
        testimonial: foundTestimonials,
      });
    });
  } else {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("login", {
        categories: foundCategory,
      });
    });
  }
});

app.get("/:cards", function (req, res) {
  const categoryName = req.params.cards;

  category.find({}, async (err, foundCategory) => {
    if (err) {
      console.log(err);
    }
    blog.find({ category: categoryName }, async (err, foundBlogs) => {
      if (err) {
        console.log(err);
      }
      res.render("cards", {
        categories: await foundCategory,
        blogs: await foundBlogs,
      });
    });
  });
});
let eventId;
app.get("/admin/active/edit/:id", function (req, res) {
  eventId = req.params.id;
  booking.findOne({ _id: eventId }, async (err, foundBlog) => {
    if (err) {
      console.log(err);
    }
    res.render("action_completed", {
      blogName: foundBlog.blogName,
    });
  });
});

app.post("/admin/completed/action", function (req, res) {
  const action = req.body.action;

  if (action === "Pending") {
    blog.findOneAndUpdate(
      { _id: eventId },
      { status: action },
      async (err, changed) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/completed");
        }
      }
    );
  } else if (action === "Active") {
    blog.findOneAndUpdate(
      { _id: blogId },
      { status: action },
      async (err, changed) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/completed");
        }
      }
    );
  } else {
    blog.findByIdAndDelete({ _id: blogId }, async (err, deleted) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/completed");
      }
    });
  }
});

//pending

app.get("/admin/pending/edit/:id", function (req, res) {
  eventId = req.params.id;
  booking.findOne({ _id: eventId }, async (err, foundPerson) => {
    if (err) {
      console.log(err);
    }
    res.render("action_pending", {
      fullName: foundPerson.fullName,
    });
  });
});

app.post("/admin/pending/action", function (req, res) {
  const action = req.body.action;

  if (action === "Pending") {
    booking.findOneAndUpdate(
      { _id: eventId },
      { status: action },
      async (err, changed) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/pendingevents");
        }
      }
    );
  } else if (action === "Approved") {
    booking.findOneAndUpdate(
      { _id: eventId },
      { status: action },
      async (err, changed) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/pendingevents");
        }
      }
    );
  } else {
    booking.findByIdAndDelete({ _id: eventId }, async (err, deleted) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/pendingevents");
      }
    });
  }
});

app.get("/:cards/:blog", function (req, res) {
  const blogId = req.params.blog;

  category.find({}, async (err, foundCategory) => {
    if (err) {
      console.log(err);
    }
    blog.findOne({ _id: blogId }, async (err, foundBlog) => {
      if (err) {
        console.log(err);
      }
      res.render("info", {
        categories: await foundCategory,
        blog: await foundBlog,
      });
    });
  });
});

//posting
//Start Posting Client
app.post("/event", upload.single("pic"), function (req, res) {
  const eventName = req.body.name;
  const fee = req.body.fee;
  const body = req.body.description;
  const date = req.body.date;
  const time = req.body.time;
  const place = req.body.place;
  const newEvent = new event({
    title: eventName,
    body: body,
    date: date,
    time: time,
    fee: fee,
    place: place,
    pic: "/uploads/" + req.file.filename,
  });

  newEvent.save(function (err) {
    if (err) {
      console.log(err);
    }
  });

  res.redirect("/event");
});

//End Posting Client

//Start Posting Category

app.post("/category", function (req, res) {
  const categoryName = req.body.category;
  const newCategory = new category({
    categoryName: categoryName,
  });

  newCategory.save(function (err) {
    if (err) {
      console.log(err);
    }
  });

  res.redirect("/category");
});

//End Posting Category

//Start Posting Testimonial

app.post("/testimonial", function (req, res) {
  const firstName = req.body.firstName;
  const comment = req.body.comment;
  const gender = req.body.gender;
  const position = req.body.position;
  const date = `${new Date().getDate()}/${
    new Date().getMonth() + 1
  }/${new Date().getFullYear()}`;

  const newTestimonial = new testimonial({
    firstName: firstName,
    position: position,
    comment: comment,
    date: date,
    gender: gender,
  });

  newTestimonial.save(function (err) {
    if (err) {
      console.log(err);
    }
  });

  res.redirect("/testimonial");
});
//End posting Testimonial

//Start posting Booking

app.post("/booking", function (req, res) {
  const fullName = req.body.fullName;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const eventId = req.body.id;
  const date = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;
  const time = `${new Date().getHours()}:${
    new Date().getMinutes() + 1
  }:${new Date().getSeconds()}`;

  event.findOne({ _id: eventId }, (err, foundOne) => {
    if (err) {
      console.log(err);
    } else {
      const newBooking = new booking({
        eventid: foundOne._id,
        eventName: foundOne.title,
        bookingDate: date,
        eventDate: foundOne.date,
        eventTime: foundOne.time,
        fullName: fullName,
        email: email,
        phone: mobile,
        time: time,
        fee: foundOne.fee,
        status: "Pending",
      });
      newBooking.save(function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });

  res.redirect("/eventcards");
});
//End posting Booking

//Start posting Blog

app.post("/blog", upload.single("pic"), function (req, res) {
  const blogName = req.body.blogName;
  const description = req.body.description;
  const category = req.body.category;
  const date = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  const newBlog = new blog({
    blogName: blogName,
    category: category,
    description: description,
    date: date,
    pic: "/uploads/" + req.file.filename,
  });

  newBlog.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/blog");
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  admin.findOne({ email: email, password: password }, (err, foundOne) => {
    if (err) {
      console.log(err);
    } else {
      if (foundOne) {
        authenticated = true;
        res.redirect("/dashboard");
      } else {
        res.redirect("/login");
      }
    }
  });
});

//Mailling section
app.post("/mail", function (req, res) {
  const fullName = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  //url
  const listID = "14afd134a7";
  const url = "https://us17.api.mailchimp.com/3.0/lists/" + listID;
  const apiKey = "34aaa2a0354983730d15f5a5ff0b2930-us17";

  //data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fullName,
          SUBJECT: subject,
          MSG: message,
        },
      },
    ],
  };

  const config = {
    headers: {
      authorization: "somDigital " + apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  axios
    .post(url, data, config)
    .then((response) => res.redirect("/"))
    .catch((err) => console.log(err));
});
app.listen(port, () => console.log(`listening on port: ${port}`));
