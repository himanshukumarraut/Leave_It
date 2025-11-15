import mongoose, { Schema, Document } from 'mongoose';

export type Role = 'employee' | 'manager';

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  totalLeavesPerYear: number;
  leavesTaken: number;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
    totalLeavesPerYear: { type: Number, default: 20 },
    leavesTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Employee =
  (mongoose.models.Employee as mongoose.Model<IEmployee>) ||
  mongoose.model<IEmployee>('Employee', EmployeeSchema);
