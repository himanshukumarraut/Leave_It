const express = require('express');
const { z } = require('zod');
const { Employee } = require('../models/Employee');
const { LeaveRequest } = require('../models/LeaveRequest');

const router = express.Router();

const createLeaveSchema = z.object({
  employeeId: z.string().min(1),
  fromDate: z.string().min(1),
  toDate: z.string().min(1),
  reason: z.string().min(1),
});

router.post('/', async (req, res) => {
  try {
    const parsed = createLeaveSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid data', details: parsed.error.format() });
    }

    const { employeeId, fromDate, toDate, reason } = parsed.data;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffMs = end.getTime() - start.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;

    const remaining = employee.totalLeavesPerYear - employee.leavesTaken;
    if (days > remaining) {
      return res.status(400).json({ error: 'Not enough leave balance' });
    }

    const leave = await LeaveRequest.create({
      employeeId,
      fromDate: start,
      toDate: end,
      reason,
      status: 'pending',
    });

    return res.status(201).json(leave);
  } catch (err) {
    console.error('Create leave error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const leaves = await LeaveRequest.find({ employeeId }).sort({ createdAt: -1 });

    const remaining = employee.totalLeavesPerYear - employee.leavesTaken;

    return res.json({
      employee: {
        employeeId: employee.employeeId,
        name: employee.name,
        totalLeavesPerYear: employee.totalLeavesPerYear,
        leavesTaken: employee.leavesTaken,
        leavesRemaining: remaining,
      },
      leaves,
    });
  } catch (err) {
    console.error('Get employee leaves error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/pending', async (_req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
    return res.json(leaves);
  } catch (err) {
    console.error('Get pending leaves error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const leave = await LeaveRequest.findById(id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ error: 'Leave already processed' });
    }

    if (action === 'approve') {
      const employee = await Employee.findOne({ employeeId: leave.employeeId });
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const diffMs = leave.toDate.getTime() - leave.fromDate.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;

      employee.leavesTaken += days;
      await employee.save();

      leave.status = 'approved';
    } else {
      leave.status = 'rejected';
    }

    await leave.save();

    return res.json(leave);
  } catch (err) {
    console.error('Update leave error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
