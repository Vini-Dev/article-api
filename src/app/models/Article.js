import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
  title: String,
  content: String,
  cover: String,
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

export default mongoose.model('ideas', IdeaSchema);
