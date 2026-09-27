import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { getMampPool, initMampDatabase } from '../config/mampDb.js';
import { SEED_CAREERS, SEED_SCHOLARSHIPS, SEED_OPPORTUNITIES } from '../data/seedData.js';
import { SEED_UNIVERSITIES } from '../data/universityData.js';

export const seedMampDatabase = async () => {
  try {
    const initialized = await initMampDatabase();
    if (!initialized) {
      console.warn('⚠️ Could not connect to MAMP MySQL to seed data.');
      return;
    }

    const pool = getMampPool();

    // 1. Seed Admin Users (both fyndora.org and legacy pathfinder.org)
    const adminPasswordHash = await bcrypt.hash('admin12345', 10);
    const [existingFyndoraAdmin] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@fyndora.org']);
    if (existingFyndoraAdmin.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password, role, country, nationality, grade)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Fyndora Admin', 'admin@fyndora.org', adminPasswordHash, 'admin', 'Ethiopia', 'Ethiopia', 'Staff']
      );
      console.log('👤 Created MAMP Admin: admin@fyndora.org / admin12345');
    }

    const [existingAdmin] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@pathfinder.org']);
    if (existingAdmin.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password, role, country, nationality, grade)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Fyndora Admin', 'admin@pathfinder.org', adminPasswordHash, 'admin', 'Ethiopia', 'Ethiopia', 'Staff']
      );
    }

    // Ensure tsedenyaaddis16@gmail.com has admin role
    const [existingTsedenya] = await pool.query('SELECT id FROM users WHERE email = ?', ['tsedenyaaddis16@gmail.com']);
    if (existingTsedenya.length > 0) {
      await pool.query("UPDATE users SET role = 'admin' WHERE email = ?", ['tsedenyaaddis16@gmail.com']);
      console.log('👤 Verified Admin role for tsedenyaaddis16@gmail.com');
    }

    // 2. Seed Student Users (both fyndora.org and legacy pathfinder.org)
    const studentPasswordHash = await bcrypt.hash('student12345', 10);
    const [existingFyndoraStudent] = await pool.query('SELECT id FROM users WHERE email = ?', ['selam.haile@fyndora.org']);
    if (existingFyndoraStudent.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password, role, age, country, nationality, grade, graduation_year, interests, preferred_fields, preferred_countries, funding_preference)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Selam Haile',
          'selam.haile@fyndora.org',
          studentPasswordHash,
          'student',
          17,
          'Ethiopia',
          'Ethiopia',
          'Grade 11',
          2027,
          JSON.stringify(['Technology', 'Engineering']),
          JSON.stringify(['Computer Science', 'Software Engineering']),
          JSON.stringify(['USA', 'Canada', 'Germany']),
          'Fully funded',
        ]
      );
      console.log('👤 Created MAMP Student: selam.haile@fyndora.org / student12345');
    }

    const [existingStudent] = await pool.query('SELECT id FROM users WHERE email = ?', ['selam.haile@pathfinder.org']);
    if (existingStudent.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password, role, age, country, nationality, grade, graduation_year, interests, preferred_fields, preferred_countries, funding_preference)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Selam Haile',
          'selam.haile@pathfinder.org',
          studentPasswordHash,
          'student',
          17,
          'Ethiopia',
          'Ethiopia',
          'Grade 11',
          2027,
          JSON.stringify(['Technology', 'Engineering']),
          JSON.stringify(['Computer Science', 'Software Engineering']),
          JSON.stringify(['USA', 'Canada', 'Germany']),
          'Fully funded',
        ]
      );
    }

    // 3. Seed Careers if empty
    const [careerRows] = await pool.query('SELECT COUNT(*) as count FROM careers');
    if (careerRows[0].count === 0) {
      for (const c of SEED_CAREERS) {
        await pool.query(
          `INSERT INTO careers (title, category, description, responsibilities, skills, high_school_subjects, university_subjects, related_careers, workplaces, resources)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.title,
            c.category,
            c.description,
            JSON.stringify(c.responsibilities || []),
            JSON.stringify(c.skills || []),
            JSON.stringify(c.highSchoolSubjects || []),
            JSON.stringify(c.universitySubjects || []),
            JSON.stringify(c.relatedCareers || []),
            JSON.stringify(c.workplaces || []),
            JSON.stringify(c.resources || []),
          ]
        );
      }
      console.log(`💼 Seeded ${SEED_CAREERS.length} careers into MAMP MySQL`);
    }

    // 4. Seed Scholarships if empty
    const [schRows] = await pool.query('SELECT COUNT(*) as count FROM scholarships');
    if (schRows[0].count === 0) {
      for (const s of SEED_SCHOLARSHIPS) {
        await pool.query(
          `INSERT INTO scholarships (title, provider, description, country, destination, education_level, eligible_nationalities, minimum_age, maximum_age, eligible_grades, fields, funding_type, coverage, boarding, language_requirements, academic_requirements, deadline, application_url, official_website, verified, last_verified, status, is_demo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            s.title,
            s.provider,
            s.description,
            s.country || 'International',
            s.destination,
            s.educationLevel || 'Undergraduate',
            JSON.stringify(s.eligibleNationalities || []),
            s.minimumAge || null,
            s.maximumAge || null,
            JSON.stringify(s.eligibleGrades || []),
            JSON.stringify(s.fields || []),
            s.fundingType || 'Fully funded',
            JSON.stringify(s.coverage || []),
            s.boarding ? 1 : 0,
            s.languageRequirements || '',
            s.academicRequirements || '',
            s.deadline ? s.deadline.toISOString().split('T')[0] : null,
            s.applicationUrl || '',
            s.officialWebsite || '',
            s.verified ? 1 : 0,
            s.lastVerified || '2026-03-01',
            s.status || 'active',
            s.isDemo ? 1 : 0,
          ]
        );
      }
      console.log(`🎓 Seeded ${SEED_SCHOLARSHIPS.length} scholarships into MAMP MySQL`);
    }

    // 5. Seed Opportunities if empty
    const [oppRows] = await pool.query('SELECT COUNT(*) as count FROM opportunities');
    if (oppRows[0].count === 0) {
      for (const o of SEED_OPPORTUNITIES) {
        await pool.query(
          `INSERT INTO opportunities (title, provider, type, description, country, eligibility, deadline, funding, application_url, official_website, verified, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            o.title,
            o.provider,
            o.type,
            o.description,
            o.country || 'Global',
            o.eligibility || '',
            o.deadline ? o.deadline.toISOString().split('T')[0] : null,
            o.funding || '',
            o.applicationUrl || '',
            o.officialWebsite || '',
            o.verified ? 1 : 0,
            o.status || 'active',
          ]
        );
      }
      console.log(`✨ Seeded ${SEED_OPPORTUNITIES.length} opportunities into MAMP MySQL`);
    }

    // 5. Seed Comments if empty
    const [commentRows] = await pool.query('SELECT COUNT(*) as count FROM comments');
    if (commentRows[0].count === 0) {
      const initialComments = [
        {
          targetType: 'career',
          targetId: 'software-engineer',
          targetTitle: 'Software Engineer',
          userName: 'Selam Haile',
          userEmail: 'selam.haile@fyndora.org',
          userRole: 'student',
          userCountry: 'Ethiopia',
          userGrade: 'Grade 11',
          content: 'How much advanced math do I need before university if I want to pursue software engineering? Should I take extra calculus?',
          likes: 5,
          replies: [
            {
              userName: 'Dr. Almaz T.',
              userEmail: 'admin@fyndora.org',
              userRole: 'admin',
              userCountry: 'Ethiopia',
              userGrade: 'Advisor',
              content: 'Focus on Calculus, Discrete Math basics, and logic. You do not need to be a math genius, but strong problem-solving skills will make data structures and algorithms much easier!',
              likes: 8,
            }
          ]
        },
        {
          targetType: 'career',
          targetId: 'software-engineer',
          targetTitle: 'Software Engineer',
          userName: 'Kofi Mensah',
          userEmail: 'kofi@example.com',
          userRole: 'student',
          userCountry: 'Ghana',
          userGrade: 'Grade 12',
          content: 'What is the main difference between studying Computer Science vs Software Engineering in college?',
          likes: 4,
          replies: [
            {
              userName: 'Selam Haile',
              userEmail: 'selam.haile@fyndora.org',
              userRole: 'student',
              userCountry: 'Ethiopia',
              userGrade: 'Grade 11',
              content: 'Computer Science focuses more on mathematical computation theory and algorithms, while Software Engineering is focused on system design, building scalable software, and teamwork practices.',
              likes: 3,
            }
          ]
        },
        {
          targetType: 'career',
          targetId: 'ai-specialist',
          targetTitle: 'AI & Machine Learning Specialist',
          userName: 'David Mwangi',
          userEmail: 'david@example.com',
          userRole: 'student',
          userCountry: 'Kenya',
          userGrade: 'Grade 10',
          content: 'Can high school students start learning Machine Learning now, or should we wait for university?',
          likes: 6,
          replies: [
            {
              userName: 'Dr. Almaz T.',
              userEmail: 'admin@fyndora.org',
              userRole: 'admin',
              userCountry: 'Ethiopia',
              userGrade: 'Advisor',
              content: 'Definitely start now! Learn Python basics, then explore Kaggle courses and scikit-learn. Building small prediction projects in high school gives you an enormous advantage for college applications.',
              likes: 7,
            }
          ]
        },
        {
          targetType: 'scholarship',
          targetId: 'mastercard-foundation-scholars',
          targetTitle: 'Mastercard Foundation Scholars Program',
          userName: 'Amina Yusuf',
          userEmail: 'amina.y@example.com',
          userRole: 'student',
          userCountry: 'Nigeria',
          userGrade: 'Grade 12',
          content: 'Does the Mastercard Foundation scholarship cover travel airfare, laptops, and living allowance?',
          likes: 12,
          replies: [
            {
              userName: 'Fyndora Advisor',
              userEmail: 'admin@fyndora.org',
              userRole: 'admin',
              userCountry: 'Ethiopia',
              userGrade: 'Staff',
              content: 'Yes! It is comprehensive: full tuition, on-campus accommodation, monthly stipend, a laptop, health insurance, and round-trip international flight tickets are fully paid for.',
              likes: 15,
            }
          ]
        },
        {
          targetType: 'scholarship',
          targetId: 'gates-cambridge',
          targetTitle: 'Gates Cambridge Scholarship',
          userName: 'Tadesse G.',
          userEmail: 'tadesse@example.com',
          userRole: 'student',
          userCountry: 'Ethiopia',
          userGrade: 'Undergraduate',
          content: 'What leadership criteria do reviewers prioritize during the interview round?',
          likes: 7,
          replies: []
        },
        {
          targetType: 'opportunity',
          targetId: 'imo-math-olympiad',
          targetTitle: 'International Mathematical Olympiad (IMO)',
          userName: 'Michael K.',
          userEmail: 'michael@example.com',
          userRole: 'student',
          userCountry: 'Kenya',
          userGrade: 'Grade 10',
          content: 'Where can African high school students find official national qualifying competition dates and past papers?',
          likes: 9,
          replies: [
            {
              userName: 'Fyndora Advisor',
              userEmail: 'admin@fyndora.org',
              userRole: 'admin',
              userCountry: 'Ethiopia',
              userGrade: 'Staff',
              content: 'Check the official IMO portal (imo-official.org) for national contact organizations in each country. You can also practice on AoPS (Art of Problem Solving) for free!',
              likes: 11,
            }
          ]
        },
        {
          targetType: 'general',
          targetId: 'community',
          targetTitle: 'Community Student Q&A',
          userName: 'Sarah N.',
          userEmail: 'sarah.n@example.com',
          userRole: 'student',
          userCountry: 'Uganda',
          userGrade: 'Grade 11',
          content: 'Is Grade 11 the best time to start taking standardized exams (like SAT or Duolingo English Test)?',
          likes: 14,
          replies: [
            {
              userName: 'Selam Haile',
              userEmail: 'selam.haile@fyndora.org',
              userRole: 'student',
              userCountry: 'Ethiopia',
              userGrade: 'Grade 11',
              content: 'Yes! Taking your first attempt in Spring of Grade 11 gives you time to retake in Autumn of Grade 12 if you want to improve your score before early scholarship deadlines.',
              likes: 10,
            }
          ]
        }
      ];

      for (const item of initialComments) {
        const [parentRes] = await pool.query(
          `INSERT INTO comments 
            (target_type, target_id, target_title, user_name, user_email, user_role, user_country, user_grade, content, likes, liked_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]')`,
          [
            item.targetType,
            item.targetId,
            item.targetTitle,
            item.userName,
            item.userEmail,
            item.userRole,
            item.userCountry,
            item.userGrade,
            item.content,
            item.likes,
          ]
        );

        const parentId = parentRes.insertId;

        if (item.replies && item.replies.length > 0) {
          for (const rep of item.replies) {
            await pool.query(
              `INSERT INTO comments 
                (target_type, target_id, target_title, parent_id, user_name, user_email, user_role, user_country, user_grade, content, likes, liked_by)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]')`,
              [
                item.targetType,
                item.targetId,
                item.targetTitle,
                parentId,
                rep.userName,
                rep.userEmail,
                rep.userRole,
                rep.userCountry,
                rep.userGrade,
                rep.content,
                rep.likes,
              ]
            );
          }
        }
      }
      console.log('💬 Seeded initial student comments and replies into MAMP MySQL');
    }

    // 6. Seed Universities if empty
    const [uniRows] = await pool.query('SELECT COUNT(*) as count FROM universities');
    if (uniRows[0].count === 0) {
      for (const u of SEED_UNIVERSITIES) {
        await pool.query(
          `INSERT INTO universities (
            name, slug, country, city, region, overview,
            academic_requirements, application_requirements, deadlines,
            testing_requirements, financial_aid, international_info,
            popular_majors, official_website, admissions_url,
            acceptance_rate, graduation_rate, average_tuition,
            need_blind_international, meets_full_need, verified
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            u.name,
            u.slug,
            u.country,
            u.city,
            u.region,
            u.overview,
            u.academicRequirements,
            u.applicationRequirements,
            JSON.stringify(u.deadlines || []),
            u.testingRequirements,
            u.financialAid,
            u.internationalInfo,
            JSON.stringify(u.popularMajors || []),
            u.officialWebsite,
            u.admissionsUrl,
            u.acceptanceRate,
            u.graduationRate,
            u.averageTuition,
            u.needBlindInternational ? 1 : 0,
            u.meetsFullNeed ? 1 : 0,
            u.verified ? 1 : 0,
          ]
        );
      }
      console.log(`🏛️ Seeded ${SEED_UNIVERSITIES.length} universities into MAMP MySQL`);
    }

    // 8. Seed Starter Chat Conversation & Profile for Demo Student
    const [studentRows] = await pool.query('SELECT id, name, country, grade FROM users WHERE email = ?', ['selam.haile@fyndora.org']);
    if (studentRows && studentRows.length > 0) {
      const studentId = studentRows[0].id;

      // Seed chat profile if not exists
      const [existingChatProfile] = await pool.query('SELECT id FROM chat_student_profiles WHERE user_id = ?', [studentId]);
      if (existingChatProfile.length === 0) {
        await pool.query(
          `INSERT INTO chat_student_profiles (
            user_id, session_id, preferred_name, country, grade,
            academic_interests, career_goals, target_universities,
            extracurriculars, weekly_hours, financial_constraints
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            studentId,
            'demo_student_session',
            'Selam Haile',
            'Ethiopia',
            'Grade 11',
            JSON.stringify(['Mathematics', 'Computer Science', 'Economics']),
            JSON.stringify(['Software Engineering', 'Quantitative Economics']),
            JSON.stringify(['Harvard University', 'University of Toronto']),
            'Math Club, peer algebra tutor for Grade 9 students',
            '3–5 hours/week',
            'Need free / full scholarships',
          ]
        );
      }

      // Seed starter conversation if not exists
      const [existingConvs] = await pool.query('SELECT id FROM chat_conversations WHERE user_id = ?', [studentId]);
      if (existingConvs.length === 0) {
        const [convResult] = await pool.query(
          `INSERT INTO chat_conversations (user_id, session_id, title, page_context)
           VALUES (?, ?, ?, ?)`,
          [
            studentId,
            'demo_student_session',
            'Full Scholarships for African Students',
            JSON.stringify({ type: 'Hub', id: 'scholarships', title: 'Scholarships Directory' }),
          ]
        );

        const convId = convResult.insertId;

        // User message
        await pool.query(
          `INSERT INTO chat_messages (conversation_id, sender, content)
           VALUES (?, ?, ?)`,
          [
            convId,
            'user',
            'What full scholarships and financial aid opportunities should I target in Grade 11 from Ethiopia?',
          ]
        );

        // Assistant message
        await pool.query(
          `INSERT INTO chat_messages (conversation_id, sender, content, metadata)
           VALUES (?, ?, ?, ?)`,
          [
            convId,
            'assistant',
            `Hello Selam! In Grade 11, you are in the ideal preparation window to target prestigious fully funded scholarships.

### 🌟 Top Opportunities to Target:
1. **Mastercard Foundation Scholars Program**:
   - Covers 100% of tuition, accommodation, flights, and living stipends for African students at partner global universities (UC Berkeley, Edinburgh, McGill, etc.).
   - *Action in Grade 11*: Focus on leadership, community impact, and maintaining high marks in your core subjects.
2. **Lester B. Pearson International Scholarship (University of Toronto)**:
   - Covers 4 full years of undergraduate study. Requires a high school nomination in early Grade 12.
3. **US Need-Blind / Full-Need Universities**:
   - Harvard, Yale, Princeton, MIT, Amherst, and Dartmouth meet 100% of demonstrated financial need for all admitted international students without student loans.

### 👉 Next Step This Month:
Review our verified [Scholarship Directory](/scholarships) and save 3 deadlines to your [Application Tracker](/applications)!`,
            JSON.stringify({
              suggestedPrompts: [
                'Tell me more about Mastercard Foundation',
                'How do I build strong leadership in Grade 11?',
                'Build my monthly preparation plan',
              ],
              meta: { provider: 'built-in-mentor', status: 'verified' },
            }),
          ]
        );
      }
    }

    console.log('🎉 MAMP Database Seed Completed Successfully!');
  } catch (error) {
    console.error('Error during MAMP seeding:', error.message);
  }
};

// If executed directly
if (process.argv[1] && process.argv[1].endsWith('seedMamp.js')) {
  seedMampDatabase().then(() => {
    process.exit(0);
  });
}
