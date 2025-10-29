const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  thumbnail: { type: String },
  category: { type: String },
  level: { 
    type: String, 
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced', 'beginner', 'intermediate', 'advanced'],
      message: '{VALUE} is not a valid level'
    },
    default: 'Beginner'
  },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

courseSchema.pre('save', function(next) {
  if (this.level) {
    this.level = this.level.charAt(0).toUpperCase() + this.level.slice(1).toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);