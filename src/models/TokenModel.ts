import mongoose, { Schema, Document } from 'mongoose';

interface IToken extends Document {
  email: string;
  token: string;
}

const TokenSchema: Schema = new Schema({
  token: { type: String, required: true },
  email: { type: String, required: true },


});

// Export the model and return your IUser interface
export default mongoose.model<IToken>('Token', TokenSchema);