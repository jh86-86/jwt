const router = require("express").Router();
const { check, validationResult } = require("express-validator"); //npm package will be used for validation
const { users } = require("../db"); //connected to hardcoded database
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");


//create a user
router.post(
  "/signup",
  [
    check("email", "please provide a valid email").isEmail(), //this array has methods that form validation on req
    check(
      "password",
      "please provide a password that is greater than five characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // hange route to /test then that need to be added to url
    const { password, email } = req.body;

    //validadted input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //if there are errors will return status code and errors array
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    //validate if user doesn't already exist
    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res.status(400).json({
        msg: "This user already exists",
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10); //encrypts password, second param is salt, the amount of encyption

    users.push({
      //saving this to our database
      email: email,
      password: hashedPassword,
    });

    const token = await JWT.sign(
      {
        email,
      },
      "adfasdfadsf",
      {
        expiresIn: 3600000,
      }
    );

    res.send({
      token,
    });
  }
);

//login section
router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  let user = users.find((user) => {
    return user.email === email;
  });

  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credentials",
        },
      ],
    });
  }

  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credentials",
        },
      ],
    });
  }

  const token = await JWT.sign(
    {
      email,
    },
    "adfasdfadsf",
    {
      expiresIn: 3600000,
    }
  );

  res.json({
    token,
  });
});

//get all users
router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
