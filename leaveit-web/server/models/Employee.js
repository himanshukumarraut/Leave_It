const mongoose = require('mongoose');

const { Schema } = mongoose;

const EmployeeSchema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
    totalLeavesPerYear: { type: Number, default: 40 },
    leavesTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

module.exports = { Employee };
