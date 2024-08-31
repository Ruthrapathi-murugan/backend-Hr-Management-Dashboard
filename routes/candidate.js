import express from "express";
import Candidate from '../models/Candidate.js';

const router = express.Router();

// Candidate hiring routes
router.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/api/candidates', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/api/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.status(200).json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
