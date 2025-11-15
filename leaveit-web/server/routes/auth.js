const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { Employee } = require('../models/Employee');

const router = express.Router();

const registerSchema = z.object({
  employeeId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['employee', 'manager']).default('employee'),
});

router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid data', details: parsed.error.format() });
    }

    const { employeeId, name, email, password, role } = parsed.data;

    const existing = await Employee.findOne({ $or: [{ employeeId }, { email }] });
    if (existing) {
      return res.status(409).json({ error: 'Employee with this ID or email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      passwordHash,
      role,
    });

    return res.status(201).json({
      id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const loginSchema = z.object({
  employeeId: z.string().min(1),
  password: z.string().min(1),
});

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid data', details: parsed.error.format() });
    }

    const { employeeId, password } = parsed.data;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, employee.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({
      id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
