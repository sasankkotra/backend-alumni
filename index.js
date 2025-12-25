const sequelize = require('../config/db');
const Alumni = require('./Alumni');
const Admin = require('./Admin');
const Mentorship = require('./Mentorship');
const Event = require('./Event');
const EventParticipation = require('./EventParticipation');
const JobPosting = require('./JobPosting');
const JobApplication = require('./JobApplication');
const Message = require('./Message');

// Alumni - Mentorship relationships (self-referential many-to-many)
Alumni.hasMany(Mentorship, { foreignKey: 'mentor_alumni_id', as: 'mentorRelationships' });
Alumni.hasMany(Mentorship, { foreignKey: 'mentee_alumni_id', as: 'menteeRelationships' });
Mentorship.belongsTo(Alumni, { foreignKey: 'mentor_alumni_id', as: 'mentor' });
Mentorship.belongsTo(Alumni, { foreignKey: 'mentee_alumni_id', as: 'mentee' });

// Alumni - Event Participation (many-to-many)
Alumni.hasMany(EventParticipation, { foreignKey: 'alumni_id', as: 'eventParticipations' });
EventParticipation.belongsTo(Alumni, { foreignKey: 'alumni_id', as: 'alumni' });
EventParticipation.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
Event.hasMany(EventParticipation, { foreignKey: 'event_id', as: 'participations' });

// Admin/Alumni - Event (one-to-many via organizer_id)
// Note: organizer_id can reference either Admin or Alumni, handled at application level

// Alumni - Job Posting (one-to-many)
Alumni.hasMany(JobPosting, { foreignKey: 'posted_by_alumni_id', as: 'jobPostings' });
JobPosting.belongsTo(Alumni, { foreignKey: 'posted_by_alumni_id', as: 'poster' });

// Alumni - Job Application (many-to-many via JobApplication)
Alumni.hasMany(JobApplication, { foreignKey: 'applicant_alumni_id', as: 'jobApplications' });
JobApplication.belongsTo(Alumni, { foreignKey: 'applicant_alumni_id', as: 'applicant' });
JobApplication.belongsTo(JobPosting, { foreignKey: 'job_id', as: 'job' });
JobPosting.hasMany(JobApplication, { foreignKey: 'job_id', as: 'applications' });

// Admin - Alumni (one-to-many for verification)
Admin.hasMany(Alumni, { foreignKey: 'verified_by_admin_id', as: 'verifiedAlumni' });
Alumni.belongsTo(Admin, { foreignKey: 'verified_by_admin_id', as: 'verifier' });

// Alumni - Alumni via Message (many-to-many)
Alumni.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
Alumni.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
Message.belongsTo(Alumni, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(Alumni, { foreignKey: 'receiver_id', as: 'receiver' });

module.exports = {
  sequelize,
  Alumni,
  Admin,
  Mentorship,
  Event,
  EventParticipation,
  JobPosting,
  JobApplication,
  Message
};

