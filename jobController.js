const { JobPosting, JobApplication, Alumni } = require('../models');
const { Op } = require('sequelize');

// Create job posting
exports.createJobPosting = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      eligibility,
      status
    } = req.body;

    const jobPosting = await JobPosting.create({
      posted_by_alumni_id: req.user.alumni_id,
      title,
      company,
      location,
      description,
      eligibility,
      status: status || 'active'
    });

    res.status(201).json({
      message: 'Job posting created successfully',
      jobPosting
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all job postings
exports.getAllJobPostings = async (req, res) => {
  try {
    const { search, company, status } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } }
      ];
    }

    if (company) {
      where.company = company;
    }

    if (status) {
      where.status = status;
    }

    const jobPostings = await JobPosting.findAll({
      where,
      include: [
        {
          model: Alumni,
          as: 'poster',
          attributes: { exclude: ['password_hash'] }
        }
      ],
      order: [['post_date', 'DESC']]
    });

    res.json(jobPostings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get job posting by ID
exports.getJobPostingById = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByPk(req.params.id, {
      include: [
        {
          model: Alumni,
          as: 'poster',
          attributes: { exclude: ['password_hash'] }
        },
        {
          model: JobApplication,
          as: 'applications',
          include: [
            {
              model: Alumni,
              as: 'applicant',
              attributes: { exclude: ['password_hash'] }
            }
          ]
        }
      ]
    });

    if (!jobPosting) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    res.json(jobPosting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update job posting
exports.updateJobPosting = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByPk(req.params.id);
    if (!jobPosting) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    // Check if user is the poster or admin
    if (jobPosting.posted_by_alumni_id !== req.user.alumni_id && req.userType !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this job posting' });
    }

    await jobPosting.update(req.body);

    res.json({
      message: 'Job posting updated successfully',
      jobPosting: await JobPosting.findByPk(req.params.id, {
        include: [
          {
            model: Alumni,
            as: 'poster',
            attributes: { exclude: ['password_hash'] }
          }
        ]
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete job posting
exports.deleteJobPosting = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByPk(req.params.id);
    if (!jobPosting) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    // Check if user is the poster or admin
    if (jobPosting.posted_by_alumni_id !== req.user.alumni_id && req.userType !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this job posting' });
    }

    await jobPosting.destroy();
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Apply for job
exports.applyForJob = async (req, res) => {
  try {
    const { id } = req.params;

    const jobPosting = await JobPosting.findByPk(id);
    if (!jobPosting) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    // Check if already applied
    const existing = await JobApplication.findOne({
      where: {
        job_id: id,
        applicant_alumni_id: req.user.alumni_id
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    const application = await JobApplication.create({
      job_id: id,
      applicant_alumni_id: req.user.alumni_id,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: {
        applicant_alumni_id: req.user.alumni_id
      },
      include: [
        {
          model: JobPosting,
          as: 'job',
          include: [
            {
              model: Alumni,
              as: 'poster',
              attributes: { exclude: ['password_hash'] }
            }
          ]
        }
      ],
      order: [['apply_date', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update application status (for job poster or admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await JobApplication.findByPk(id, {
      include: [
        {
          model: JobPosting,
          as: 'job'
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user is the job poster or admin
    const isPoster = application.job.posted_by_alumni_id === req.user.alumni_id;
    if (!isPoster && req.userType !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    await application.update({ status });

    res.json({
      message: 'Application status updated',
      application: await JobApplication.findByPk(id, {
        include: [
          {
            model: JobPosting,
            as: 'job'
          },
          {
            model: Alumni,
            as: 'applicant',
            attributes: { exclude: ['password_hash'] }
          }
        ]
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

