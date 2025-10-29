const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  duration: { type: Number }, 
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  order: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lecture', lectureSchema);