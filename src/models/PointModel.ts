import mongoose, { Schema, Document } from 'mongoose';

export interface IPoint extends Document {
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;

}

const PointSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ["Went well", "Didn’t go well", "Need to improve"] },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date },
  updatedAt: { type: Date },

});
PointSchema.pre('save', function (this: IPoint, next: any): void {
  const modelData: any = this;
  modelData.createdAt = new Date();
  next();
});

PointSchema.pre('findOneAndUpdate', function (this: any, next: any) {
  if (this._update.$set) {
    this._update.$set.updatedAt = new Date();
  } else {
    this._update.updatedAt = new Date();
  }
  next();
});
// Export the model and return your Ipoint interface
export default mongoose.model<IPoint>('Point', PointSchema);