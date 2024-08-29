// models/leaveRequestModel.js

import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  employeeName: String,
  leaveType: String,
  startDate: String,
  endDate: String,
  department: String,
  reason: String,
  status: { type: String, default: 'Pending' },
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

export default LeaveRequest;
