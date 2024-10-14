// routes/employee.routes.js

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const auth = require('../middlewares/auth');

router.get('/employees', auth, employeeController.getAllEmployees);
router.post('/employees', auth, employeeController.createEmployee);
router.get('/employees/:eid', auth, employeeController.getEmployeeById);
router.put('/employees/:eid', auth, employeeController.updateEmployee);
router.delete('/employees', auth, employeeController.deleteEmployee);



module.exports = router;
