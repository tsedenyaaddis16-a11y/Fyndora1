import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { DeadlineBadge } from '../components/DeadlineBadge';
import {
  ShieldCheck,
  Award,
  Briefcase,
  Sparkles,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Globe,
  Clock,
  Search,
  Filter
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isAdmin, toggleAdminRole } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('scholarships'); // 'scholarships', 'careers', 'opportunities', 'users', 'expired'
  const [scholarships, setScholarships] = useState([]);
  const [careers, setCareers] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'scholarship', 'career', 'opportunity'
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [scholarshipForm, setScholarshipForm] = useState({
    title: '',
    provider: '',
    description: '',
    country: '',
    destination: '',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: 'Tuition, Accommodation, Meals, Travel',
    deadline: '',
    applicationUrl: '',
    officialWebsite: '',
    minimumAge: 16,
    maximumAge: 25,
    eligibleNationalities: 'Ethiopia, African Countries, International',
  });

  const [careerForm, setCareerForm] = useState({
    title: '',
    category: 'Technology',
    description: '',
    responsibilities: '',
    skills: '',
    highSchoolSubjects: '',
    universitySubjects: '',
    workplaces: '',
  });

  const [opportunityForm, setOpportunityForm] = useState({
    title: '',
    provider: '',
    type: 'Summer Program',
    description: '',
    country: '',
    eligibility: '',
    deadline: '',
    funding: '',
    applicationUrl: '',
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [schs, cars, opps] = await Promise.all([
        api.getScholarships({ includeExpired: true }),
        api.getCareers(),
        api.getOpportunities(),
      ]);
      setScholarships(schs);
      setCareers(cars);
      setOpportunities(opps);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Modal Handlers
  const handleOpenCreate = (type) => {
    setModalType(type);
    setEditingItem(null);
    if (type === 'scholarship') {
      setScholarshipForm({
        title: '',
        provider: '',
        description: '',
        country: 'International',
        destination: 'USA, Canada, Europe',
        educationLevel: 'Undergraduate',
        fundingType: 'Fully funded',
        coverage: 'Tuition, Accommodation, Meals, Travel',
        deadline: '2026-12-01',
        applicationUrl: 'https://example.org/apply',
        officialWebsite: 'https://example.org',
        minimumAge: 16,
        maximumAge: 25,
        eligibleNationalities: 'Ethiopia, African Countries, International',
      });
    } else if (type === 'career') {
      setCareerForm({
        title: '',
        category: 'Technology',
        description: '',
        responsibilities: 'Write code, design algorithms, collaborate with team',
        skills: 'Problem Solving, Teamwork, Math, Critical Thinking',
        highSchoolSubjects: 'Mathematics, Physics, Computer Science',
        universitySubjects: 'Computer Science, Software Engineering',
        workplaces: 'Tech Companies, Startups, Research Labs',
      });
    } else if (type === 'opportunity') {
      setOpportunityForm({
        title: '',
        provider: '',
        type: 'Summer Program',
        description: '',
        country: 'Global',
        eligibility: 'High school students aged 15-18',
        deadline: '2026-11-01',
        funding: 'Fully funded',
        applicationUrl: 'https://example.org',
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'scholarship') {
      setScholarshipForm({
        title: item.title,
        provider: item.provider,
        description: item.description,
        country: item.country || '',
        destination: item.destination || '',
        educationLevel: item.educationLevel || 'Undergraduate',
        fundingType: item.fundingType || 'Fully funded',
        coverage: Array.isArray(item.coverage) ? item.coverage.join(', ') : (item.coverage || ''),
        deadline: item.deadline || '',
        applicationUrl: item.applicationUrl || '',
        officialWebsite: item.officialWebsite || '',
        minimumAge: item.minimumAge || 16,
        maximumAge: item.maximumAge || 25,
        eligibleNationalities: Array.isArray(item.eligibleNationalities) ? item.eligibleNationalities.join(', ') : (item.eligibleNationalities || ''),
      });
    } else if (type === 'career') {
      setCareerForm({
        title: item.title,
        category: item.category,
        description: item.description,
        responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities.join('; ') : (item.responsibilities || ''),
        skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || ''),
        highSchoolSubjects: Array.isArray(item.highSchoolSubjects) ? item.highSchoolSubjects.join(', ') : (item.highSchoolSubjects || ''),
        universitySubjects: Array.isArray(item.universitySubjects) ? item.universitySubjects.join(', ') : (item.universitySubjects || ''),
        workplaces: Array.isArray(item.workplaces) ? item.workplaces.join(', ') : (item.workplaces || ''),
      });
    } else if (type === 'opportunity') {
      setOpportunityForm({
        title: item.title,
        provider: item.provider,
        type: item.type,
        description: item.description,
        country: item.country || '',
        eligibility: item.eligibility || '',
        deadline: item.deadline || '',
        funding: item.funding || '',
        applicationUrl: item.applicationUrl || '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'scholarship') {
        const payload = {
          ...scholarshipForm,
          coverage: scholarshipForm.coverage.split(',').map(s => s.trim()),
          eligibleNationalities: scholarshipForm.eligibleNationalities.split(',').map(s => s.trim()),
          minimumAge: parseInt(scholarshipForm.minimumAge, 10),
          maximumAge: parseInt(scholarshipForm.maximumAge, 10),
        };
        if (editingItem) {
          await api.updateScholarship(editingItem.id || editingItem._id, payload);
          addToast('Scholarship updated successfully!', 'success');
        } else {
          await api.createScholarship(payload);
          addToast('New scholarship created!', 'success');
        }
      } else if (modalType === 'career') {
        const payload = {
          ...careerForm,
          responsibilities: careerForm.responsibilities.split(';').map(s => s.trim()),
          skills: careerForm.skills.split(',').map(s => s.trim()),
          highSchoolSubjects: careerForm.highSchoolSubjects.split(',').map(s => s.trim()),
          universitySubjects: careerForm.universitySubjects.split(',').map(s => s.trim()),
          workplaces: careerForm.workplaces.split(',').map(s => s.trim()),
        };
        if (editingItem) {
          await api.updateCareer(editingItem.id || editingItem._id, payload);
          addToast('Career pathway updated!', 'success');
        } else {
          await api.createCareer(payload);
          addToast('New career pathway added!', 'success');
        }
      } else if (modalType === 'opportunity') {
        if (editingItem) {
          await api.updateOpportunity(editingItem.id || editingItem._id, opportunityForm);
          addToast('Opportunity updated!', 'success');
        } else {
          await api.createOpportunity(opportunityForm);
          addToast('New opportunity added!', 'success');
        }
      }
      setIsModalOpen(false);
      loadAllData();
    } catch (err) {
      addToast('Error saving record', 'error');
    }
  };

  const handleDelete = async (type, item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      const id = item.id || item._id;
      if (type === 'scholarship') await api.deleteScholarship(id);
      if (type === 'career') await api.deleteCareer(id);
      if (type === 'opportunity') await api.deleteOpportunity(id);
      addToast('Record deleted successfully', 'info');
      loadAllData();
    } catch (err) {
      addToast('Failed to delete item', 'error');
    }
  };

  // Mock users list for demonstration
  const mockUsers = [
    { id: '1', name: 'Selam Haile', email: 'selam@fyndora.org', role: 'student', grade: 'Grade 11', country: 'Ethiopia', joined: '2026-08-12' },
    { id: '2', name: 'Kofi Mensah', email: 'kofi@example.com', role: 'student', grade: 'Grade 12', country: 'Ghana', joined: '2026-08-20' },
    { id: '3', name: 'Dr. Almaz T.', email: 'admin@fyndora.org', role: 'admin', grade: 'Staff', country: 'Ethiopia', joined: '2026-01-01' },
    { id: '4', name: 'David Mwangi', email: 'david@example.com', role: 'student', grade: 'Grade 10', country: 'Kenya', joined: '2026-09-02' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Protected Header with Role Switcher helper */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Fyndora Administration Console
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Admin Management Panel</h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Manage official scholarship listings, career pathway templates, global opportunities, and manage user accounts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative z-10">
          <button
            onClick={toggleAdminRole}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Current Mode: {isAdmin ? 'Admin (Active)' : 'Student'} (Click to toggle)
          </button>
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>You are currently in student mode. Click "Current Mode" above to switch to Admin mode for testing CRUD actions.</span>
          </div>
          <button
            onClick={toggleAdminRole}
            className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-lg shrink-0"
          >
            Enable Admin Mode
          </button>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('scholarships')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'scholarships'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Scholarships ({scholarships.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('careers')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'careers'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Careers ({careers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'opportunities'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Opportunities ({opportunities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({mockUsers.length})</span>
        </button>
      </div>

      {/* TAB 1: SCHOLARSHIPS MANAGEMENT */}
      {activeTab === 'scholarships' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Manage Scholarships</h2>
            <button
              onClick={() => handleOpenCreate('scholarship')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Scholarship</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Scholarship</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Funding</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scholarships.map((sch) => (
                    <tr key={sch.id || sch._id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {sch.title}
                        <div className="text-[11px] text-slate-400 font-normal">{sch.provider}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{sch.destination || sch.country}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium text-xs">
                          {sch.fundingType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <DeadlineBadge deadline={sch.deadline} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit('scholarship', sch)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('scholarship', sch)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAREERS MANAGEMENT */}
      {activeTab === 'careers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Manage Career Pathways</h2>
            <button
              onClick={() => handleOpenCreate('career')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Career</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Career Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">University Majors</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {careers.map((car) => (
                    <tr key={car.id || car._id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {car.title}
                        <div className="text-[11px] text-slate-400 font-normal truncate max-w-sm">{car.description}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium text-xs">
                          {car.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {car.universitySubjects ? car.universitySubjects.slice(0, 2).join(', ') : 'Various'}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit('career', car)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('career', car)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OPPORTUNITIES MANAGEMENT */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Manage Enrichment Programs & Competitions</h2>
            <button
              onClick={() => handleOpenCreate('opportunity')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Opportunity</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {opportunities.map((opp) => (
                    <tr key={opp.id || opp._id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {opp.title}
                        <div className="text-[11px] text-slate-400 font-normal">{opp.provider}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{opp.type}</td>
                      <td className="py-3.5 px-4 text-slate-600">{opp.country}</td>
                      <td className="py-3.5 px-4">
                        <DeadlineBadge deadline={opp.deadline} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit('opportunity', opp)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('opportunity', opp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Registered Students & Accounts</h2>
            <span className="text-xs text-slate-500">{mockUsers.length} total accounts</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Academic Grade</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{u.grade}</td>
                      <td className="py-3.5 px-4 text-slate-600">{u.country}</td>
                      <td className="py-3.5 px-4 text-slate-500">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CRUD MODAL FOR SCHOLARSHIPS / CAREERS / OPPORTUNITIES */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem
            ? `Edit ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`
            : `Add New ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* SCHOLARSHIP FORM */}
          {modalType === 'scholarship' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scholarship Title *</label>
                <input
                  type="text"
                  required
                  value={scholarshipForm.title}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, title: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provider *</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.provider}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, provider: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination Country</label>
                  <input
                    type="text"
                    value={scholarshipForm.destination}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, destination: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Education Level</label>
                  <select
                    value={scholarshipForm.educationLevel}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, educationLevel: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  >
                    <option value="High school">High school</option>
                    <option value="Undergraduate">Undergraduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Funding Type</label>
                  <select
                    value={scholarshipForm.fundingType}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, fundingType: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  >
                    <option value="Fully funded">Fully funded</option>
                    <option value="Partially funded">Partially funded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Coverage (comma separated)</label>
                <input
                  type="text"
                  value={scholarshipForm.coverage}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, coverage: e.target.value })}
                  placeholder="Tuition, Accommodation, Meals, Travel, Books, Visa"
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={scholarshipForm.deadline}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, deadline: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Eligible Nationalities</label>
                  <input
                    type="text"
                    value={scholarshipForm.eligibleNationalities}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, eligibleNationalities: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={scholarshipForm.description}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, description: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Application Link</label>
                <input
                  type="url"
                  value={scholarshipForm.applicationUrl}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, applicationUrl: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>
            </>
          )}

          {/* CAREER FORM */}
          {modalType === 'career' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Career Title *</label>
                <input
                  type="text"
                  required
                  value={careerForm.title}
                  onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={careerForm.category}
                  onChange={(e) => setCareerForm({ ...careerForm, category: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                >
                  <option value="Technology">Technology</option>
                  <option value="Medicine & Health">Medicine & Health</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Science">Science</option>
                  <option value="Law">Law</option>
                  <option value="Arts & Media">Arts & Media</option>
                  <option value="Education">Education</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={careerForm.description}
                  onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">High School Subjects (comma separated)</label>
                <input
                  type="text"
                  value={careerForm.highSchoolSubjects}
                  onChange={(e) => setCareerForm({ ...careerForm, highSchoolSubjects: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University Degrees / Majors (comma separated)</label>
                <input
                  type="text"
                  value={careerForm.universitySubjects}
                  onChange={(e) => setCareerForm({ ...careerForm, universitySubjects: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={careerForm.skills}
                  onChange={(e) => setCareerForm({ ...careerForm, skills: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>
            </>
          )}

          {/* OPPORTUNITY FORM */}
          {modalType === 'opportunity' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  value={opportunityForm.title}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, title: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provider *</label>
                  <input
                    type="text"
                    required
                    value={opportunityForm.provider}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, provider: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Type</label>
                  <select
                    value={opportunityForm.type}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, type: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  >
                    <option value="Summer Program">Summer Program</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Competition">Competition</option>
                    <option value="Internship">Internship</option>
                    <option value="Academic Program">Academic Program</option>
                    <option value="Leadership Program">Leadership Program</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility</label>
                <input
                  type="text"
                  value={opportunityForm.eligibility}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, eligibility: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={opportunityForm.deadline}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, deadline: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Funding Details</label>
                  <input
                    type="text"
                    value={opportunityForm.funding}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, funding: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Portal Link</label>
                <input
                  type="url"
                  value={opportunityForm.applicationUrl}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, applicationUrl: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border rounded-xl"
                />
              </div>
            </>
          )}

          <div className="pt-4 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
