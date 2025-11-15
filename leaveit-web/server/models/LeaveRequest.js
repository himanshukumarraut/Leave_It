const mongoose = require('mongoose');

const { Schema } = mongoose;

const LeaveRequestSchema = new Schema(
  {
    employeeId: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const LeaveRequest =
  mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', LeaveRequestSchema);

module.exports = { LeaveRequest };
