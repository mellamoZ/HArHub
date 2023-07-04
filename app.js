const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios = require("axios");
const passport = require("passport");
const localStrategy = require("passport-local")
const flash = require("express-flash");
const session = require("express-session");
const multer = require("multer");
const alert = require('alert'); 
const fs = require("fs");
const moment = require("moment");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { log } = require("console");

const port = process.env.PORT || 5000;
app.use(express.static("public"));

// app.use(flash());
// app.use(
//   session({
//     secret: "harhub@123",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
mongoose.set('strictQuery', false);
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
mongoose.set("strictQuery", false);
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

const adminSchema = new mongoose.Schema( {
  email: String,
  password: String,
});

// adminSchema.plugin(passportLocalMongoose);



const eventSchema = {
  title: String,
  body: String,
  place: String,
  date: String,
  time: String,
  pic: String,
  fee: String,
};

const tourSchema = {
  name: String,
  email: String,
  phone: String,
  size: String,
  message: String,
  date: String,

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
  pic: String,
};

const blogSchema = {
  blogName: String,
  category: String,
  description: String,
  date: String,
  pic: String,
};

const paymentSchema = {
  eventId: String,
  fullName: String,
  eventDate: String,
  eventTime: String,
  eventName: String,
  payment: Number,
  date: String,
};

const commentSchema = {
  fullName: String,
  email: String,
  date: String,
  message: String,
  blogId: String
};

const admin = new mongoose.model("Admin", adminSchema);

// passport.use(admin.createStrategy());


// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   admin.findById(id, function(err,user){
//       done(err, user);
//   })
// });

// passport.use(new localStrategy(function(email,password,done){
//   admin.findOne({email:email}, function(err,user){
//     if(err){
//       return done(err)
//     }

// if(!user){
//   return(null,false,{message:"inncorrect username"})
// }

// if(password === user.password){
//   return done(null,user)
// }else{
//   return done(null,false, {message:"incorrect"})
// }
    
//   })
// }))



const event = new mongoose.model("Event", eventSchema);
const category = new mongoose.model("Category", categorySchema);
const testimonial = new mongoose.model("Testimonial", testimonialSchema);
const blog = new mongoose.model("Blog", blogSchema);
const comment = new mongoose.model("Comment", commentSchema);
const tour = new mongoose.model("Tour", tourSchema);

const booking = new mongoose.model("Booking", eventBooking);
const payment = new mongoose.model("Payment", paymentSchema);
let date = moment().format("YYYY-MM-DD");
let time = moment().format("LT");
// admin.register({ username: "harhub@gmail.com" }, "123", function (err, admin) {
//   if (err) {
//     console.log(err);
//   }
// });

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
  category.find({}, async (err, foundCategory) => {
    if (err) {
      console.log(err);
    }
    event.find({}, async (err, foundEvents) => {
      if (err) {
        console.log(err);
      }
      blog.find({}, async (err, foundBlog) => {
        if (err) {
          console.log(err);
        }
        res.render("index", {
          categories: await foundCategory,
          events: await foundEvents,
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
  if (1 == 1) {
    booking.find({ status: "Approved" }, async (err, foundApproved) => {
      booking.find({ status: "Pending" }, async (err, foundPending) => {
        event.find({}, async (err, foundEvents) => {
          testimonial.find({}, async (err, foundTestimonials) => {
            res.render("dashboard", {
              approved: foundApproved.length,
              pending: foundPending.length,
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
  if (1 == 1) {
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
  if (1 == 1) {
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

app.get("/about", function (req, res) {
  testimonial.find({}, async (err, foundTestimonials) => {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("about", {
        categories: foundCategory,
        testimonials: foundTestimonials
      });
    });
  
  });
});


app.get("/contact", function (req, res) {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }

      res.render("contact", {
        categories: foundCategory,
      });
    });
});


app.get("/tour", function (req, res) {
  category.find({}, async (err, foundCategory) => {
    if (err) {
      console.log(err);
    }
    res.render("tour", {
      categories: foundCategory,
    });
  });
});

//Start Posting tour
app.post("/tour", function (req, res) {
  const companyName = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const size = req.body.size;
  const message = req.body.message;

  const newTour = new tour({
    name: companyName,
    email: email,
    phone: phone,
    size: size,
    message: message,
    date:date,
  });

  newTour.save(function (err) {
    if (err) {
      console.log(err);
    }else{
      alert("Success")
      res.redirect("/tour");
    }
  });

});



app.get("/event", function (req, res) {
  if (1 == 1) {
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

app.get("/eventbooking/:eventbookingid", function (req, res) {
  let eventbookingid = req.params.eventbookingid
  event.find({_id: eventbookingid }, async (err, foundEventBookings) => {
    category.find({}, async (err, foundCategory) => {
      if (err) {
        console.log(err);
      }
      res.render("eventbooking", {
        categories: foundCategory,
        eventbooking: foundEventBookings
      });
    });
  })
});

//start pending events
app.get("/pendingevents", function (req, res) {
  if (1 == 1) {
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
  if (1 == 1) {
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
//start showing events
app.get("/showevents", function (req, res) {
  if (1 == 1) {
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
//end showing events

//start showing blogs
app.get("/showblogs", function (req, res) {
  if (1 == 1) {
    blog.find({}, (err, foundBlogs) => {
      res.render("showblogs", {
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
//end showing blogs

let firstDate, secondDate;
app.get("/payment", function (req, res) {
  if (1 == 1) {
    booking.find(
      {
        bookingDate: { $gte: firstDate, $lte: secondDate },
        status: "Approved",
      },
      (err, foundPayments) => {
        res.render("payment", {
          payments: foundPayments,
        });
      }
    );
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
// start payment app.post//
app.post("/payment", function (req, res) {
  firstDate = req.body.date1;
  secondDate = req.body.date2;
  res.redirect("/payment");
});
// start payment app.post//

// testimonial section//

app.get("/testimonial", function (req, res) {
  if (1 == 1) {
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


app.get("/showtours", function (req, res) {
  
  if (1 == 1) {
    tour.find({}, async (err, foundTours) => {
      
      if (err) {
        console.log(err);
      }else{
      
    res.render("showtours", {tours: foundTours});
  }

    })
  }
  
  
  else {
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
  if (1 == 1) {
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
let  blogId;
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
  } else {
    blog.findByIdAndDelete({ _id: eventId }, async (err, deleted) => {
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
      async (err, foundBooking) => {
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
   blogId = req.params.blog;

  category.find({}, async (err, foundCategory) => {
    if (err) {
      console.log(err);
    }
    blog.findOne({ _id: blogId }, async (err, foundBlog) => {
      if (err) {
        console.log(err);
      }

      comment.find({ blogId: blogId }, async (err, foundComments) => {
        if (err) {
          console.log(err);
        }
      res.render("info", {
        categories: await foundCategory,
        blog: await foundBlog,
        comments: await foundComments
      });

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

app.post("/testimonial", upload.single("pic"), function (req, res) {
  const firstName = req.body.firstName;
  const comment = req.body.comment;
  const gender = req.body.gender;
  const position = req.body.position;
  const newTestimonial = new testimonial({
    firstName: firstName,
    position: position,
    comment: comment,
    date: date,
    pic: "/uploads/" + req.file.filename,
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

// app.post("/login", (req,res)=> {
// const user = new admin({ 
//   email: req.body.email,
//   password: req.body.password

// })

// req.login(user, (err)=> {
//   console.log("we not here")

//   if(err){
//     console.log(err)
//   }else{
//     console.log("we here")
//     passport.authenticate("local")(req,res, function(){
//       console.log("we here 2")

//     res.redirect("/dashboard")
//     })
//   }
// })

// })


//Start posting comment

app.post("/comment", function (req, res) {
  fullName = req.body.name;
  email = req.body.email;
  message = req.body.message;

  const newComment = new comment({
    fullName: fullName,
    email: email,
    date: date,
    message: message,
    blogId:blogId
  });

  newComment.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
  
  res.redirect("/");
});

//Mailling section
app.post("/mail", function (req, res) {
  const fullName = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  const phone = req.body.number
  console.log(message)
  //url
  const listID = "9da59bc711";
  const url = "https://us17.api.mailchimp.com/3.0/lists/" + listID;
  const apiKey = "44846694333e5f832f53771fdf9c8eb3-us17";

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
          PHONE: phone,
        },
      },
    ],
  };

  const config = {
    headers: {
      authorization: "HarHub " + apiKey,
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
