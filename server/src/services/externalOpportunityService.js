const mongoose = require('mongoose');
const opportunitySchema = require('../models/Opportunity');

let externalConn = null;
let OpportunityModel = null;

const getExternalModel = async () => {
  if (OpportunityModel) return OpportunityModel;

  const uri = process.env.EXTERNAL_MONGODB_URI || 'mongodb://ndsf999_db_user:bq8uTXpYuuuLfAhe@ac-rwrrjcy-shard-00-01.vptojr2.mongodb.net:27017,ac-rwrrjcy-shard-00-02.vptojr2.mongodb.net:27017,ac-rwrrjcy-shard-00-00.vptojr2.mongodb.net:27017/opportunity_bridge?ssl=true&authSource=admin&replicaSet=atlas-6mcu0r-shard-0';

  try {
    console.log('Connecting to external Opportunity MongoDB database (opportunity_bridge)...');
    externalConn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 10000
    }).asPromise();
    OpportunityModel = externalConn.model('Opportunity', opportunitySchema);
    console.log('✅ External Opportunity DB Connected Successfully');
    return OpportunityModel;
  } catch (error) {
    console.warn('Failed to connect to external Opportunity DB:', error.message);
    return null;
  }
};

const getMatchingOpportunities = async (declaredSkills = [], targetIncome = 100000) => {
  try {
    const Model = await getExternalModel();
    let rawOpps = [];

    if (Model) {
      rawOpps = await Model.find({
        status: { $regex: /^open$/i },
        category: { $in: ['Jobs', 'Internships', 'Internship', 'Research', 'Training', 'Workshop', 'Project', 'Scholarships', 'Scholarship'] }
      }).limit(50).lean();
    }

    const userSkills = declaredSkills.map(s => String(s).trim().toLowerCase());

    if (!rawOpps || rawOpps.length === 0) {
      // Fallback matching list if DB is unreachable
      return [
        {
          role: 'Full-Stack Software Engineering Intern',
          industry: 'Department of Information & Communication Technology',
          category: 'Internships',
          location: 'Faculty Campus / Matara',
          estimatedSalary: Math.max(targetIncome, 100000),
          requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
          gapSkills: ['React', 'MongoDB'],
          matchPercentage: 75,
          applicationUrl: 'https://fot.ruh.ac.lk/apply'
        },
        {
          role: 'AI & Machine Learning Research Assistantship',
          industry: 'Department of Information & Communication Technology',
          category: 'Research',
          location: 'ICT Advanced Lab & Remote',
          estimatedSalary: Math.max(Math.round(targetIncome * 1.1), 110000),
          requiredSkills: ['Python / PyTorch proficiency', '3rd or 4th year FoT student', 'Linear Algebra'],
          gapSkills: ['PyTorch', 'Linear Algebra'],
          matchPercentage: 65,
          applicationUrl: 'https://fot.ruh.ac.lk/research/ai-grant'
        },
        {
          role: 'Cloud Architecture & Kubernetes Workshop',
          industry: 'Department of Engineering Technology',
          category: 'Training',
          location: 'Auditorium & Virtual Lab',
          estimatedSalary: Math.max(Math.round(targetIncome * 0.9), 85000),
          requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Linux'],
          gapSkills: ['Kubernetes', 'AWS'],
          matchPercentage: 55,
          applicationUrl: 'https://fot.ruh.ac.lk/workshops/cloud'
        }
      ];
    }

    // Score & match opportunities based on user skills
    const scoredOpps = rawOpps.map(opp => {
      const reqList = (opp.requirements && opp.requirements.length > 0)
        ? opp.requirements
        : (opp.tags && opp.tags.length > 0 ? opp.tags : ['Technical Qualification']);

      const allOppSkillText = [...reqList, ...(opp.tags || []), opp.title, opp.description]
        .join(' ')
        .toLowerCase();

      const matchedSkills = reqList.filter(req => {
        const rLower = req.toLowerCase();
        return userSkills.some(us => us.length >= 2 && (rLower.includes(us) || allOppSkillText.includes(us)));
      });

      const gapSkills = reqList.filter(req => !matchedSkills.includes(req));

      let matchPercentage = 45;
      if (userSkills.length > 0) {
        const ratio = matchedSkills.length / Math.max(1, reqList.length);
        matchPercentage = Math.min(98, Math.max(50, Math.round(50 + ratio * 48)));
      } else {
        matchPercentage = 60;
      }

      let estSalary = targetIncome;
      const catLower = String(opp.category).toLowerCase();
      if (catLower.includes('job')) estSalary = Math.max(targetIncome, 120000);
      else if (catLower.includes('intern')) estSalary = Math.round(targetIncome * 0.8);
      else if (catLower.includes('research')) estSalary = Math.round(targetIncome * 0.9);
      else estSalary = Math.round(targetIncome * 0.75);

      return {
        id: opp._id,
        role: opp.title,
        industry: opp.department || opp.category,
        category: opp.category,
        location: opp.location || 'Faculty Campus / Matara',
        estimatedSalary: estSalary,
        requiredSkills: reqList,
        gapSkills: gapSkills.length > 0 ? gapSkills : ['Advanced Domain Knowledge'],
        matchPercentage,
        applicationUrl: opp.applicationUrl || (opp.contactEmail ? `mailto:${opp.contactEmail}` : 'https://fot.ruh.ac.lk/apply'),
        contactEmail: opp.contactEmail,
        description: opp.description
      };
    });

    // Sort by match percentage descending
    scoredOpps.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return scoredOpps.slice(0, 6);
  } catch (error) {
    console.error('Error fetching matching opportunities:', error.message);
    return [];
  }
};

const getOpportunitiesForRoadmap = async () => {
  try {
    const Model = await getExternalModel();
    if (!Model) return [];
    const opps = await Model.find({ status: { $regex: /^open$/i } }).limit(20).lean();
    return opps;
  } catch (error) {
    console.error('Error fetching roadmap opportunities:', error.message);
    return [];
  }
};

module.exports = {
  getMatchingOpportunities,
  getOpportunitiesForRoadmap
};
