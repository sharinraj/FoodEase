const express = require('express');
const path = require('path');
const collection = require('./config');
const bcrypt=require('bcrypt');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/cart", (req, res) => {
    res.render("cart");
});
app.get('/login', (req, res) => {
    res.render('login'); // Assuming "login.ejs" is in your views directory
});


const saltRounds = 10; // You can adjust this value as needed

app.post("/signup", async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await collection.findOne({ email: email });

        if (existingUser) {
            // User with the same email already exists
            return res.status(400).send("Email already exists.");
        } else {
            // Hash the password
            bcrypt.hash(req.body.password, saltRounds, async (err, hashedPassword) => {
                if (err) {
                    console.error("Error hashing password:", err);
                    return res.status(500).send("Error hashing password.");
                }

                const data = {
                    name: req.body.username,
                    email: req.body.email,
                    dob: req.body.dob,
                    phone: req.body.phone,
                    password: hashedPassword // Store the hashed password in the database
                };

                try {
                    const userdata = await collection.create(data);
                    console.log("User data stored:", userdata);
                    res.redirect("/");
                } catch (error) {
                    console.error("Error storing user data:", error);
                    res.status(500).send("Error storing user data.");
                }
            });
        }
    } else {
        res.status(405).send("Method Not Allowed");
    }
});
app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ name: req.body.username });

        if (!user) {
            return res.send("User name not found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (isPasswordMatch) {
            // Both username and password are correct
            
                res.render('home');
           
            
        } else {
            return res.send("Wrong password");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Error during login");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});
