import mongoose from "mongoose";

export default function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
