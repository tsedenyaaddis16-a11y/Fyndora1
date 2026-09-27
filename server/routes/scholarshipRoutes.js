import express from 'express';
import { getMampPool } from '../config/mampDb.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

const formatScholarshipRow = (row) => ({
  id: row.id,
  _id: row.id,
  title: row.title,
  provider: row.provider,
  description: row.description,
  country: row.country,
  destination: row.destination,
  educationLevel: row.education_level,
  eligibleNationalities: typeof row.eligible_nationalities === 'string' ? JSON.parse(row.eligible_nationalities || '[]') : row.eligible_nationalities || [],
  minimumAge: row.minimum_age,
  maximumAge: row.maximum_age,
  eligibleGrades: typeof row.eligible_grades === 'string' ? JSON.parse(row.eligible_grades || '[]') : row.eligible_grades || [],
  fields: typeof row.fields === 'string' ? JSON.parse(row.fields || '[]') : row.fields || [],
  fundingType: row.funding_type,
  coverage: typeof row.coverage === 'string' ? JSON.parse(row.coverage || '[]') : row.coverage || [],
  boarding: Boolean(row.boarding),
  languageRequirements: row.language_requirements,
  academicRequirements: row.academic_requirements,
  deadline: row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : null,
  applicationUrl: row.application_url,
  officialWebsite: row.official_website,
  verified: Boolean(row.verified),
  lastVerified: row.last_verified,
  status: row.status,
  isDemo: Boolean(row.is_demo),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Helper matching algorithm
const evaluateMatches = (scholarships, profile) => {
  const {
    age,
    nationality,
    country,
    grade,
    preferredDestination,
    field,
    fundingPreference,
    boardingRequired,
  } = profile;

  return scholarships.map((sch) => {
    const reasons = [];
    let score = 0;
    let unconfirmed = false;

    // Age check
    if (age && sch.minimumAge && sch.maximumAge) {
      const ageNum = parseInt(age, 10);
      if (ageNum >= sch.minimumAge && ageNum <= sch.maximumAge) {
        reasons.push(`You are within the required age range (${sch.minimumAge}–${sch.maximumAge} years old)`);
        score += 25;
      } else {
        score -= 30;
      }
    } else if (!age) {
      unconfirmed = true;
    }

    // Nationality check
    const userNat = (nationality || country || '').toLowerCase();
    if (userNat && sch.eligibleNationalities && sch.eligibleNationalities.length > 0) {
      const matchesNat = sch.eligibleNationalities.some((nat) => {
        const n = nat.toLowerCase();
        return (
          n.includes(userNat) ||
          n.includes('all') ||
          n.includes('sub-saharan') ||
          n.includes('african') ||
          n.includes('international')
        );
      });
      if (matchesNat) {
        reasons.push(`${nationality || country} is an eligible nationality`);
        score += 30;
      }
    } else if (!userNat) {
      unconfirmed = true;
    }

    // Grade check
    if (grade && sch.eligibleGrades && sch.eligibleGrades.length > 0) {
      const gradeMatch = sch.eligibleGrades.some(
        (g) =>
          g.toLowerCase().includes(grade.toLowerCase()) ||
          g.toLowerCase().includes('high school') ||
          g.toLowerCase().includes('applicant')
      );
      if (gradeMatch) {
        reasons.push(`You are currently in ${grade}, which aligns with accepted grades`);
        score += 20;
      }
    }

    // Destination check
    if (preferredDestination && sch.destination) {
      if (sch.destination.toLowerCase().includes(preferredDestination.toLowerCase())) {
        reasons.push(`Offers study in your target destination: ${preferredDestination}`);
        score += 15;
      }
    }

    // Field check
    if (field && sch.fields && sch.fields.length > 0) {
      const fieldMatch = sch.fields.some(
        (f) => f.toLowerCase() === 'any' || f.toLowerCase().includes(field.toLowerCase())
      );
      if (fieldMatch) {
        reasons.push(`Covers courses in ${field}`);
        score += 15;
      }
    }

    // Funding check
    if (fundingPreference === 'Fully funded' && sch.fundingType === 'Fully funded') {
      reasons.push('Provides 100% full funding (Tuition + Living expenses)');
      score += 10;
    }

    // Boarding check
    if ((boardingRequired === 'true' || boardingRequired === true) && sch.boarding) {
      reasons.push('Includes full on-campus residential boarding');
      score += 5;
    }

    return {
      scholarship: sch,
      score,
      reasons,
      unconfirmed: reasons.length === 0 || unconfirmed,
    };
  });
};

// @route   GET /api/scholarships/matches
// @desc    Compare student profile with scholarship eligibility in MAMP
// @access  Public
router.get('/matches', async (req, res) => {
  try {
    const pool = getMampPool();
    const [rows] = await pool.query("SELECT * FROM scholarships WHERE status = 'active'");
    const scholarships = rows.map(formatScholarshipRow);

    const results = evaluateMatches(scholarships, req.query);
    const filtered = results.filter((r) => r.score > 15).sort((a, b) => b.score - a.score);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/scholarships
// @desc    Get all scholarships with multi-filter from MAMP MySQL
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      country,
      destination,
      funding,
      fundingType,
      educationLevel,
      boarding,
      nationality,
      search,
      includeExpired,
      sort,
      limit,
    } = req.query;

    const pool = getMampPool();
    let query = "SELECT * FROM scholarships WHERE status = 'active'";
    const params = [];

    const targetCountry = destination || country;
    if (targetCountry && targetCountry !== 'All') {
      query += ' AND (destination LIKE ? OR country LIKE ?)';
      const tc = `%${targetCountry}%`;
      params.push(tc, tc);
    }

    const targetFunding = fundingType || funding;
    if (targetFunding && targetFunding !== 'All') {
      query += ' AND funding_type = ?';
      params.push(targetFunding);
    }

    if (educationLevel && educationLevel !== 'All') {
      query += ' AND education_level LIKE ?';
      params.push(`%${educationLevel}%`);
    }

    if (boarding === 'true' || boarding === true) {
      query += ' AND boarding = 1';
    }

    if (search) {
      query += ' AND (title LIKE ? OR provider LIKE ? OR description LIKE ? OR destination LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (includeExpired !== 'true' && includeExpired !== true) {
      query += ' AND (deadline >= CURDATE() OR deadline IS NULL)';
    }

    if (sort === 'alphabetical') {
      query += ' ORDER BY title ASC';
    } else if (sort === 'recent') {
      query += ' ORDER BY created_at DESC';
    } else {
      query += ' ORDER BY deadline ASC';
    }

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const [rows] = await pool.query(query, params);
    let list = rows.map(formatScholarshipRow);

    if (nationality && nationality !== 'All') {
      const nat = nationality.toLowerCase();
      list = list.filter((s) =>
        s.eligibleNationalities.some(
          (n) => n.toLowerCase().includes(nat) || n.toLowerCase().includes('all') || n.toLowerCase().includes('international')
        )
      );
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/scholarships/:id
// @desc    Get single scholarship
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pool = getMampPool();
    const id = req.params.id;

    let rows;
    if (!isNaN(id)) {
      [rows] = await pool.query('SELECT * FROM scholarships WHERE id = ?', [parseInt(id, 10)]);
    } else {
      [rows] = await pool.query('SELECT * FROM scholarships WHERE title LIKE ? LIMIT 1', [`%${id.replace(/-/g, ' ')}%`]);
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Scholarship not found in MAMP' });
    }

    res.json(formatScholarshipRow(rows[0]));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/scholarships
// @desc    Create new scholarship in MAMP
// @access  Private / Admin
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      provider,
      description,
      country,
      destination,
      educationLevel,
      eligibleNationalities,
      minimumAge,
      maximumAge,
      eligibleGrades,
      fields,
      fundingType,
      coverage,
      boarding,
      languageRequirements,
      academicRequirements,
      deadline,
      applicationUrl,
      officialWebsite,
    } = req.body;

    const pool = getMampPool();
    const [result] = await pool.query(
      `INSERT INTO scholarships (title, provider, description, country, destination, education_level, eligible_nationalities, minimum_age, maximum_age, eligible_grades, fields, funding_type, coverage, boarding, language_requirements, academic_requirements, deadline, application_url, official_website, verified, last_verified, status, is_demo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'active', 0)`,
      [
        title,
        provider,
        description,
        country || 'International',
        destination,
        educationLevel || 'Undergraduate',
        JSON.stringify(Array.isArray(eligibleNationalities) ? eligibleNationalities : []),
        minimumAge || null,
        maximumAge || null,
        JSON.stringify(Array.isArray(eligibleGrades) ? eligibleGrades : []),
        JSON.stringify(Array.isArray(fields) ? fields : []),
        fundingType || 'Fully funded',
        JSON.stringify(Array.isArray(coverage) ? coverage : []),
        boarding ? 1 : 0,
        languageRequirements || '',
        academicRequirements || '',
        deadline || null,
        applicationUrl || '',
        officialWebsite || '',
        new Date().toISOString().split('T')[0],
      ]
    );

    res.status(201).json({ id: result.insertId, _id: result.insertId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/scholarships/:id
// @desc    Update scholarship in MAMP
// @access  Private / Admin
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const pool = getMampPool();
    const id = parseInt(req.params.id, 10);
    const {
      title,
      provider,
      description,
      country,
      destination,
      educationLevel,
      eligibleNationalities,
      minimumAge,
      maximumAge,
      fundingType,
      coverage,
      deadline,
      applicationUrl,
      officialWebsite,
    } = req.body;

    await pool.query(
      `UPDATE scholarships
       SET title = ?, provider = ?, description = ?, country = ?, destination = ?, education_level = ?, eligible_nationalities = ?, minimum_age = ?, maximum_age = ?, funding_type = ?, coverage = ?, deadline = ?, application_url = ?, official_website = ?, last_verified = ?
       WHERE id = ?`,
      [
        title,
        provider,
        description,
        country,
        destination,
        educationLevel,
        JSON.stringify(Array.isArray(eligibleNationalities) ? eligibleNationalities : []),
        minimumAge || null,
        maximumAge || null,
        fundingType,
        JSON.stringify(Array.isArray(coverage) ? coverage : []),
        deadline || null,
        applicationUrl,
        officialWebsite,
        new Date().toISOString().split('T')[0],
        id,
      ]
    );

    res.json({ id, _id: id, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/scholarships/:id
// @desc    Delete scholarship from MAMP
// @access  Private / Admin
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const pool = getMampPool();
    await pool.query('DELETE FROM scholarships WHERE id = ?', [parseInt(req.params.id, 10)]);
    res.json({ message: 'Scholarship deleted successfully from MAMP' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
