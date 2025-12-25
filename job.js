const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, authorizeAlumni, authorizeAdminOrAlumni } = require('../utils/authMiddleware');
const {
  validateJobPosting,
  validateJobApplication
} = require('../utils/validators');

// Get all job postings (authenticated)
router.get('/', authenticate, jobController.getAllJobPostings);

// Get job posting by ID
router.get('/:id', authenticate, jobController.getJobPostingById);

// Create job posting (alumni only)
router.post('/', authenticate, authorizeAlumni, validateJobPosting, jobController.createJobPosting);

// Update job posting (poster or admin)
router.put('/:id', authenticate, authorizeAdminOrAlumni, jobController.updateJobPosting);

// Delete job posting (poster or admin)
router.delete('/:id', authenticate, authorizeAdminOrAlumni, jobController.deleteJobPosting);

// Apply for job (alumni only)
router.post('/:id/apply', authenticate, authorizeAlumni, validateJobApplication, jobController.applyForJob);

// Get my applications (alumni only)
router.get('/applications/my', authenticate, authorizeAlumni, jobController.getMyApplications);

// Update application status (job poster or admin)
router.put('/applications/:id/status', authenticate, authorizeAdminOrAlumni, jobController.updateApplicationStatus);

module.exports = router;

