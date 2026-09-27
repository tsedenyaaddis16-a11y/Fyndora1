import express from 'express';
import { getMampPool } from '../config/mampDb.js';
import { SEED_UNIVERSITIES } from '../data/universityData.js';

const router = express.Router();

/**
 * GET /api/universities
 * Query params: country, region, search
 */
router.get('/', async (req, res) => {
  try {
    const { country, region, search } = req.query;
    const pool = getMampPool();

    let query = 'SELECT * FROM universities WHERE 1=1';
    const params = [];

    if (country && country !== 'All') {
      query += ' AND country = ?';
      params.push(country);
    }

    if (region && region !== 'All') {
      query += ' AND region = ?';
      params.push(region);
    }

    if (search) {
      query += ' AND (name LIKE ? OR overview LIKE ? OR popular_majors LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY name ASC';

    const [rows] = await pool.query(query, params);

    // If database has universities, format and return
    if (rows && rows.length > 0) {
      const formatted = rows.map(r => ({
        id: r.slug,
        _id: r.id,
        name: r.name,
        slug: r.slug,
        country: r.country,
        city: r.city,
        region: r.region,
        overview: r.overview,
        academicRequirements: r.academic_requirements,
        applicationRequirements: r.application_requirements,
        deadlines: typeof r.deadlines === 'string' ? JSON.parse(r.deadlines || '[]') : r.deadlines || [],
        testingRequirements: r.testing_requirements,
        financialAid: r.financial_aid,
        internationalInfo: r.international_info,
        popularMajors: typeof r.popular_majors === 'string' ? JSON.parse(r.popular_majors || '[]') : r.popular_majors || [],
        officialWebsite: r.official_website,
        admissionsUrl: r.admissions_url,
        acceptanceRate: r.acceptance_rate,
        graduationRate: r.graduation_rate,
        averageTuition: r.average_tuition,
        needBlindInternational: Boolean(r.need_blind_international),
        meetsFullNeed: Boolean(r.meets_full_need),
        verified: Boolean(r.verified),
      }));

      return res.json({ success: true, count: formatted.length, universities: formatted });
    }

    // Fallback to static seed data if not yet in database
    let list = SEED_UNIVERSITIES;
    if (country && country !== 'All') {
      list = list.filter(u => u.country === country);
    }
    if (region && region !== 'All') {
      list = list.filter(u => u.region === region);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.overview.toLowerCase().includes(q) ||
        (u.popularMajors && u.popularMajors.some(m => m.toLowerCase().includes(q)))
      );
    }

    res.json({
      success: true,
      count: list.length,
      universities: list.map(u => ({ ...u, id: u.slug })),
    });
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ message: 'Failed to retrieve universities', error: error.message });
  }
});

/**
 * GET /api/universities/:slugOrId
 */
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const pool = getMampPool();

    const [rows] = await pool.query(
      'SELECT * FROM universities WHERE slug = ? OR id = ? LIMIT 1',
      [slugOrId, slugOrId]
    );

    if (rows && rows.length > 0) {
      const r = rows[0];
      return res.json({
        success: true,
        university: {
          id: r.slug,
          _id: r.id,
          name: r.name,
          slug: r.slug,
          country: r.country,
          city: r.city,
          region: r.region,
          overview: r.overview,
          academicRequirements: r.academic_requirements,
          applicationRequirements: r.application_requirements,
          deadlines: typeof r.deadlines === 'string' ? JSON.parse(r.deadlines || '[]') : r.deadlines || [],
          testingRequirements: r.testing_requirements,
          financialAid: r.financial_aid,
          internationalInfo: r.international_info,
          popularMajors: typeof r.popular_majors === 'string' ? JSON.parse(r.popular_majors || '[]') : r.popular_majors || [],
          officialWebsite: r.official_website,
          admissionsUrl: r.admissions_url,
          acceptanceRate: r.acceptance_rate,
          graduationRate: r.graduation_rate,
          averageTuition: r.average_tuition,
          needBlindInternational: Boolean(r.need_blind_international),
          meetsFullNeed: Boolean(r.meets_full_need),
          verified: Boolean(r.verified),
        },
      });
    }

    // Static fallback
    const found = SEED_UNIVERSITIES.find(u => u.slug === slugOrId || u.id === slugOrId);
    if (found) {
      return res.json({ success: true, university: { ...found, id: found.slug } });
    }

    res.status(404).json({ message: 'University not found' });
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({ message: 'Failed to retrieve university', error: error.message });
  }
});

export default router;
