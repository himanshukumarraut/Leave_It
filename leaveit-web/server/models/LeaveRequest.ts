import mongoose, { Schema, Document } from 'mongoose';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface ILeaveRequest extends Document {
  employeeId: string;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: LeaveStatus;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
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

export const LeaveRequest =
  (mongoose.models.LeaveRequest as mongoose.Model<ILeaveRequest>) ||
  mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema);
