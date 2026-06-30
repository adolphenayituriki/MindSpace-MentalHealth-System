const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { admin, staff } = require('../middleware/admin');
const ctrl = require('../controllers/adminController');

router.use(auth);

router.get('/stats', admin, ctrl.getStats);

router.get('/users', admin, ctrl.listUsers);
router.patch('/users/:id/role', admin, ctrl.updateUserRole);
router.delete('/users/:id', admin, ctrl.deleteUser);

router.post('/healing', staff, ctrl.createHealing);
router.put('/healing/:id', staff, ctrl.updateHealing);
router.delete('/healing/:id', admin, ctrl.deleteHealing);

router.post('/counselors', admin, ctrl.createCounselor);
router.put('/counselors/:id', admin, ctrl.updateCounselor);
router.delete('/counselors/:id', admin, ctrl.deleteCounselor);

router.post('/crisis', staff, ctrl.createCrisis);
router.put('/crisis/:id', staff, ctrl.updateCrisis);
router.delete('/crisis/:id', admin, ctrl.deleteCrisis);

router.post('/communities', staff, ctrl.createCommunity);
router.put('/communities/:id', staff, ctrl.updateCommunity);
router.delete('/communities/:id', admin, ctrl.deleteCommunity);

router.post('/users', admin, ctrl.createUser);

router.get('/assessments', staff, ctrl.listAssessments);
router.post('/assessments', staff, ctrl.createAssessment);
router.put('/assessments/:id', staff, ctrl.updateAssessment);
router.delete('/assessments/:id', admin, ctrl.deleteAssessment);

router.get('/courses', staff, ctrl.listCourses);
router.post('/courses', staff, ctrl.createCourse);
router.put('/courses/:id', staff, ctrl.updateCourse);
router.delete('/courses/:id', admin, ctrl.deleteCourse);

router.get('/bookings', admin, ctrl.listAllBookings);
router.delete('/bookings/:id', admin, ctrl.deleteBooking);

module.exports = router;
