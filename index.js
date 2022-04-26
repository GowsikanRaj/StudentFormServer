const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3006, () => {
  console.log("Your server is running on port 3006!");
});

var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(cors());
app.use(express.json());

app.post("/add-student", (req, res) => {
  const studentDay = req.body.listOfDaysandTimesToDelete;
  const listOfDays = studentDay.map((item) => item.split(": "));

  listOfDays.forEach((element) => {
    connection.query(
      "UPDATE studentform.availabledaysandtimes SET Available=0 WHERE Days=? AND Times=?",
      [element[0], element[1]],
      (err, result) => {}
    );
  });

  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const address = req.body.Address;
  const city = req.body.City;
  const email = req.body.Email;
  const home = req.body.HomePhoneNumber;
  const cell = req.body.CellPhoneNumber;
  const emergency = req.body.EmergencyPhoneNumber;
  const studentFirstName = req.body.StudentFirstName;
  const studentEmail = req.body.StudentEmail;
  const studentGrade = req.body.StudentGrade;
  const studentSubjects = req.body.StudentSubjects;
  const studentDays = req.body.StudentDays;
  const startDate = req.body.StartDate;

  connection.query(
    "INSERT INTO studentform.studententries (FirstName, LastName, Address, City, Email, Home, Cell, Emergency, StudentFirstName, StudentEmail, StudentGrade, StudentSubjects, StudentDays, StartDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      firstName,
      lastName,
      address,
      city,
      email,
      home,
      cell,
      emergency,
      studentFirstName,
      studentEmail,
      studentGrade,
      studentSubjects,
      studentDays,
      startDate,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//get all days
app.get("/allDays", (req, res) => {
  connection.query(
    `SELECT DISTINCT Days FROM studentform.availabledaysandtimes WHERE Available=1`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/allDaysandTimes", (req, res) => {
  connection.query(
    `SELECT * FROM studentform.availabledaysandtimes WHERE Available=1`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
