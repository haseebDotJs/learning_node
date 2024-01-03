const mongoose = require("mongoose");

main()
  .then(() => console.log("Mongodb connected successfully"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");

  // const userData = new User({
  //   name: false,
  //   // age: 19,
  //   email: "    abcd@GMAIL.com   ",
  //   password: "abcdeg   ",
  // });

  // const addUserResult = await userData.save();

  // console.log("___addUserResult", addUserResult);

  // const taskData = new Tasks({
  //   task: "do breakfastss                                 ",
  // });

  // const addTaskResult = await taskData.save();

  // console.log("___addTaskResult", addTaskResult);
}
