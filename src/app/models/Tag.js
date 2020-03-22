import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: String,
  filed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  created_by: Number,
  updated_at: {
    type: Date,
    default: new Date(),
  },
  updated_by: Number,
});

export default mongoose.model('Tag', TagSchema);
