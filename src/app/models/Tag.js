import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: String,
  filed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  created_by: Number,
  updated_at: {
    type: Date,
    default: Date.now(),
  },
  updated_by: Number,
});

export default mongoose.model('Tag', TagSchema);
