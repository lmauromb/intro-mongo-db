const mongoose = require("mongoose");

const connect = () => mongoose.connect("mongodb://localhost:27017/whatver");

const school = new mongoose.Schema({
  district: {
    type: mongoose.Types.ObjectId,
    ref: "district"
  },
  name: String,
  openSince: Number,
  students: Number,
  isGreat: Boolean,
  staff: [{ type: String }]
});

// Compound Indexes
// Scope the bigones first and then the smallones (in terms of cardinality)
// Advice: put all the indexes in their own scope, not in the Schema
school.index(
  {
    district: 1,
    name: 1
  },
  { unique: true }
);

// Hooks/Middleware
// It can be Async or Sync
// do not use arrow functions to ensure binding is correct
school.pre("save", function() {
  console.log("before save");
});

// Side note: when you use 2 parameters is Async
school.post("save", function(doc, next) {
  setTimeout(() => {
    console.log("after save ", doc);
    next();
  }, 1000);
});

school.virtual("staffCount").get(function() {
  console.log("in virtual");
  return this.staff.length;
});

const School = mongoose.model("school", school);

connect()
  .then(async connection => {
    const mySchool = await School.create({
      name: "my school",
      staff: ["v", "f", "fsa"]
    });

    console.log(mySchool.staffCount);
  })
  .catch(e => console.error(e));
