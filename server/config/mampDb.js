import mysql from 'mysql2/promise';

let pool = null;

export const getMampPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'pathfinder',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

export const initMampDatabase = async () => {
  try {
    // 1. Initial connection without database to ensure database exists
    const rootConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
    });

    const dbName = process.env.DB_NAME || 'pathfinder';
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConnection.end();

    // 2. Connect to pool with database selected
    const p = getMampPool();

    // Users table
    await p.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'admin') DEFAULT 'student',
        age INT DEFAULT 17,
        nationality VARCHAR(100) DEFAULT 'Ethiopia',
        country VARCHAR(100) DEFAULT 'Ethiopia',
        grade VARCHAR(50) DEFAULT 'Grade 11',
        graduation_year INT DEFAULT 2027,
        interests JSON,
        preferred_fields JSON,
        preferred_countries JSON,
        funding_preference VARCHAR(100) DEFAULT 'Fully funded',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Careers table
    await p.query(`
      CREATE TABLE IF NOT EXISTS careers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        responsibilities JSON,
        skills JSON,
        high_school_subjects JSON,
        university_subjects JSON,
        related_careers JSON,
        workplaces JSON,
        resources JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Scholarships table
    await p.query(`
      CREATE TABLE IF NOT EXISTS scholarships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        country VARCHAR(100) DEFAULT 'International',
        destination VARCHAR(255) NOT NULL,
        education_level VARCHAR(50) DEFAULT 'Undergraduate',
        eligible_nationalities JSON,
        minimum_age INT DEFAULT NULL,
        maximum_age INT DEFAULT NULL,
        eligible_grades JSON,
        fields JSON,
        funding_type VARCHAR(100) DEFAULT 'Fully funded',
        coverage JSON,
        boarding BOOLEAN DEFAULT 0,
        language_requirements TEXT,
        academic_requirements TEXT,
        deadline DATE DEFAULT NULL,
        application_url TEXT,
        official_website TEXT,
        verified BOOLEAN DEFAULT 1,
        last_verified VARCHAR(50) DEFAULT '2026-03-01',
        status VARCHAR(50) DEFAULT 'active',
        is_demo BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Opportunities table
    await p.query(`
      CREATE TABLE IF NOT EXISTS opportunities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        country VARCHAR(100) DEFAULT 'Global',
        eligibility TEXT,
        deadline DATE DEFAULT NULL,
        funding VARCHAR(255),
        application_url TEXT,
        official_website TEXT,
        verified BOOLEAN DEFAULT 1,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Saved Scholarships table
    await p.query(`
      CREATE TABLE IF NOT EXISTS saved_scholarships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        scholarship_id INT NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'Interested',
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Applications table
    await p.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        scholarship_id INT DEFAULT NULL,
        scholarship_title VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Preparing',
        deadline DATE DEFAULT NULL,
        date_applied DATE DEFAULT NULL,
        notes TEXT,
        checklist JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Comments table
    await p.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        target_type ENUM('career', 'scholarship', 'opportunity', 'general') NOT NULL,
        target_id VARCHAR(100) NOT NULL,
        target_title VARCHAR(255) DEFAULT '',
        user_id INT DEFAULT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        user_role VARCHAR(50) DEFAULT 'student',
        user_country VARCHAR(100) DEFAULT 'Ethiopia',
        user_grade VARCHAR(50) DEFAULT 'Grade 11',
        parent_id INT DEFAULT NULL,
        content TEXT NOT NULL,
        likes INT DEFAULT 0,
        liked_by JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_target (target_type, target_id),
        INDEX idx_parent (parent_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Universities table
    await p.query(`
      CREATE TABLE IF NOT EXISTS universities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        country VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        overview TEXT NOT NULL,
        academic_requirements TEXT,
        application_requirements TEXT,
        deadlines JSON,
        testing_requirements TEXT,
        financial_aid TEXT,
        international_info TEXT,
        popular_majors JSON,
        official_website VARCHAR(255),
        admissions_url VARCHAR(255),
        acceptance_rate VARCHAR(50),
        graduation_rate VARCHAR(50),
        average_tuition VARCHAR(100),
        need_blind_international BOOLEAN DEFAULT FALSE,
        meets_full_need BOOLEAN DEFAULT TRUE,
        verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Mentor Journeys table
    await p.query(`
      CREATE TABLE IF NOT EXISTS mentor_journeys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        user_email VARCHAR(255) NOT NULL,
        university_id VARCHAR(100) DEFAULT NULL,
        university_name VARCHAR(255) DEFAULT NULL,
        student_background JSON,
        interests JSON,
        skills JSON,
        experiences JSON,
        constraints JSON,
        possible_directions JSON,
        chosen_direction VARCHAR(255) DEFAULT NULL,
        chosen_direction_details JSON,
        extracurricular_strategy JSON,
        passion_project JSON,
        roadmap JSON,
        action_plan JSON,
        matched_opportunities JSON,
        evidence_portfolio JSON,
        reflections JSON,
        chat_history JSON,
        progress_stats JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_email (user_email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Chat Conversations table
    await p.query(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        session_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
        page_context JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_chat_user (user_id),
        INDEX idx_chat_session (session_id),
        INDEX idx_chat_updated (updated_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Chat Messages table
    await p.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        sender ENUM('user', 'assistant', 'system') NOT NULL,
        content MEDIUMTEXT NOT NULL,
        metadata JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_msg_conv (conversation_id),
        INDEX idx_msg_created (created_at),
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Chat Student Profiles table (Personalization)
    await p.query(`
      CREATE TABLE IF NOT EXISTS chat_student_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL UNIQUE,
        session_id VARCHAR(100) DEFAULT NULL,
        preferred_name VARCHAR(100) DEFAULT NULL,
        country VARCHAR(100) DEFAULT 'Ethiopia',
        grade VARCHAR(50) DEFAULT 'Grade 11',
        academic_interests JSON DEFAULT NULL,
        career_goals JSON DEFAULT NULL,
        target_universities JSON DEFAULT NULL,
        extracurriculars TEXT DEFAULT NULL,
        weekly_hours VARCHAR(50) DEFAULT '3–5 hours/week',
        financial_constraints VARCHAR(100) DEFAULT 'Need free / full scholarships',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_profile_user (user_id),
        INDEX idx_profile_session (session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅ MAMP MySQL Database & Tables initialized successfully.');
    return true;
  } catch (error) {
    console.error('❌ MAMP MySQL Connection Error:', error.message);
    return false;
  }
};
