const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Alumni validation rules
const validateAlumniRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('contact').trim().notEmpty().withMessage('Contact is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('year_of_graduation').isInt({ min: 1900, max: 2100 }).withMessage('Valid graduation year is required'),
  body('branch').trim().notEmpty().withMessage('Branch is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const validateAlumniUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('contact').optional().trim().notEmpty().withMessage('Contact cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('year_of_graduation').optional().isInt({ min: 1900, max: 2100 }).withMessage('Valid graduation year is required'),
  body('branch').optional().trim().notEmpty().withMessage('Branch cannot be empty'),
  body('CGPA').optional().isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
  body('placement').optional().isIn(['on_campus', 'off_campus']).withMessage('Invalid placement type'),
  body('experience_years').optional().isInt({ min: 0 }).withMessage('Experience years must be non-negative'),
  handleValidationErrors
];

// Admin validation rules
const validateAdminRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

// Mentorship validation rules
const validateMentorshipRequest = [
  body('mentee_alumni_id').isInt().withMessage('Valid mentee alumni ID is required'),
  handleValidationErrors
];

const validateMentorshipUpdate = [
  body('status').isIn(['requested', 'active', 'completed', 'cancelled']).withMessage('Invalid status'),
  handleValidationErrors
];

// Event validation rules
const validateEventCreate = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').optional().trim(),
  body('description').optional().trim(),
  handleValidationErrors
];

// Job Posting validation rules
const validateJobPosting = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('location').optional().trim(),
  body('description').optional().trim(),
  body('eligibility').optional().trim(),
  handleValidationErrors
];

const validateJobApplication = [
  body('job_id').isInt().withMessage('Valid job ID is required'),
  handleValidationErrors
];

// Message validation rules
const validateMessage = [
  body('receiver_id').isInt().withMessage('Valid receiver ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required'),
  handleValidationErrors
];

module.exports = {
  validateAlumniRegistration,
  validateAlumniUpdate,
  validateAdminRegistration,
  validateMentorshipRequest,
  validateMentorshipUpdate,
  validateEventCreate,
  validateJobPosting,
  validateJobApplication,
  validateMessage,
  handleValidationErrors
};

