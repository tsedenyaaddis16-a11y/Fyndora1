import { DEMO_CAREERS, DEMO_SCHOLARSHIPS, DEMO_OPPORTUNITIES } from '../data/mockData';
import { UNIVERSITIES } from '../data/universityData';

const BASE_URL = '/api';

const getToken = () => localStorage.getItem('fyndora_token') || localStorage.getItem('pathfinder_token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // Re-throw so caller or fallback can handle
    throw err;
  }
};

// Local storage storage keys for offline / fallback state
const STORAGE_KEYS = {
  USERS: 'fyndora_users',
  CURRENT_USER: 'fyndora_current_user',
  SAVED_SCHOLARSHIPS: 'fyndora_saved_scholarships',
  APPLICATIONS: 'fyndora_applications',
  CAREERS: 'fyndora_careers',
  SCHOLARSHIPS: 'fyndora_scholarships',
  OPPORTUNITIES: 'fyndora_opportunities',
  COMMENTS: 'fyndora_comments',
  UNIVERSITIES: 'fyndora_universities',
  MENTOR_JOURNEY: 'fyndora_mentor_journey',
  CHAT_CONVERSATIONS: 'fyndora_chat_conversations',
  CHAT_PROFILE: 'fyndora_chat_profile',
};

// Initialize fallback local storage if empty
const initFallbackStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CAREERS)) {
    localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(DEMO_CAREERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS)) {
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(DEMO_SCHOLARSHIPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(DEMO_OPPORTUNITIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS)) {
    // Seed with a default saved scholarship for demonstration
    localStorage.setItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS, JSON.stringify([
      {
        scholarshipId: 'mastercard-foundation-scholars',
        savedAt: new Date().toISOString(),
        status: 'Preparing',
        notes: 'Need to request recommendation letter from Chemistry teacher before mid-October.'
      }
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    // Seed with an example application
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([
      {
        id: 'app-demo-1',
        scholarshipId: 'mastercard-foundation-scholars',
        scholarshipTitle: 'Mastercard Foundation Scholars Program',
        deadline: '2026-11-15',
        status: 'Preparing',
        dateApplied: null,
        notes: 'Preparing community impact essay and transcript translation.',
        checklist: [
          { text: 'High School Transcripts', completed: true },
          { text: 'Recommendation Letters (2)', completed: false },
          { text: 'Personal Statement Essay', completed: true },
          { text: 'Financial Need Documentation', completed: false },
          { text: 'Proof of Nationality / Passport', completed: true }
        ]
      }
    ]));
  }
};

initFallbackStorage();

export const api = {
  // Auth
  async login(email, password) {
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return data;
    } catch (err) {
      // Fallback demo authentication
      console.warn('Backend unavailable, using client-side auth fallback:', err.message);
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        const token = 'demo_token_' + Date.now();
        localStorage.setItem('fyndora_token', token);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(foundUser));
        return { user: foundUser, token };
      }

      // Default demo student if user didn't register yet
      const demoUser = {
        id: 'user-demo-1',
        name: email.split('@')[0] || 'Abebe Bekele',
        email,
        role: email.includes('admin') ? 'admin' : 'student',
        age: 17,
        nationality: 'Ethiopia',
        country: 'Ethiopia',
        grade: 'Grade 11',
        graduationYear: 2027,
        interests: ['Technology', 'Engineering'],
        preferredFields: ['Computer Science', 'Software Engineering'],
        preferredCountries: ['USA', 'Canada', 'Germany'],
        fundingPreference: 'Fully funded',
      };
      const token = 'demo_token_' + Date.now();
      localStorage.setItem('fyndora_token', token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(demoUser));
      return { user: demoUser, token };
    }
  },

  async register(userData) {
    try {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side register fallback:', err.message);
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        role: userData.email.includes('admin') ? 'admin' : 'student',
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      const token = 'demo_token_' + Date.now();
      localStorage.setItem('fyndora_token', token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      return { user: newUser, token };
    }
  },

  async getMe() {
    try {
      return await request('/auth/me');
    } catch (err) {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        return { user: JSON.parse(stored) };
      }
      throw err;
    }
  },

  // Careers
  async getCareers(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      return await request(`/careers?${params.toString()}`);
    } catch (err) {
      let careers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAREERS) || JSON.stringify(DEMO_CAREERS));
      if (filters.category && filters.category !== 'All') {
        careers = careers.filter(c => c.category === filters.category);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        careers = careers.filter(c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.skills.some(s => s.toLowerCase().includes(q))
        );
      }
      return careers;
    }
  },

  async getCareerById(id) {
    try {
      return await request(`/careers/${id}`);
    } catch (err) {
      const careers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAREERS) || JSON.stringify(DEMO_CAREERS));
      const found = careers.find(c => c.id === id || c._id === id);
      if (!found) throw new Error('Career not found');
      return found;
    }
  },

  async createCareer(careerData) {
    try {
      return await request('/careers', {
        method: 'POST',
        body: JSON.stringify(careerData),
      });
    } catch (err) {
      const careers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAREERS) || JSON.stringify(DEMO_CAREERS));
      const newCareer = {
        id: careerData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        ...careerData,
      };
      careers.unshift(newCareer);
      localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(careers));
      return newCareer;
    }
  },

  async updateCareer(id, careerData) {
    try {
      return await request(`/careers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(careerData),
      });
    } catch (err) {
      let careers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAREERS) || JSON.stringify(DEMO_CAREERS));
      careers = careers.map(c => ((c.id === id || c._id === id) ? { ...c, ...careerData } : c));
      localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(careers));
      return { ...careerData, id };
    }
  },

  async deleteCareer(id) {
    try {
      return await request(`/careers/${id}`, { method: 'DELETE' });
    } catch (err) {
      let careers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAREERS) || JSON.stringify(DEMO_CAREERS));
      careers = careers.filter(c => c.id !== id && c._id !== id);
      localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(careers));
      return { success: true };
    }
  },

  // Scholarships
  async getScholarships(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      return await request(`/scholarships?${params.toString()}`);
    } catch (err) {
      let scholarships = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || JSON.stringify(DEMO_SCHOLARSHIPS));
      
      if (filters.search) {
        const q = filters.search.toLowerCase();
        scholarships = scholarships.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q)
        );
      }
      if (filters.country && filters.country !== 'All') {
        scholarships = scholarships.filter(s =>
          s.destination.toLowerCase().includes(filters.country.toLowerCase()) ||
          s.country.toLowerCase().includes(filters.country.toLowerCase())
        );
      }
      if (filters.educationLevel && filters.educationLevel !== 'All') {
        scholarships = scholarships.filter(s =>
          s.educationLevel.toLowerCase().includes(filters.educationLevel.toLowerCase())
        );
      }
      if (filters.fundingType && filters.fundingType !== 'All') {
        scholarships = scholarships.filter(s =>
          s.fundingType.toLowerCase() === filters.fundingType.toLowerCase()
        );
      }
      if (filters.boarding === 'true' || filters.boarding === true) {
        scholarships = scholarships.filter(s => s.boarding === true);
      }
      if (filters.nationality) {
        const nat = filters.nationality.toLowerCase();
        scholarships = scholarships.filter(s =>
          s.eligibleNationalities.some(n => n.toLowerCase().includes(nat) || n.toLowerCase().includes('all'))
        );
      }

      // Filter out passed deadlines by default unless includeExpired is true
      const today = new Date();
      if (!filters.includeExpired) {
        scholarships = scholarships.filter(s => {
          if (!s.deadline) return true;
          return new Date(s.deadline) >= today;
        });
      }

      // Sort
      if (filters.sort === 'deadline') {
        scholarships.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      } else if (filters.sort === 'alphabetical') {
        scholarships.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        // default: recently added / priority
        scholarships.sort((a, b) => new Date(b.lastVerified || 0) - new Date(a.lastVerified || 0));
      }

      return scholarships;
    }
  },

  async getScholarshipById(id) {
    try {
      return await request(`/scholarships/${id}`);
    } catch (err) {
      const scholarships = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || JSON.stringify(DEMO_SCHOLARSHIPS));
      const found = scholarships.find(s => s.id === id || s._id === id);
      if (!found) throw new Error('Scholarship not found');
      return found;
    }
  },

  async createScholarship(scholarshipData) {
    try {
      return await request('/scholarships', {
        method: 'POST',
        body: JSON.stringify(scholarshipData),
      });
    } catch (err) {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || JSON.stringify(DEMO_SCHOLARSHIPS));
      const newScholarship = {
        id: scholarshipData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        ...scholarshipData,
        lastVerified: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      list.unshift(newScholarship);
      localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(list));
      return newScholarship;
    }
  },

  async updateScholarship(id, scholarshipData) {
    try {
      return await request(`/scholarships/${id}`, {
        method: 'PUT',
        body: JSON.stringify(scholarshipData),
      });
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || JSON.stringify(DEMO_SCHOLARSHIPS));
      list = list.map(s => ((s.id === id || s._id === id) ? { ...s, ...scholarshipData, lastVerified: new Date().toISOString().split('T')[0] } : s));
      localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(list));
      return { ...scholarshipData, id };
    }
  },

  async deleteScholarship(id) {
    try {
      return await request(`/scholarships/${id}`, { method: 'DELETE' });
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || JSON.stringify(DEMO_SCHOLARSHIPS));
      list = list.filter(s => s.id !== id && s._id !== id);
      localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(list));
      return { success: true };
    }
  },

  // Opportunities
  async getOpportunities(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      return await request(`/opportunities?${params.toString()}`);
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(DEMO_OPPORTUNITIES));
      if (filters.type && filters.type !== 'All') {
        list = list.filter(o => o.type.toLowerCase() === filters.type.toLowerCase());
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(o =>
          o.title.toLowerCase().includes(q) ||
          o.provider.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
        );
      }
      return list;
    }
  },

  async getOpportunityById(id) {
    try {
      return await request(`/opportunities/${id}`);
    } catch (err) {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(DEMO_OPPORTUNITIES));
      const found = list.find(o => o.id === id || o._id === id);
      if (!found) throw new Error('Opportunity not found');
      return found;
    }
  },

  async createOpportunity(data) {
    try {
      return await request('/opportunities', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (err) {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(DEMO_OPPORTUNITIES));
      const newItem = {
        id: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        ...data,
      };
      list.unshift(newItem);
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(list));
      return newItem;
    }
  },

  async updateOpportunity(id, data) {
    try {
      return await request(`/opportunities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(DEMO_OPPORTUNITIES));
      list = list.map(o => ((o.id === id || o._id === id) ? { ...o, ...data } : o));
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(list));
      return { ...data, id };
    }
  },

  async deleteOpportunity(id) {
    try {
      return await request(`/opportunities/${id}`, { method: 'DELETE' });
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(DEMO_OPPORTUNITIES));
      list = list.filter(o => o.id !== id && o._id !== id);
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(list));
      return { success: true };
    }
  },

  // Saved Scholarships
  async getSaved() {
    try {
      return await request('/users/saved');
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS) || '[]');
      const allScholarships = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || JSON.stringify(DEMO_SCHOLARSHIPS));

      return saved.map(item => {
        const full = allScholarships.find(s => s.id === item.scholarshipId || s._id === item.scholarshipId);
        return {
          ...item,
          scholarship: full || { title: 'Unknown Scholarship', deadline: '2026-12-31' }
        };
      });
    }
  },

  async saveScholarship(scholarshipId, notes = '', status = 'Interested') {
    try {
      return await request(`/users/saved/${scholarshipId}`, {
        method: 'POST',
        body: JSON.stringify({ notes, status }),
      });
    } catch (err) {
      let saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS) || '[]');
      const existingIndex = saved.findIndex(s => s.scholarshipId === scholarshipId);
      if (existingIndex >= 0) {
        saved[existingIndex] = { ...saved[existingIndex], notes, status, savedAt: new Date().toISOString() };
      } else {
        saved.push({ scholarshipId, notes, status, savedAt: new Date().toISOString() });
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS, JSON.stringify(saved));
      return { success: true, saved };
    }
  },

  async removeSaved(scholarshipId) {
    try {
      return await request(`/users/saved/${scholarshipId}`, { method: 'DELETE' });
    } catch (err) {
      let saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS) || '[]');
      saved = saved.filter(s => s.scholarshipId !== scholarshipId);
      localStorage.setItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS, JSON.stringify(saved));
      return { success: true };
    }
  },

  // Applications
  async getApplications() {
    try {
      return await request('/applications');
    } catch (err) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
    }
  },

  async createApplication(appData) {
    try {
      return await request('/applications', {
        method: 'POST',
        body: JSON.stringify(appData),
      });
    } catch (err) {
      const apps = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      const newApp = {
        id: 'app-' + Date.now(),
        ...appData,
        checklist: appData.checklist || [
          { text: 'Transcripts Preparation', completed: false },
          { text: 'Recommendation Letters', completed: false },
          { text: 'Personal Essay / Motivation', completed: false },
          { text: 'Proof of English / Language', completed: false },
          { text: 'Final Portal Submission', completed: false }
        ]
      };
      apps.push(newApp);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      return newApp;
    }
  },

  async updateApplication(id, appData) {
    try {
      return await request(`/applications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(appData),
      });
    } catch (err) {
      let apps = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      apps = apps.map(a => (a.id === id ? { ...a, ...appData } : a));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      return { ...appData, id };
    }
  },

  async deleteApplication(id) {
    try {
      return await request(`/applications/${id}`, { method: 'DELETE' });
    } catch (err) {
      let apps = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      apps = apps.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      return { success: true };
    }
  },

  // Scholarship Profile Matcher
  async matchScholarships(profile) {
    try {
      const params = new URLSearchParams(profile);
      return await request(`/scholarships/matches?${params.toString()}`);
    } catch (err) {
      // Local matching algorithm
      const scholarships = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || JSON.stringify(DEMO_SCHOLARSHIPS));
      
      const results = scholarships.map(sch => {
        const reasons = [];
        let score = 0;
        let unconfirmed = false;

        // Check age
        if (profile.age && sch.minimumAge && sch.maximumAge) {
          const ageNum = parseInt(profile.age, 10);
          if (ageNum >= sch.minimumAge && ageNum <= sch.maximumAge) {
            reasons.push(`You are within the required age range (${sch.minimumAge}–${sch.maximumAge} years old)`);
            score += 25;
          } else {
            score -= 30; // age disqualifier
          }
        } else if (!profile.age) {
          unconfirmed = true;
        }

        // Check nationality
        if (profile.nationality && sch.eligibleNationalities) {
          const userNat = profile.nationality.toLowerCase();
          const matchesNat = sch.eligibleNationalities.some(nat =>
            nat.toLowerCase().includes(userNat) ||
            nat.toLowerCase().includes('all') ||
            nat.toLowerCase().includes('sub-saharan') ||
            nat.toLowerCase().includes('african')
          );
          if (matchesNat) {
            reasons.push(`${profile.nationality} is an eligible nationality for this award`);
            score += 30;
          }
        } else if (!profile.nationality) {
          unconfirmed = true;
        }

        // Check grade / education level
        if (profile.grade && sch.eligibleGrades) {
          const gradeMatch = sch.eligibleGrades.some(g =>
            g.toLowerCase().includes(profile.grade.toLowerCase()) ||
            g.toLowerCase().includes('high school') ||
            g.toLowerCase().includes('applicant')
          );
          if (gradeMatch) {
            reasons.push(`You are currently in ${profile.grade}, which aligns with accepted grades`);
            score += 20;
          }
        }

        // Check preferred study destination
        if (profile.preferredDestination && sch.destination) {
          if (sch.destination.toLowerCase().includes(profile.preferredDestination.toLowerCase())) {
            reasons.push(`Destination ${profile.preferredDestination} matches your preferred study country`);
            score += 15;
          }
        }

        // Check field of interest
        if (profile.field && sch.fields) {
          const fieldMatch = sch.fields.some(f =>
            f.toLowerCase() === 'any' ||
            f.toLowerCase().includes(profile.field.toLowerCase())
          );
          if (fieldMatch) {
            reasons.push(`Offers funding for studies in ${profile.field}`);
            score += 15;
          }
        }

        // Check funding requirement
        if (profile.fundingPreference === 'Fully funded' && sch.fundingType === 'Fully funded') {
          reasons.push(`Meets your criteria for 100% full funding`);
          score += 10;
        }

        // Boarding requirement
        if (profile.boardingRequired && sch.boarding) {
          reasons.push(`Provides on-campus boarding & accommodation support`);
          score += 5;
        }

        return {
          scholarship: sch,
          score,
          reasons,
          unconfirmed: reasons.length === 0 || unconfirmed
        };
      });

      // Filter and sort by score
      return results
        .filter(r => r.score > 20)
        .sort((a, b) => b.score - a.score);
    }
  },

  // -------------------------------------------------------------
  // COMMENTS & COMMUNITY DISCUSSIONS
  // -------------------------------------------------------------
  async getComments(targetType, targetId, sort = 'newest') {
    try {
      const params = new URLSearchParams();
      if (targetType) params.append('targetType', targetType);
      if (targetId) params.append('targetId', targetId);
      if (sort) params.append('sort', sort);

      const data = await request(`/comments?${params.toString()}`);
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side comments fallback:', err.message);
      let stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
      
      let filtered = stored;
      if (targetType && targetType !== 'all') {
        filtered = filtered.filter(c => c.targetType === targetType);
      }
      if (targetId && targetId !== 'all') {
        filtered = filtered.filter(c => c.targetId === targetId || String(c.targetId) === String(targetId));
      }

      if (sort === 'likes') {
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // Re-nest replies
      const commentMap = new Map();
      filtered.forEach(c => commentMap.set(c.id, { ...c, replies: [] }));

      const topLevel = [];
      filtered.forEach(c => {
        const mapped = commentMap.get(c.id);
        if (c.parentId && commentMap.has(c.parentId)) {
          commentMap.get(c.parentId).replies.push(mapped);
        } else if (!c.parentId) {
          topLevel.push(mapped);
        }
      });

      return {
        success: true,
        count: filtered.length,
        comments: topLevel,
        allCommentsFlat: filtered,
      };
    }
  },

  async createComment(commentData) {
    try {
      const data = await request('/comments', {
        method: 'POST',
        body: JSON.stringify(commentData),
      });
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side create comment fallback:', err.message);
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
      const newComment = {
        id: 'c_' + Date.now(),
        targetType: commentData.targetType,
        targetId: commentData.targetId,
        targetTitle: commentData.targetTitle || '',
        userId: commentData.userId || 'demo-user',
        userName: commentData.userName || 'Student Learner',
        userEmail: commentData.userEmail || 'student@fyndora.org',
        userRole: commentData.userRole || 'student',
        userCountry: commentData.userCountry || 'Ethiopia',
        userGrade: commentData.userGrade || 'Grade 11',
        parentId: commentData.parentId || null,
        content: commentData.content,
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
        replies: [],
      };

      stored.unshift(newComment);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(stored));
      return { success: true, comment: newComment };
    }
  },

  async likeComment(commentId, userEmail) {
    try {
      const data = await request(`/comments/${commentId}/like`, {
        method: 'POST',
        body: JSON.stringify({ userEmail }),
      });
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side like comment fallback:', err.message);
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
      const comment = stored.find(c => String(c.id) === String(commentId));
      if (comment) {
        comment.likedBy = comment.likedBy || [];
        const u = userEmail || 'guest';
        if (comment.likedBy.includes(u)) {
          comment.likedBy = comment.likedBy.filter(x => x !== u);
          comment.likes = Math.max(0, (comment.likes || 1) - 1);
        } else {
          comment.likedBy.push(u);
          comment.likes = (comment.likes || 0) + 1;
        }
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(stored));
        return { success: true, likes: comment.likes, hasLiked: comment.likedBy.includes(u) };
      }
      return { success: false };
    }
  },

  async deleteComment(commentId) {
    try {
      const data = await request(`/comments/${commentId}`, {
        method: 'DELETE',
      });
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side delete comment fallback:', err.message);
      let stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
      stored = stored.filter(c => String(c.id) !== String(commentId) && String(c.parentId) !== String(commentId));
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(stored));
      return { success: true, id: commentId };
    }
  },

  // -------------------------------------------------------------
  // UNIVERSITIES & UNIVERSITY MENTOR JOURNEY
  // -------------------------------------------------------------
  async getUniversities(params = {}) {
    try {
      const q = new URLSearchParams();
      if (params.country) q.append('country', params.country);
      if (params.region) q.append('region', params.region);
      if (params.search) q.append('search', params.search);

      const data = await request(`/universities?${q.toString()}`);
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side universities fallback:', err.message);
      let list = UNIVERSITIES;
      if (params.country && params.country !== 'All') {
        list = list.filter(u => u.country === params.country);
      }
      if (params.region && params.region !== 'All') {
        list = list.filter(u => u.region === params.region);
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(u =>
          u.name.toLowerCase().includes(s) ||
          u.overview.toLowerCase().includes(s) ||
          (u.popularMajors && u.popularMajors.some(m => m.toLowerCase().includes(s)))
        );
      }
      return { success: true, count: list.length, universities: list };
    }
  },

  async getUniversity(slugOrId) {
    try {
      const data = await request(`/universities/${slugOrId}`);
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side university fallback:', err.message);
      const found = UNIVERSITIES.find(u => u.slug === slugOrId || u.id === slugOrId);
      if (found) return { success: true, university: found };
      throw err;
    }
  },

  async getMentorJourney(email = 'selam.haile@fyndora.org', universityId = null) {
    try {
      const q = new URLSearchParams();
      if (email) q.append('email', email);
      if (universityId) q.append('universityId', universityId);

      const data = await request(`/mentor-journey?${q.toString()}`);
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side mentor journey fallback:', err.message);
      const stored = localStorage.getItem(STORAGE_KEYS.MENTOR_JOURNEY);
      if (stored) {
        return { success: true, journey: JSON.parse(stored) };
      }
      return { success: true, journey: null };
    }
  },

  async saveMentorJourney(journeyData) {
    try {
      const data = await request('/mentor-journey', {
        method: 'POST',
        body: JSON.stringify(journeyData),
      });
      // Mirror in localStorage
      localStorage.setItem(STORAGE_KEYS.MENTOR_JOURNEY, JSON.stringify(journeyData));
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side save mentor journey fallback:', err.message);
      localStorage.setItem(STORAGE_KEYS.MENTOR_JOURNEY, JSON.stringify(journeyData));
      return { success: true, message: 'Saved to local storage', id: 'local_' + Date.now() };
    }
  },

  async sendMentorChat(message, context = {}) {
    try {
      const data = await request('/mentor-journey/chat', {
        method: 'POST',
        body: JSON.stringify({ message, context }),
      });
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using client-side mentor chat fallback:', err.message);
      const u = message.toLowerCase();
      let reply = '';
      const uniName = context.universityName || 'your target university';
      const grade = context.currentGrade || 'your grade';
      const hours = context.weeklyHours || '3-5 hours weekly';
      const passionProject = context.passionProject;

      if (u.includes('focus on this month') || u.includes('this month')) {
        reply = `For this month in ${grade}, prioritize quality over quantity:\n\n1. **Academic Baseline**: Keep your grades strong in your core subjects—this remains the most critical foundation for ${uniName}.\n2. **First Milestone of Your Project**: Spend 2–3 hours each week focusing solely on Step 1 of your project${passionProject?.title ? ` ("${passionProject.title}")` : ''}: draft your initial outline, survey questions, or problem breakdown.\n3. **One Intellectual Deep Dive**: Read 1 book chapter, listen to 1 academic podcast, or audit 1 free online lecture in ${context.chosenDirection || 'your focus area'}.\n4. **Log your progress**: Mark completed tasks in your Monthly Action Plan to see your momentum grow!`;
      } else if (u.includes('what should i do next') || u.includes('what to do next') || u.includes('next step')) {
        reply = `Based on your current progress in ${grade} and your target at **${uniName}**, here is your exact next step:\n\n👉 **Immediate Action (Next 48 Hours)**:\n${passionProject?.firstSteps && passionProject.firstSteps.length > 0 ? `Focus on: **"${passionProject.firstSteps[0]}"**.` : 'Draft a short 1-page concept note outlining the problem in your community or school you want to explore.'}\n\nDedicate just one focused 45-minute block this week. Once you start, record what you did in your Journey Evidence log!`;
      } else if (u.includes('3 hours') || u.includes('three hours') || u.includes('limited time') || u.includes('hours per week')) {
        reply = `Having 3 hours per week is plenty of time if you protect it from distraction! Here is how to allocate your 180 minutes each week:\n\n⏱️ **Block 1 (90 mins - Midweek or Weekend)**: Deep work on your passion project${passionProject?.title ? ` (${passionProject.title})` : ''} or running your peer study sessions.\n⏱️ **Block 2 (60 mins - Sunday Afternoon)**: Self-directed reading, watching an MIT OpenCourseWare lecture, or practicing high-level problem sets.\n⏱️ **Block 3 (30 mins - End of Week)**: Review what you learned, write a quick reflection in your Journey log, and update your Action Plan.\n\nConsistency beats intensity every single time. 3 focused hours per week equals over 150 hours of authentic intellectual growth in a school year!`;
      } else if (u.includes("don't like") || u.includes('dont like') || u.includes('dislike') || u.includes('anymore') || u.includes('what else could i try')) {
        reply = `Discovering that you *do not* enjoy your current project is not a failure—it is valuable self-knowledge!\n\nAdmissions officers and university professors want students who are self-aware, not people who blindly stick to things they hate.\n\nHere is what you can do right now:\n1. **Document the insight**: Note down *why* you disliked it (Was it too abstract? Too solitary? Lacking real-world impact?).\n2. **Switch project tracks without penalty**: In your Journey Dashboard, review the other Passion Project Ideas generated for you, such as a **Community Public Data Audit**, a **Peer Problem-Solving Clinic**, or a **Local Language STEM Glossary**.\n3. **Pivot seamlessly**: Which other project catches your eye? Let me know and we will adapt your roadmap to it!`;
      } else if (u.includes('economics') && u.includes('computer science') || u.includes('more interested in economics') || u.includes('pivot') || u.includes('update my journey')) {
        reply = `Congratulations on this discovery! High school is meant for pivoting when new intellectual sparks appear.\n\nHere is how we adapt your journey from pure Computer Science to **Economics & Quantitative Systems**:\n1. **Bridge the two fields**: Quantitative economics, computational financial literacy, and data-driven public policy are among the most respected disciplines at ${uniName}.\n2. **Updated Project Focus**: Instead of writing software for software's sake, you can conduct a **High School Student Financial Literacy Survey** or build a **Community Micro-Economics Data Dashboard**.\n3. **Course Rigor**: Continue excelling in Mathematics (calculus & statistics are the backbone of modern economics).\n4. **Action**: Your dashboard recommendations have been updated to emphasize quantitative economics, real-world community survey research, and free resources from the Wharton Global High School program!`;
      } else if (u.includes('free') || u.includes('money') || u.includes('cost')) {
        reply = `You never need to spend money to build a meaningful high school profile. In fact, admissions reviewers and professors at ${uniName} respect organic, self-driven initiatives far more than paid pay-to-play summer programs.\n\nResearching local problems, self-learning open-source tools, or mentoring younger students are 100% free and deeply respected.`;
      } else {
        reply = `As your mentor for ${uniName}, I'm here to support your authentic journey in ${grade}.\n\nFocus on what makes you curious and take one small tangible step this week in ${context.chosenDirection || 'your chosen project'}. Consistency with ${hours} will yield meaningful, lasting results.`;
      }
      return { success: true, reply, timestamp: new Date().toISOString() };
    }
  },

  // -------------------------------------------------------------
  // AI STUDENT MENTOR CHATBOT API
  // -------------------------------------------------------------
  async getChatStatus() {
    try {
      return await request('/chat/status');
    } catch (err) {
      return {
        success: true,
        aiConfigured: false,
        provider: 'built-in-mentor',
        model: 'Fyndora Intelligent Mentor v2.0 (Offline Mode)',
        message: 'Built-in intelligent mentorship engine active',
      };
    }
  },

  async getChatConversations(sessionId) {
    try {
      const q = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
      return await request(`/chat/conversations${q}`);
    } catch (err) {
      console.warn('Backend unavailable, using client-side chat conversations fallback:', err.message);
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_CONVERSATIONS) || '[]');
      return { success: true, conversations: list };
    }
  },

  async createChatConversation(title = 'New Conversation', pageContext = null, sessionId) {
    try {
      return await request('/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ title, pageContext, sessionId }),
      });
    } catch (err) {
      const newConv = {
        id: 'local_conv_' + Date.now(),
        title,
        pageContext,
        createdAt: new Date().toISOString(),
      };
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_CONVERSATIONS) || '[]');
      localStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify([newConv, ...list]));
      return { success: true, conversation: newConv };
    }
  },

  async getChatConversationDetails(conversationId, sessionId) {
    try {
      const q = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
      return await request(`/chat/conversations/${conversationId}${q}`);
    } catch (err) {
      console.warn('Backend unavailable, using client-side conversation detail fallback:', err.message);
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_CONVERSATIONS) || '[]');
      const found = list.find((c) => c.id === conversationId) || {
        id: conversationId,
        title: 'New Conversation',
        messages: [],
      };
      return { success: true, conversation: found };
    }
  },

  async deleteChatConversation(conversationId, sessionId) {
    try {
      const q = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
      return await request(`/chat/conversations/${conversationId}${q}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_CONVERSATIONS) || '[]');
      const filtered = list.filter((c) => c.id !== conversationId);
      localStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify(filtered));
      return { success: true, message: 'Deleted locally' };
    }
  },

  async clearAllChatConversations(sessionId) {
    try {
      const q = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
      return await request(`/chat/conversations${q}`, {
        method: 'DELETE',
      });
    } catch (err) {
      localStorage.removeItem(STORAGE_KEYS.CHAT_CONVERSATIONS);
      return { success: true, message: 'Cleared locally' };
    }
  },

  async sendChatMessage({ conversationId, message, pageContext, sessionId, studentProfile }) {
    try {
      return await request('/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          message,
          pageContext,
          sessionId,
          studentProfile,
        }),
      });
    } catch (err) {
      console.warn('Backend unavailable, using client-side AI chat fallback:', err.message);
      // Fallback response generator
      const mockResult = await api.sendMentorChat(message, {
        currentGrade: studentProfile?.grade,
        country: studentProfile?.country,
        weeklyHours: studentProfile?.weeklyHours,
        chosenDirection: studentProfile?.careerGoals?.[0],
      });

      return {
        success: true,
        conversationId: conversationId || 'local_conv_' + Date.now(),
        message: {
          id: 'local_msg_' + Date.now(),
          sender: 'assistant',
          content: mockResult.reply,
          metadata: {
            suggestedPrompts: [
              'What should I focus on next?',
              'How can I prepare for scholarships?',
              'Build a personalized roadmap for my grade',
            ],
            meta: { provider: 'client-offline-fallback', status: 'offline' },
          },
          createdAt: new Date().toISOString(),
        },
        suggestedPrompts: [
          'What should I focus on next?',
          'How can I prepare for scholarships?',
          'Build a personalized roadmap for my grade',
        ],
        meta: { provider: 'client-offline-fallback', status: 'offline' },
      };
    }
  },

  async getChatStudentProfile(sessionId) {
    try {
      const q = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
      return await request(`/chat/profile${q}`);
    } catch (err) {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_PROFILE);
      return {
        success: true,
        profile: saved ? JSON.parse(saved) : null,
      };
    }
  },

  async saveChatStudentProfile(profileData) {
    try {
      const res = await request('/chat/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      localStorage.setItem(STORAGE_KEYS.CHAT_PROFILE, JSON.stringify(profileData));
      return res;
    } catch (err) {
      localStorage.setItem(STORAGE_KEYS.CHAT_PROFILE, JSON.stringify(profileData));
      return { success: true, message: 'Saved to local profile' };
    }
  },
};
