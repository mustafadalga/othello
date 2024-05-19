import mongoose from "mongoose";
console.log(333,process.env.MONGODB_URL)
function connectDB() {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log(("MongoDB connected...")))
        .catch((err) => console.log(err));
}


export default connectDB