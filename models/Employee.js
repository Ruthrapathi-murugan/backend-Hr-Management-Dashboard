// models/Employee.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  salary: String,
  image: String,
  id: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
