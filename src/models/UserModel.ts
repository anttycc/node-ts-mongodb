import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  password: string;

}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  gender: {
    type: String, "enum": [
      "Male",
      "Female",
      "Other"
    ]
  },
  password: { type: String, required: true }

});

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);