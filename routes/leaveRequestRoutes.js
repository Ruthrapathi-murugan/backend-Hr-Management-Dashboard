// routes/leaveRoutes.js
import express from 'express';
import LeaveRequest from '../models/leaveRequestModel.js'; // Adjust path as necessary

const router = express.Router();

// Create leave request
router.post('/leave-requests', async (req, res) => {
  try {
    const { employeeName, leaveType, startDate, endDate, department, reason } = req.body;

    const newLeaveRequest = new LeaveRequest({
      employeeName,
      leaveType,
      startDate,
      endDate,
      department,
      reason,
    });

    const savedRequest = await newLeaveRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating leave request:', error.message);
    res.status(400).json({ message: 'Error creating leave request', error: error.message });
  }
});

// Get all leave requests
router.get('/leave-requests', async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
  }
});

// Update leave request status
router.patch('/leave-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating leave request:', error.message);
    res.status(400).json({ message: 'Error updating leave request', error: error.message });
  }
});

// Delete leave request

app.delete('/api/leave-requests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await LeaveRequest.findByIdAndDelete(id); // Ensure you're using the correct model
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting leave request' });
  }
});


export default router;
