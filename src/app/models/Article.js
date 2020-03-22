import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  cover: String,
  tags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tag',
    },
  ],
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

export default mongoose.model('Article', ArticleSchema);
