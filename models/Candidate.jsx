

import mongoose from 'mongoose';


const candidateSchema = new mongoose.Schema({
    id: Number,
    name: String,
    position: String,
    status: String,
    email: String,
    phone: String,
    applicationDate: String,
    notes: String,
  });
  
  const Candidate = mongoose.model('Candidate', candidateSchema);

  export default Candidate;
  
