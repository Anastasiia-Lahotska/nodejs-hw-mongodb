import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, match: [/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'] },
  phoneNumber: { type: String, required: true, trim: true },
  isFavourite: { type: Boolean, default: false },
  contactType: { type: String, enum: ['work', 'home', 'personal'], default: 'personal', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true,
    versionKey: false,
 });

export const Contact = mongoose.model('Contact', contactSchema);