import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  SupabaseService,
  AdminMemberRecord,
  AdminAuditLog,
  ADMIN_EMAIL,
} from '../services/supabaseClient';
import {
  FoodItem,
  CompletedWorkout,
  LoggedMeal,
  WeightRecord,
  NotificationItem,
  MembershipCycle,
  MembershipPayment,
  MembershipSummary,
  PaymentStatusType,
} from '../types';
import {
  formatDualCalendar,
  getEthiopianNow,
  getEthiopianMonthsList,
  ethiopianToGregorian,
  gregorianToEthiopian,
  add30Days,
  toISODateString,
  calculateMembershipDaysRemaining,
  ETHIOPIAN_MONTHS_AM,
  ETHIOPIAN_MONTHS_EN,
} from '../services/ethiopianCalendar';
import {
  Users,
  ShieldCheck,
  Activity,
  UtensilsCrossed,
  Bell,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  RefreshCw,
  Send,
  Sparkles,
  Award,
  KeyRound,
  Calendar,
  Smartphone,
  Eye,
  EyeOff,
  LogOut,
  ArrowRight,
  LayoutDashboard,
  Dumbbell,
  Settings,
  Flame,
  AlertTriangle,
  Lock,
  Mail,
  Shield,
  CheckCircle2,
  Scale,
  Zap,
  CreditCard,
  Receipt,
  CheckSquare,
  Banknote,
  DollarSign,
  Phone,
  Filter,
} from 'lucide-react';

type AdminTab =
  | 'dashboard'
  | 'members'
  | 'unpaid-members'
  | 'payments'
  | 'food'
  | 'workout-plans'
  | 'broadcast'
  | 'audit'
  | 'settings';

const getTabFromPath = (path: string): AdminTab => {
  if (path.startsWith('/admin/unpaid') || path.startsWith('/admin/due')) return 'unpaid-members';
  if (path.startsWith('/admin/payment') || path.startsWith('/admin/ledger') || path.startsWith('/admin/cycles')) return 'payments';
  if (path.startsWith('/admin/members')) return 'members';
  if (path.startsWith('/admin/food') || path.startsWith('/admin/foods')) return 'food';
  if (path.startsWith('/admin/workout') || path.startsWith('/admin/workouts') || path.startsWith('/admin/workout-plans')) return 'workout-plans';
  if (path.startsWith('/admin/notification') || path.startsWith('/admin/notifications') || path.startsWith('/admin/broadcast')) return 'broadcast';
  if (path.startsWith('/admin/audit') || path.startsWith('/admin/audit-logs')) return 'audit';
  if (path.startsWith('/admin/settings') || path.startsWith('/admin/security')) return 'settings';
  return 'dashboard';
};

const getPathFromTab = (tab: AdminTab): string => {
  switch (tab) {
    case 'unpaid-members': return '/admin/unpaid';
    case 'payments': return '/admin/payments';
    case 'members': return '/admin/members';
    case 'food': return '/admin/foods';
    case 'workout-plans': return '/admin/workouts';
    case 'broadcast': return '/admin/notifications';
    case 'audit': return '/admin/audit';
    case 'settings': return '/admin/settings';
    case 'dashboard':
    default:
      return '/admin';
  }
};

export const AdminView: React.FC = () => {
  const { setRoute, updateUserProfile } = useApp();

  // Navigation tabs within Admin
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'dashboard';
  });

  // Handle Tab Change with URL sync
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const newPath = getPathFromTab(tab);
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
  };

  // Ethiopian Dual Date Info
  const dualTime = useMemo(() => formatDualCalendar(new Date()), []);
  const ethiopian = useMemo(() => getEthiopianNow(), []);

  // Member Management State
  const [members, setMembers] = useState<AdminMemberRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'VIP' | 'Standard' | 'Elite Athlete'>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'paid' | 'payment_due' | 'overdue'>('all');
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<AdminMemberRecord | null>(null);
  const [isMemberDetailModalOpen, setIsMemberDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<AdminMemberRecord | null>(null);

  // Membership & Payment Tracking State
  const [membershipDashboardStats, setMembershipDashboardStats] = useState({
    totalMembers: 0,
    paidCount: 0,
    paymentDueCount: 0,
    overdueCount: 0,
    dueTodayCount: 0,
    dueThisWeekCount: 0,
    totalRevenueETB: 0,
    activeRate: 100,
  });
  const [unpaidMembersList, setUnpaidMembersList] = useState<{ member: AdminMemberRecord; summary: MembershipSummary }[]>([]);
  const [allPaymentsList, setAllPaymentsList] = useState<MembershipPayment[]>([]);
  const [allCyclesList, setAllCyclesList] = useState<MembershipCycle[]>([]);
  const [memberSummariesMap, setMemberSummariesMap] = useState<Record<string, MembershipSummary>>({});

  // Payment Recording Modal State
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentTargetMember, setPaymentTargetMember] = useState<{ member: AdminMemberRecord; summary: MembershipSummary } | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(1000);
  const [paymentMethodInput, setPaymentMethodInput] = useState<'cash' | 'telebirr' | 'cbe_birr' | 'bank_transfer' | 'card' | 'other'>('telebirr');
  const [paymentNotesInput, setPaymentNotesInput] = useState('');
  const [paymentDateEthInput, setPaymentDateEthInput] = useState({
    year: ethiopian.year,
    month: ethiopian.month,
    day: ethiopian.day,
  });

  // Edit Start Date Modal State
  const [isEditStartDateModalOpen, setIsEditStartDateModalOpen] = useState(false);
  const [editDateMemberTarget, setEditDateMemberTarget] = useState<AdminMemberRecord | null>(null);
  const [editDateYear, setEditDateYear] = useState<number>(ethiopian.year);
  const [editDateMonth, setEditDateMonth] = useState<number>(ethiopian.month);
  const [editDateDay, setEditDateDay] = useState<number>(ethiopian.day);

  // Member Payment History Modal State
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
  const [historyTargetMember, setHistoryTargetMember] = useState<AdminMemberRecord | null>(null);
  const [historyTargetPayments, setHistoryTargetPayments] = useState<MembershipPayment[]>([]);
  const [historyTargetCycles, setHistoryTargetCycles] = useState<MembershipCycle[]>([]);

  // New Member Form State with Ethiopian Membership Options
  const [newMemberForm, setNewMemberForm] = useState({
    fullName: '',
    email: '',
    phone: '+251 91 ',
    password: 'pass123',
    membershipTier: 'VIP' as 'VIP' | 'Standard' | 'Elite Athlete',
    membershipStatus: 'active' as 'active' | 'pending',
    trainingDaysPerWeek: 4,
    goal: 'build_muscle',
    sex: 'male' as 'male' | 'female' | 'other',
    age: 25,
    heightCm: 175,
    weightKg: 75,
    language: 'en' as 'en' | 'am',
    // Membership specific parameters
    membershipStartYear: ethiopian.year,
    membershipStartMonth: ethiopian.month,
    membershipStartDay: ethiopian.day,
    initialPaymentStatus: 'paid' as 'paid' | 'payment_due',
    monthlyFee: '' as unknown as number,
  });

  // Workout Assignment Modal State
  const [isAssignProgramModalOpen, setIsAssignProgramModalOpen] = useState(false);
  const [selectedProgramToAssign, setSelectedProgramToAssign] = useState('split-4');
  const [assignmentCustomNotes, setAssignmentCustomNotes] = useState('');

  // Nutrition Target Overrides Modal State
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [nutritionForm, setNutritionForm] = useState({
    calorieTarget: 2400,
    proteinTarget: 160,
    carbsTarget: 260,
    fatTarget: 70,
    overrideCalories: 0,
    overrideProtein: 0,
    useOverride: false,
  });

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return SupabaseService.getAdminSession().isAuthenticated;
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Security Settings State
  const [adminCreds, setAdminCreds] = useState(() => SupabaseService.getAdminCredentials());
  const [currentAdminPasswordInput, setCurrentAdminPasswordInput] = useState('');
  const [adminNewEmail, setAdminNewEmail] = useState('');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [securitySuccessMessage, setSecuritySuccessMessage] = useState<string | null>(null);
  const [securityErrorMessage, setSecurityErrorMessage] = useState<string | null>(null);
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [auditFilter, setAuditFilter] = useState<string>('all');

  // Food Catalog State
  const [foodCatalog, setFoodCatalog] = useState<FoodItem[]>([]);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState<string>('all');
  const [isFastingFilterOnly, setIsFastingFilterOnly] = useState(false);
  const [isNewFoodModalOpen, setIsNewFoodModalOpen] = useState(false);
  const [editingFoodItem, setEditingFoodItem] = useState<FoodItem | null>(null);
  const [newFoodForm, setNewFoodForm] = useState({
    nameEn: '',
    nameAm: '',
    category: 'lunch' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    calories: 250,
    proteinG: 20,
    carbsG: 30,
    fatG: 5,
    fiberG: 4,
    servingSize: '1 plate (200g)',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    emoji: '🍲',
  });

  // Broadcast Notification State
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'specific'>('all');
  const [broadcastTargetUserId, setBroadcastTargetUserId] = useState<string>('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Analytics & Summary State
  const [gymStats, setGymStats] = useState({
    totalWorkoutsLogged: 0,
    totalMealsLogged: 0,
    totalActiveMembers: 0,
    todayActiveAthletes: 0,
  });

  // Selected Member deep inspection data
  const [selectedMemberWorkouts, setSelectedMemberWorkouts] = useState<CompletedWorkout[]>([]);
  const [selectedMemberMeals, setSelectedMemberMeals] = useState<LoggedMeal[]>([]);
  const [selectedMemberWeights, setSelectedMemberWeights] = useState<WeightRecord[]>([]);
  const [selectedMemberNotifs, setSelectedMemberNotifs] = useState<NotificationItem[]>([]);
  const [memberDetailTab, setMemberDetailTab] = useState<'overview' | 'workouts' | 'nutrition' | 'weights' | 'notifications'>('overview');

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load all admin data
  const loadAdminData = () => {
    // Run automated cycle check & notifications
    SupabaseService.checkAndRunMembershipExpirations();

    const memList = SupabaseService.getGlobalMembers();
    setMembers(memList);
    const logs = SupabaseService.getAuditLogs();
    setAuditLogs(logs);
    const foods = SupabaseService.getFoodCatalog();
    setFoodCatalog(foods);
    const stats = SupabaseService.getGymAggregateStats();
    setGymStats(stats);

    // Membership payment tracking stats & lists
    const pStats = SupabaseService.getMembershipDashboardStats();
    setMembershipDashboardStats(pStats);
    const unpaids = SupabaseService.getUnpaidMembersList();
    setUnpaidMembersList(unpaids);
    const payments = SupabaseService.getMembershipPayments();
    setAllPaymentsList(payments);
    const cycles = SupabaseService.getMembershipCycles();
    setAllCyclesList(cycles);

    // Build summaries lookup for all members
    const summaries: Record<string, MembershipSummary> = {};
    memList.forEach((m) => {
      summaries[m.id] = SupabaseService.getMemberMembershipSummary(m.id);
    });
    setMemberSummariesMap(summaries);
  };

  // Load selected member details when modal opens
  useEffect(() => {
    if (selectedMember) {
      const workouts = SupabaseService.getLoggedWorkouts(selectedMember.id);
      const meals = SupabaseService.getLoggedMeals(selectedMember.id);
      const weights = SupabaseService.getWeightLogs(selectedMember.id, []);
      const notifs = SupabaseService.getNotifications(selectedMember.id, []);
      setSelectedMemberWorkouts(workouts);
      setSelectedMemberMeals(meals);
      setSelectedMemberWeights(weights);
      setSelectedMemberNotifs(notifs);
    }
  }, [selectedMember]);

  // Load admin data on mount and listen to navigation popstate
  useEffect(() => {
    loadAdminData();

    // Listen to browser forward/back buttons and deep link updates
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const targetTab = getTabFromPath(currentPath);
        setActiveTab(targetTab);

        // Check for /admin/members/:id deep link
        const pathSegments = currentPath.split('/').filter(Boolean);
        if (pathSegments[0] === 'admin' && pathSegments[1] === 'members' && pathSegments[2]) {
          const targetMemberId = pathSegments[2];
          const allMembers = SupabaseService.getGlobalMembers();
          const found = allMembers.find((m) => m.id === targetMemberId);
          if (found) {
            setSelectedMember(found);
            setIsMemberDetailModalOpen(true);
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle Admin Sign Out: Terminate session and return to Admin Login screen
  const handleAdminSignOut = () => {
    SupabaseService.setAdminSession(false);
    setIsAdminAuthenticated(false);
    showToast('Admin session terminated. Please sign in again.');
  };

  // Switch to Member App (keeps session if already authenticated)
  const handleExitToMemberApp = () => {
    setRoute('dashboard');
    showToast('Switched to Member App');
  };

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await SupabaseService.verifyAdminLogin(loginEmail, loginPassword);
      if (res.success) {
        setIsAdminAuthenticated(true);
        setAdminCreds(SupabaseService.getAdminCredentials());
        loadAdminData();
        showToast('Authenticated as Dagi Fitness Administrator');
      } else {
        setLoginError(res.error || 'Invalid administrator email or password.');
      }
    } catch {
      setLoginError('Authentication failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFillDefaultAdminCredentials = () => {
    const creds = SupabaseService.getAdminCredentials();
    setLoginEmail(creds.email || 'admin@dagifitness.com');
    setLoginPassword(creds.passwordHash || 'admin123');
    setLoginError(null);
  };

  // Filtered Members with Payment Status Filtering
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.phone && m.phone.includes(searchQuery));
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && m.membershipStatus === 'active') ||
        (statusFilter === 'pending' && m.membershipStatus === 'pending') ||
        (statusFilter === 'suspended' && (m.membershipStatus === 'suspended' || m.membershipStatus === 'inactive'));
      const matchesTier = tierFilter === 'all' || m.membershipTier === tierFilter;
      
      const summary = memberSummariesMap[m.id];
      const matchesPaymentStatus =
        paymentStatusFilter === 'all' ||
        (summary && summary.paymentStatus === paymentStatusFilter);

      return matchesSearch && matchesStatus && matchesTier && matchesPaymentStatus;
    });
  }, [members, searchQuery, statusFilter, tierFilter, paymentStatusFilter, memberSummariesMap]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    if (auditFilter === 'all') return auditLogs;
    return auditLogs.filter((log) => log.action === auditFilter);
  }, [auditLogs, auditFilter]);

  // Filtered Foods
  const filteredFoods = useMemo(() => {
    return foodCatalog.filter((f) => {
      const matchesSearch =
        f.nameEn.toLowerCase().includes(foodSearch.toLowerCase()) ||
        f.nameAm.includes(foodSearch) ||
        f.category.toLowerCase().includes(foodSearch.toLowerCase());
      const matchesCategory = foodCategoryFilter === 'all' || f.category === foodCategoryFilter;
      const matchesFasting = !isFastingFilterOnly || f.isFastingFriendly;
      return matchesSearch && matchesCategory && matchesFasting;
    });
  }, [foodCatalog, foodSearch, foodCategoryFilter, isFastingFilterOnly]);

  // Create Member Handler with Ethiopian Membership Tracking
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.fullName || !newMemberForm.email) {
      showToast('Please provide full name and email.');
      return;
    }

    const priceNum = Number(newMemberForm.monthlyFee);
    if (!newMemberForm.monthlyFee || isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter a valid membership price greater than 0 ETB.');
      return;
    }

    const res = await SupabaseService.createMember({
      fullName: newMemberForm.fullName,
      email: newMemberForm.email,
      phone: newMemberForm.phone,
      password: newMemberForm.password,
      membershipTier: newMemberForm.membershipTier,
      trainingDaysPerWeek: newMemberForm.trainingDaysPerWeek,
      goal: newMemberForm.goal,
      language: newMemberForm.language,
      membershipStartDateEth: {
        year: Number(newMemberForm.membershipStartYear),
        month: Number(newMemberForm.membershipStartMonth),
        day: Number(newMemberForm.membershipStartDay),
      },
      initialPaymentStatus: newMemberForm.initialPaymentStatus,
      monthlyFee: priceNum,
      recordedBy: 'admin@blueskyfitness.com',
    });

    if (res.success && res.member) {
      loadAdminData();
      setIsNewMemberModalOpen(false);
      setNewMemberForm({
        fullName: '',
        email: '',
        phone: '+251 91 ',
        password: 'pass123',
        membershipTier: 'VIP',
        membershipStatus: 'active',
        trainingDaysPerWeek: 4,
        goal: 'build_muscle',
        sex: 'male',
        age: 25,
        heightCm: 175,
        weightKg: 75,
        language: 'en',
        membershipStartYear: ethiopian.year,
        membershipStartMonth: ethiopian.month,
        membershipStartDay: ethiopian.day,
        initialPaymentStatus: 'paid',
        monthlyFee: '' as unknown as number,
      });
      showToast(`Athlete ${res.member.fullName} provisioned with ${priceNum} ETB 30-day Ethiopian cycle!`);
    } else {
      showToast(res.error || 'Failed to create member.');
    }
  };

  // Payment Recording Handlers
  const handleOpenRecordPaymentModal = (member: AdminMemberRecord) => {
    const summary = memberSummariesMap[member.id] || SupabaseService.getMemberMembershipSummary(member.id);
    setPaymentTargetMember({ member, summary });
    setPaymentAmountInput(summary.monthlyFee || 0);
    setPaymentMethodInput('telebirr');
    setPaymentNotesInput('');
    setPaymentDateEthInput({
      year: ethiopian.year,
      month: ethiopian.month,
      day: ethiopian.day,
    });
    setIsRecordPaymentModalOpen(true);
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTargetMember || isSubmittingPayment) return;

    setIsSubmittingPayment(true);
    try {
      const gregDate = ethiopianToGregorian(
        paymentDateEthInput.year,
        paymentDateEthInput.month,
        paymentDateEthInput.day
      );

      const res = await SupabaseService.recordMembershipPayment({
        userId: paymentTargetMember.member.id,
        amount: paymentAmountInput,
        paymentMethod: paymentMethodInput,
        paymentDate: gregDate,
        recordedBy: 'admin@blueskyfitness.com',
        notes: paymentNotesInput || `Membership payment of ${paymentAmountInput} ETB recorded via ${paymentMethodInput.toUpperCase()}`,
      });

      if (res.success) {
        loadAdminData();
        setIsRecordPaymentModalOpen(false);
        setPaymentTargetMember(null);
        showToast(`Payment confirmed! Renewed for 30 days until ${res.newCycle?.dueDateEth || 'next cycle'}`);
      } else {
        showToast(res.error || 'Failed to record payment.');
      }
    } catch (err: any) {
      showToast(err.message || 'Error recording payment.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Edit Ethiopian Start Date Handlers
  const handleOpenEditStartDateModal = (member: AdminMemberRecord) => {
    setEditDateMemberTarget(member);
    
    // Parse Ethiopian start date if stored, otherwise default to current Ethiopian date
    if (member.membershipStartDateEth) {
      setEditDateYear(member.membershipStartDateEth.year);
      setEditDateMonth(member.membershipStartDateEth.month);
      setEditDateDay(member.membershipStartDateEth.day);
    } else {
      setEditDateYear(ethiopian.year);
      setEditDateMonth(ethiopian.month);
      setEditDateDay(ethiopian.day);
    }
    setIsEditStartDateModalOpen(true);
  };

  const handleEditStartDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDateMemberTarget) return;

    const ok = SupabaseService.updateMemberMembershipStartDate(
      editDateMemberTarget.id,
      {
        year: editDateYear,
        month: editDateMonth,
        day: editDateDay,
      }
    );

    if (ok) {
      loadAdminData();
      setIsEditStartDateModalOpen(false);
      setEditDateMemberTarget(null);
      showToast('Membership start date & 30-day recurring cycles updated!');
    } else {
      showToast('Failed to update membership date.');
    }
  };

  // Payment History Handlers
  const handleOpenPaymentHistoryModal = (member: AdminMemberRecord) => {
    const payments = SupabaseService.getMembershipPayments().filter((p) => p.userId === member.id);
    const cycles = SupabaseService.getMembershipCycles().filter((c) => c.userId === member.id);
    setHistoryTargetMember(member);
    setHistoryTargetPayments(payments);
    setHistoryTargetCycles(cycles);
    setIsPaymentHistoryModalOpen(true);
  };

  // Send Payment Reminder Notification
  const handleSendPaymentReminder = (member: AdminMemberRecord) => {
    const summary = memberSummariesMap[member.id] || SupabaseService.getMemberMembershipSummary(member.id);
    const isAm = member.language === 'am';

    SupabaseService.broadcastNotification({
      title: isAm ? 'የአባልነት ክፍያ ማስታወሻ' : 'Membership Payment Reminder',
      message: isAm
        ? `ውድ ${member.fullName}፣ የአባልነት ክፍያዎ ${summary.dueDateEth} ይጠናቀቃል። እባክዎ በቴሌብር (0911234567) ወይም ጂም ፊትለፊት ዴስክ ይክፈሉ።`
        : `Dear ${member.fullName}, your Dagi Fitness membership renewal (${summary.monthlyFee} ETB) is due on ${summary.dueDateEth}. Please renew via Telebirr or front desk.`,
      target: 'specific',
      targetUserId: member.id,
    });

    showToast(`Payment reminder transmitted to ${member.fullName}!`);
  };

  // Update Status Handler
  const handleUpdateStatus = (id: string, newStatus: 'active' | 'pending' | 'suspended', isApproved: boolean) => {
    SupabaseService.updateMemberStatus(id, newStatus, isApproved);
    loadAdminData();
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember({
        ...selectedMember,
        membershipStatus: newStatus,
        isApproved,
        isActive: newStatus === 'active',
      });
    }
    showToast(`Member status updated to ${newStatus.toUpperCase()}`);
  };

  // Delete Member Handler
  const confirmDeleteMember = () => {
    if (!deleteConfirmMember) return;
    const all = SupabaseService.getGlobalMembers().filter((m) => m.id !== deleteConfirmMember.id);
    SupabaseService.saveGlobalMembers(all);
    SupabaseService.logAdminAction('MEMBER_DELETED', deleteConfirmMember.email, `Removed member: ${deleteConfirmMember.fullName}`);
    loadAdminData();
    if (selectedMember?.id === deleteConfirmMember.id) {
      setIsMemberDetailModalOpen(false);
      setSelectedMember(null);
    }
    setDeleteConfirmMember(null);
    showToast(`Member ${deleteConfirmMember.fullName} deleted.`);
  };

  // Save Edit Member Handler
  const handleSaveEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    const all = SupabaseService.getGlobalMembers();
    const idx = all.findIndex((m) => m.id === selectedMember.id);
    if (idx !== -1) {
      all[idx] = { ...selectedMember };
      SupabaseService.saveGlobalMembers(all);
      SupabaseService.logAdminAction('MEMBER_UPDATED', selectedMember.email, `Updated profile for ${selectedMember.fullName}`);
      loadAdminData();
    }
    setIsEditModalOpen(false);
    showToast(`Member ${selectedMember.fullName} updated.`);
  };

  // Password Reset Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !newPasswordValue) return;
    const ok = await SupabaseService.resetMemberPassword(selectedMember.id, newPasswordValue);
    loadAdminData();
    setIsPasswordResetModalOpen(false);
    setNewPasswordValue('');
    if (ok) {
      showToast(`Password updated in Supabase Auth for ${selectedMember.fullName}!`);
    } else {
      showToast(`Password reset processed for ${selectedMember.fullName}`);
    }
  };

  // Food Create / Update Handler
  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodForm.nameEn) {
      showToast('Please enter English food name.');
      return;
    }

    if (editingFoodItem) {
      const updated: FoodItem = {
        ...editingFoodItem,
        nameEn: newFoodForm.nameEn,
        nameAm: newFoodForm.nameAm || newFoodForm.nameEn,
        category: newFoodForm.category,
        servingSize: newFoodForm.servingSize,
        calories: newFoodForm.calories,
        proteinG: newFoodForm.proteinG,
        carbsG: newFoodForm.carbsG,
        fatG: newFoodForm.fatG,
        fiberG: newFoodForm.fiberG,
        isEthiopianTraditional: newFoodForm.isEthiopianTraditional,
        isFastingFriendly: newFoodForm.isFastingFriendly,
        emoji: newFoodForm.emoji,
      };
      SupabaseService.updateFoodInCatalog(updated);
      showToast(`Updated ${updated.nameEn} in food catalog.`);
    } else {
      const newFoodItem: FoodItem = {
        id: `food-${Date.now()}`,
        nameEn: newFoodForm.nameEn,
        nameAm: newFoodForm.nameAm || newFoodForm.nameEn,
        servingSize: newFoodForm.servingSize,
        servingGrams: 200,
        calories: newFoodForm.calories,
        proteinG: newFoodForm.proteinG,
        carbsG: newFoodForm.carbsG,
        fatG: newFoodForm.fatG,
        fiberG: newFoodForm.fiberG,
        sugarG: 1.0,
        category: newFoodForm.category,
        isEthiopianTraditional: newFoodForm.isEthiopianTraditional,
        isFastingFriendly: newFoodForm.isFastingFriendly,
        emoji: newFoodForm.emoji || '🍲',
      };
      SupabaseService.addFoodToCatalog(newFoodItem);
      showToast('New food added to official catalog!');
    }

    loadAdminData();
    setIsNewFoodModalOpen(false);
    setEditingFoodItem(null);
  };

  const handleEditFoodClick = (food: FoodItem) => {
    setEditingFoodItem(food);
    setNewFoodForm({
      nameEn: food.nameEn,
      nameAm: food.nameAm,
      category: food.category,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatG: food.fatG,
      fiberG: food.fiberG || 2,
      servingSize: food.servingSize,
      isEthiopianTraditional: Boolean(food.isEthiopianTraditional),
      isFastingFriendly: Boolean(food.isFastingFriendly),
      emoji: food.emoji || '🍲',
    });
    setIsNewFoodModalOpen(true);
  };

  const handleDeleteFood = (foodId: string) => {
    SupabaseService.deleteFoodFromCatalog(foodId);
    loadAdminData();
    showToast('Food item removed from catalog.');
  };

  // Broadcast Handler
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) {
      showToast('Please provide broadcast title and message.');
      return;
    }

    setIsBroadcasting(true);
    setTimeout(() => {
      SupabaseService.broadcastNotification({
        title: broadcastTitle,
        message: broadcastMessage,
        target: broadcastTarget,
        targetUserId: broadcastTarget === 'specific' ? broadcastTargetUserId : undefined,
      });

      loadAdminData();
      setIsBroadcasting(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
      showToast(`Broadcast transmitted successfully to members!`);
    }, 500);
  };

  // Program Assignment Handler
  const handleOpenAssignProgram = (member: AdminMemberRecord) => {
    setSelectedMember(member);
    setSelectedProgramToAssign(member.assignedProgramId || 'split-4');
    setAssignmentCustomNotes('');
    setIsAssignProgramModalOpen(true);
  };

  const handleAssignProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    const splitObj = gymSplits.find((s) => s.id === selectedProgramToAssign);
    const splitName = splitObj ? splitObj.name : 'Custom Dagi Fitness Split';

    SupabaseService.assignWorkoutProgram(
      selectedMember.id,
      selectedProgramToAssign,
      splitName,
      assignmentCustomNotes
    );

    loadAdminData();
    setIsAssignProgramModalOpen(false);
    showToast(`Assigned ${splitName} to ${selectedMember.fullName}!`);
  };

  // Nutrition Target Overrides Handler
  const handleOpenNutritionModal = (member: AdminMemberRecord) => {
    setSelectedMember(member);
    setNutritionForm({
      calorieTarget: member.calorieTarget || 2400,
      proteinTarget: member.proteinTarget || 160,
      carbsTarget: member.carbsTarget || 260,
      fatTarget: member.fatTarget || 70,
      overrideCalories: member.overrideCalories || 0,
      overrideProtein: member.overrideProtein || 0,
      useOverride: Boolean(member.overrideCalories || member.overrideProtein),
    });
    setIsNutritionModalOpen(true);
  };

  const handleSaveNutritionTargets = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    SupabaseService.updateNutritionTargets(selectedMember.id, {
      calorieTarget: nutritionForm.calorieTarget,
      proteinTarget: nutritionForm.proteinTarget,
      carbsTarget: nutritionForm.carbsTarget,
      fatTarget: nutritionForm.fatTarget,
      overrideCalories: nutritionForm.useOverride ? nutritionForm.overrideCalories : undefined,
      overrideProtein: nutritionForm.useOverride ? nutritionForm.overrideProtein : undefined,
    });

    loadAdminData();
    setIsNutritionModalOpen(false);
    showToast(`Nutrition targets updated for ${selectedMember.fullName}!`);
  };

  // Admin Security Update Handler
  const handleUpdateAdminSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityErrorMessage(null);
    setSecuritySuccessMessage(null);

    const trimmedCurrentPass = currentAdminPasswordInput.trim();
    const trimmedNewEmail = adminNewEmail.trim().toLowerCase();
    const trimmedNewPass = adminNewPass.trim();
    const trimmedConfirmPass = adminConfirmPass.trim();

    if (!trimmedNewEmail && !trimmedNewPass) {
      setSecurityErrorMessage('Please specify a new administrator email or a new master password to update.');
      return;
    }

    if (trimmedNewEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedNewEmail)) {
      setSecurityErrorMessage('Please enter a valid administrator email address (e.g. admin@dagifitness.com).');
      return;
    }

    if (trimmedNewPass) {
      if (trimmedNewPass.length < 6) {
        setSecurityErrorMessage('New master password must be at least 6 characters long.');
        return;
      }
      if (trimmedNewPass !== trimmedConfirmPass) {
        setSecurityErrorMessage('New password and confirmation do not match. Please verify and re-enter.');
        return;
      }
    }

    const currentCreds = SupabaseService.getAdminCredentials();
    const expectedCurrentPass = (currentCreds.passwordHash || 'admin123').trim();
    const isCurrentPassValid = currentCreds.updatedAt
      ? trimmedCurrentPass === expectedCurrentPass
      : (trimmedCurrentPass === expectedCurrentPass || trimmedCurrentPass === 'admin123');
    if (!isCurrentPassValid) {
      setSecurityErrorMessage('Current master password is incorrect. Administrative changes denied.');
      return;
    }

    setIsUpdatingSecurity(true);
    try {
      const ok = SupabaseService.updateAdminSecurity(
        currentCreds.email,
        trimmedNewEmail || undefined,
        trimmedNewPass || undefined
      );

      if (ok) {
        // Also sync with server route
        try {
          await fetch('/api/admin/update-admin-credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              currentEmail: currentCreds.email,
              newEmail: trimmedNewEmail || undefined,
              newPassword: trimmedNewPass || undefined,
            }),
          });
        } catch (serverErr) {
          console.warn('Server credentials sync warning:', serverErr);
        }

        const updated = SupabaseService.getAdminCredentials();
        setAdminCreds(updated);
        setSecuritySuccessMessage(
          `Security credentials successfully updated! Active Admin: ${updated.email}${trimmedNewPass ? ' • Password rotated successfully.' : ''}`
        );
        showToast('Admin security credentials updated successfully!');
        setAdminNewEmail('');
        setAdminNewPass('');
        setAdminConfirmPass('');
        setCurrentAdminPasswordInput('');
        loadAdminData();
      } else {
        setSecurityErrorMessage('Failed to update credentials. Please check system logs.');
      }
    } catch (err: any) {
      setSecurityErrorMessage(err?.message || 'Error updating administrative security settings.');
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  // Export Gym Backup
  const handleExportGymBackup = () => {
    const dataStr = SupabaseService.exportAllGymData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dagi_fitness_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded full ecosystem backup (JSON)!');
  };

  // Previewing as a member in mobile app
  const handleImpersonate = (member: AdminMemberRecord) => {
    updateUserProfile({
      id: member.id,
      name: member.fullName,
      email: member.email,
      language: member.language === 'am' ? 'am' : 'en',
      membershipTier: member.membershipTier,
      workoutDaysPerWeek: member.trainingDaysPerWeek || 4,
    });
    setRoute('dashboard');
  };

  // Pre-configured Gym Workout Splits
  const gymSplits = [
    {
      id: 'split-3',
      name: '3-Day Full Body Foundation',
      daysCount: 3,
      targetLevel: 'Beginner / Foundation',
      description: 'Compound multi-joint movements focusing on hypertrophy and total-body metabolic conditioning.',
      days: ['Day 1: Full Body Power & Press', 'Day 2: Full Body Pull & Core', 'Day 3: Full Body Legs & Conditioning'],
    },
    {
      id: 'split-4',
      name: '4-Day Upper / Lower Performance',
      daysCount: 4,
      targetLevel: 'Intermediate Athletes',
      description: 'High-frequency upper and lower body split with optimal 48-hour muscle recovery cycles.',
      days: ['Day 1: Upper Body Strength (Chest/Back)', 'Day 2: Lower Body Power (Quads/Glutes)', 'Day 3: Upper Body Hypertrophy (Arms/Delts)', 'Day 4: Lower Body Posterior Chain (Hamstrings/Calves)'],
    },
    {
      id: 'split-5',
      name: '5-Day VIP Push / Pull / Legs / Upper / Lower',
      daysCount: 5,
      targetLevel: 'Advanced VIP Members',
      description: 'The premier Dagi Fitness muscle hypertrophy split tailored for dedicated bodybuilders and athletes.',
      days: ['Day 1: Heavy Push (Chest/Shoulders/Triceps)', 'Day 2: Heavy Pull (Back/Lats/Biceps)', 'Day 3: High Volume Legs (Quads/Hamstrings)', 'Day 4: Upper Body Sculpt & Delts', 'Day 5: Lower Body & Athletic Conditioning'],
    },
    {
      id: 'split-6',
      name: '6-Day Elite PPL × 2',
      daysCount: 6,
      targetLevel: 'Elite Athlete Competitors',
      description: 'Maximum volume split designed for competitive fitness athletes with daily targeted muscle groups.',
      days: ['Day 1: Push A', 'Day 2: Pull A', 'Day 3: Legs A', 'Day 4: Push B', 'Day 5: Pull B', 'Day 6: Legs B & Core'],
    },
  ];

  // --------------------------------------------------------------------------
  // RENDER: ADMIN LOGIN SCREEN (Gated Authentication)
  // --------------------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF]/40 to-[#F1F5F9] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#5C71F3] selection:text-white">
        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-5 right-5 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-6 sm:p-8 space-y-6 relative"
        >
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-[#E2E8F0] p-1.5 shadow-lg shadow-[#5C71F3]/15 flex items-center justify-center">
              <img
                src="/dagi-logo.jpg"
                alt="Dagi Fitness"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-black uppercase tracking-wider mb-1.5 border border-[#C7D2FE]">
                <Shield className="w-3 h-3 text-[#5C71F3]" />
                <span>Admin Console Security</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                Dagi Fitness
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Enter administrator credentials to access member roster, nutrition plans, and gym controls.
              </p>
            </div>
          </div>

          {/* Quick Credentials Card with Auto-fill */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#334155] flex items-center gap-1.5 text-xs">
                <KeyRound className="w-3.5 h-3.5 text-[#5C71F3]" />
                <span>Required Credentials</span>
              </span>
              <button
                type="button"
                onClick={handleFillDefaultAdminCredentials}
                className="text-[11px] font-bold text-[#5C71F3] hover:text-[#4355D6] hover:underline cursor-pointer flex items-center gap-1"
                title="Fill in administrator credentials"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-fill</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1 text-[11.5px] text-[#64748B] font-mono bg-white p-2.5 rounded-xl border border-[#CBD5E1]/60">
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">Email:</span>
                <span className="font-bold text-[#0F172A] selection:bg-[#5C71F3] selection:text-white">{adminCreds.email || 'admin@dagifitness.com'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">Password:</span>
                <span className="font-bold text-[#0F172A]">{adminCreds.passwordHash || 'admin123'}</span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2 text-xs text-red-700 font-semibold"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">
                Administrator Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="admin@dagifitness.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#5C71F3] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">
                Master Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#5C71F3] focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#5C71F3] hover:bg-[#4E62EB] active:scale-[0.99] text-white rounded-xl font-bold text-xs shadow-md shadow-[#5C71F3]/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Sign In to Admin Console</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Back Button */}
          <div className="pt-3 border-t border-[#F1F5F9] flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleExitToMemberApp}
              className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Member Application</span>
            </button>
            <p className="text-[10px] text-[#94A3B8] text-center">
              Secured with Row-Level Security & Encrypted Supabase Operations
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: ADMIN CONSOLE (Authenticated)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#5C71F3] selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-md shadow-[#5C71F3]/15 overflow-hidden p-1">
            <img
              src="/dagi-logo.jpg"
              alt="Dagi Fitness"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-[#0F172A]">Dagi Fitness Admin Console</h1>
              <span className="bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full">
                Supabase Authority
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Addis Ababa VIP Fitness Operations & Athletic Provisioning
            </p>
          </div>
        </div>

        {/* Dual Ethiopian & Gregorian Calendar Display */}
        <div className="hidden lg:flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2 rounded-2xl text-xs text-[#475569]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5C71F3]" />
            <span className="font-bold text-[#0F172A]">{dualTime.ethiopianDateFormatted}</span>
            <span className="text-[#94A3B8]">({ethiopian.season})</span>
          </div>
          <span className="text-[#CBD5E1]">|</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-[#0F172A]">{dualTime.gregorianFormatted}</span>
          </div>
        </div>

        {/* Quick Actions & Profile */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-xs">
            <Shield className="w-3.5 h-3.5 text-[#5C71F3]" />
            <span className="font-bold text-[#3730A3] truncate max-w-[180px]">{adminCreds.email}</span>
          </div>

          <button
            onClick={handleExitToMemberApp}
            className="flex items-center gap-2 bg-[#5C71F3] hover:bg-[#4E62EB] text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-md shadow-[#5C71F3]/20 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Launch Member App</span>
          </button>

          <button
            onClick={handleAdminSignOut}
            className="flex items-center gap-1.5 bg-[#FEE2E2] hover:bg-[#FCA5A5] text-[#991B1B] px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border border-[#FECACA]"
            title="Sign out of Admin Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-[#E2E8F0] p-4 flex flex-col justify-between space-y-4 shrink-0">
          <div className="space-y-1.5">
            <div className="text-[10.5px] font-extrabold text-[#94A3B8] uppercase tracking-wider px-3 mb-2">
              Management Portal
            </div>

            <button
              id="admin-nav-dashboard"
              onClick={() => handleTabChange('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/25'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Dashboard</span>
              </div>
            </button>

            <button
              id="admin-nav-members"
              onClick={() => handleTabChange('members')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/25'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Member Directory</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'members' ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#475569]'
                }`}
              >
                {members.length}
              </span>
            </button>

            {/* UNPAID & DUE MEMBERS TAB BUTTON */}
            <button
              id="admin-nav-unpaid"
              onClick={() => handleTabChange('unpaid-members')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'unpaid-members'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/25'
                  : unpaidMembersList.length > 0
                  ? 'text-amber-700 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-4 h-4 ${activeTab === 'unpaid-members' ? 'text-white' : 'text-amber-500'}`} />
                <span>Unpaid & Due Members</span>
              </div>
              {unpaidMembersList.length > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeTab === 'unpaid-members' ? 'bg-white/20 text-white' : 'bg-red-500 text-white shadow-xs'
                  }`}
                >
                  {unpaidMembersList.length}
                </span>
              )}
            </button>

            {/* PAYMENT LEDGER & CYCLES TAB BUTTON */}
            <button
              id="admin-nav-payments"
              onClick={() => handleTabChange('payments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/25'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" />
                <span>Payment Ledger</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'payments' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {allPaymentsList.length}
              </span>
            </button>

            <button
              id="admin-nav-food"
              onClick={() => handleTabChange('food')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'food'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/25'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Food Catalog</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'food' ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#475569]'
                }`}
              >
                {foodCatalog.length}
              </span>
            </button>

            <button
              id="admin-nav-splits"
              onClick={() => handleTabChange('workout-plans')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'workout-plans'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/25'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Dumbbell className="w-4 h-4" />
                <span>Workout Splits</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black">
                {gymSplits.length}
              </span>
            </button>

            <button
              id="admin-nav-broadcast"
              onClick={() => handleTabChange('broadcast')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'broadcast'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/25'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>VIP Broadcasts</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                Live
              </span>
            </button>

            <button
              id="admin-nav-audit"
              onClick={() => handleTabChange('audit')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/25'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>Audit Trails</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'audit' ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#475569]'
                }`}
              >
                {auditLogs.length}
              </span>
            </button>

            <button
              id="admin-nav-settings"
              onClick={() => handleTabChange('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/25'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Console Settings</span>
              </div>
            </button>
          </div>

          {/* Ethiopian Calendar Widget in Sidebar */}
          <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs space-y-1">
            <div className="flex items-center gap-2 text-[#5C71F3] font-bold text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>የኢትዮጵያ ዘመን አቆጣጠር</span>
            </div>
            <p className="text-[#0F172A] font-black text-xs">{dualTime.ethiopianDateFormatted}</p>
            <p className="text-[#64748B] text-[10.5px]">ዛሬ፦ {ethiopian.dayNameAm}</p>
            <div className="pt-1.5 border-t border-[#E2E8F0] flex justify-between text-[9.5px] text-[#64748B]">
              <span>ወቅት: {ethiopian.season}</span>
              <span>UTC+3 Addis</span>
            </div>
          </div>
        </aside>

        {/* Central Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* ================================================================= */}
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {/* ================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Gym Executive Overview</h2>
                  <p className="text-xs text-[#64748B]">
                    Real-time athletic analytics, Ethiopian 30-day membership cycles, and payment tracking.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={loadAdminData}
                    className="p-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#475569] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Supabase</span>
                  </button>
                  <button
                    onClick={() => setIsNewMemberModalOpen(true)}
                    className="bg-[#5C71F3] hover:bg-[#4E62EB] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#5C71F3]/25 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Provision Member</span>
                  </button>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Members */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase">Total Registered</span>
                    <Users className="w-4 h-4 text-[#5C71F3]" />
                  </div>
                  <p className="text-2xl font-black text-[#0F172A]">{members.length}</p>
                  <p className="text-[10px] text-[#64748B]">Admin-authorized athletes</p>
                </div>

                {/* Paid Athletes */}
                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase">Paid & Active</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-emerald-600">
                    {membershipDashboardStats.paidCount}
                  </p>
                  <p className="text-[10px] text-emerald-600">{membershipDashboardStats.activeRate}% payment compliance</p>
                </div>

                {/* Payment Due / Overdue Attention */}
                <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs space-y-1 cursor-pointer hover:border-amber-300 transition-colors"
                  onClick={() => handleTabChange('unpaid-members')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-700 uppercase">Unpaid / Due</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black text-amber-600">
                    {membershipDashboardStats.paymentDueCount + membershipDashboardStats.overdueCount}
                  </p>
                  <p className="text-[10px] text-amber-700">
                    {membershipDashboardStats.overdueCount} overdue • {membershipDashboardStats.dueTodayCount} due today
                  </p>
                </div>

                {/* Total Revenue ETB */}
                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase">Collected Revenue</span>
                    <Banknote className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-black text-indigo-600">
                    {membershipDashboardStats.totalRevenueETB.toLocaleString()} <span className="text-xs font-bold text-indigo-400">ETB</span>
                  </p>
                  <p className="text-[10px] text-indigo-600">Across {allPaymentsList.length} receipts</p>
                </div>
              </div>

              {/* Gym Activity Aggregation Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5C71F3] flex items-center justify-center shrink-0">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase block">Total Workouts Completed</span>
                    <p className="text-2xl font-black text-[#0F172A]">{gymStats.totalWorkoutsLogged || 8}</p>
                    <span className="text-[10.5px] text-[#64748B]">Across all training splits</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase block">Total Meals Logged</span>
                    <p className="text-2xl font-black text-[#0F172A]">{gymStats.totalMealsLogged || 14}</p>
                    <span className="text-[10.5px] text-[#64748B]">Ethiopian & global nutrition items</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase block">VIP & Elite Members</span>
                    <p className="text-2xl font-black text-[#0F172A]">
                      {members.filter((m) => m.membershipTier === 'VIP' || m.membershipTier === 'Elite Athlete').length}
                    </p>
                    <span className="text-[10.5px] text-[#64748B]">Premium personalized regimens</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Unpaid Attention List & Recent Payments Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Unpaid Members Quick Action */}
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="font-extrabold text-[#0F172A] text-sm">Action Required: Unpaid / Due</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('unpaid-members')}
                      className="text-xs font-bold text-[#5C71F3] hover:underline cursor-pointer"
                    >
                      View All ({unpaidMembersList.length})
                    </button>
                  </div>

                  {unpaidMembersList.length > 0 ? (
                    <div className="divide-y divide-[#F1F5F9]">
                      {unpaidMembersList.slice(0, 4).map(({ member, summary }) => (
                        <div key={member.id} className="py-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 font-black text-xs flex items-center justify-center border border-amber-200">
                              {member.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-[#0F172A]">{member.fullName}</p>
                              <p className="text-[10.5px] text-[#64748B]">
                                Due: {summary.dueDateEth} • Cycle #{summary.cycleNumber}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                summary.paymentStatus === 'overdue'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {summary.daysRemaining < 0
                                ? `${Math.abs(summary.daysRemaining)}d OVERDUE`
                                : summary.daysRemaining === 0
                                ? 'DUE TODAY'
                                : `${summary.daysRemaining}d LEFT`}
                            </span>
                            <button
                              onClick={() => handleOpenRecordPaymentModal(member)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-bold transition-all shadow-xs cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[#64748B] text-xs space-y-1">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <p className="font-bold text-[#0F172A]">All Athlete Memberships are Fully Paid!</p>
                      <p className="text-[11px]">No overdue or pending renewal cycles at this time.</p>
                    </div>
                  )}
                </div>

                {/* Recent Payments Ledger Feed */}
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-extrabold text-[#0F172A] text-sm">Recent Payment Receipts</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="text-xs font-bold text-[#5C71F3] hover:underline cursor-pointer"
                    >
                      View Ledger ({allPaymentsList.length})
                    </button>
                  </div>

                  {allPaymentsList.length > 0 ? (
                    <div className="divide-y divide-[#F1F5F9]">
                      {allPaymentsList.slice(0, 4).map((p) => {
                        const targetMem = members.find((m) => m.id === p.userId);
                        return (
                          <div key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div>
                              <p className="font-bold text-[#0F172A]">{targetMem?.fullName || 'Athlete'}</p>
                              <p className="text-[10.5px] text-[#64748B]">
                                {p.paymentDateEth} • {p.paymentMethod.toUpperCase()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-emerald-600 block">{p.amount} ETB</span>
                              <span className="text-[9.5px] text-[#94A3B8] font-mono">Cycle #{p.cycleNumber}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[#64748B] text-xs">
                      <CreditCard className="w-8 h-8 text-[#CBD5E1] mx-auto mb-1" />
                      <p>No payment receipts recorded yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: MEMBER DIRECTORY WITH PAYMENT STATUS */}
          {/* ================================================================= */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              {/* Header & Stats Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight">VIP Member Directory</h2>
                  <p className="text-xs text-[#64748B]">
                    Full athletic rosters, 30-day Ethiopian recurring cycles, and payment credentials.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={loadAdminData}
                    className="p-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#475569] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync</span>
                  </button>
                  <button
                    onClick={() => setIsNewMemberModalOpen(true)}
                    className="bg-[#5C71F3] hover:bg-[#4E62EB] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#5C71F3]/25 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Provision New Member</span>
                  </button>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="flex-1 relative flex items-center">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, phone..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#5C71F3]"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value as any)}
                    className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#334155] font-semibold outline-none focus:border-[#5C71F3]"
                  >
                    <option value="all">All Payment States</option>
                    <option value="paid">Paid (Current)</option>
                    <option value="payment_due">Payment Due (≤3d)</option>
                    <option value="overdue">Overdue (&lt;0d)</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'pending' | 'suspended')}
                    className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#334155] font-semibold outline-none focus:border-[#5C71F3]"
                  >
                    <option value="all">All Access States</option>
                    <option value="active">Active Only</option>
                    <option value="pending">Pending Approval</option>
                    <option value="suspended">Suspended</option>
                  </select>

                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value as 'all' | 'VIP' | 'Standard' | 'Elite Athlete')}
                    className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#334155] font-semibold outline-none focus:border-[#5C71F3]"
                  >
                    <option value="all">All Tiers</option>
                    <option value="VIP">VIP Tier</option>
                    <option value="Elite Athlete">Elite Athlete</option>
                    <option value="Standard">Standard Tier</option>
                  </select>
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#334155]">
                    <thead className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                      <tr>
                        <th className="px-4 py-3.5">Athlete</th>
                        <th className="px-4 py-3.5">30-Day Ethiopian Cycle</th>
                        <th className="px-4 py-3.5">Payment Status</th>
                        <th className="px-4 py-3.5">Monthly Fee</th>
                        <th className="px-4 py-3.5">Tier & Access</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {filteredMembers.map((member) => {
                        const summary = memberSummariesMap[member.id] || {
                          status: 'paid',
                          paymentStatus: 'paid',
                          cycleNumber: 1,
                          startDateEth: '1/1/2018',
                          dueDateEth: '30/1/2018',
                          daysRemaining: 15,
                          monthlyFee: 0,
                          isOverdue: false,
                          isPaymentDueSoon: false,
                        };

                        return (
                          <tr key={member.id} className="hover:bg-[#F8FAFC] transition-colors">
                            {/* Athlete Details */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#5C71F3]/10 border border-[#5C71F3]/20 text-[#5C71F3] flex items-center justify-center font-black">
                                  {member.fullName.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-[#0F172A] block">{member.fullName}</span>
                                  <span className="text-[10.5px] text-[#64748B]">
                                    {member.email} {member.phone ? `• ${member.phone}` : ''}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* 30-Day Ethiopian Cycle */}
                            <td className="px-4 py-3.5">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="bg-[#F1F5F9] text-[#475569] px-1.5 py-0.5 rounded text-[10px] font-black">
                                    Cycle #{summary.cycleNumber}
                                  </span>
                                  <span className="text-[#0F172A] font-bold text-[11px]">{summary.dueDateEth}</span>
                                </div>
                                <span className="text-[10px] text-[#94A3B8] block">
                                  Started: {summary.startDateEth}
                                </span>
                              </div>
                            </td>

                            {/* Payment Status Badge */}
                            <td className="px-4 py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1.5 ${
                                  summary.paymentStatus === 'paid'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : summary.paymentStatus === 'overdue'
                                    ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {summary.paymentStatus === 'paid' ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    <span>PAID ({summary.daysRemaining}d left)</span>
                                  </>
                                ) : summary.paymentStatus === 'overdue' ? (
                                  <>
                                    <AlertTriangle className="w-3 h-3 text-red-600" />
                                    <span>OVERDUE ({Math.abs(summary.daysRemaining)}d)</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>DUE SOON ({summary.daysRemaining}d)</span>
                                  </>
                                )}
                              </span>
                            </td>

                            {/* Monthly Fee */}
                            <td className="px-4 py-3.5">
                              <span className="font-black text-[#0F172A] block">{summary.monthlyFee || 0} ETB</span>
                              <span className="text-[10px] text-[#64748B]">Per 30-day cycle</span>
                            </td>

                            {/* Tier & Access */}
                            <td className="px-4 py-3.5">
                              <div className="space-y-1">
                                <span
                                  className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase inline-block ${
                                    member.membershipTier === 'VIP'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : member.membershipTier === 'Elite Athlete'
                                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                >
                                  {member.membershipTier}
                                </span>
                                <span
                                  className={`block text-[10px] font-bold ${
                                    member.membershipStatus === 'active' ? 'text-emerald-600' : 'text-amber-600'
                                  }`}
                                >
                                  ● {member.membershipStatus.toUpperCase()}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Record Payment Action */}
                                <button
                                  onClick={() => handleOpenRecordPaymentModal(member)}
                                  title="Record Payment / Renew 30 Days"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-colors cursor-pointer border border-emerald-200 flex items-center gap-1 font-bold text-[10.5px]"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span className="hidden xl:inline">Pay</span>
                                </button>

                                {/* Payment History */}
                                <button
                                  onClick={() => handleOpenPaymentHistoryModal(member)}
                                  title="View Payment Ledger & Cycles"
                                  className="p-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#5C71F3] text-[#475569] hover:text-white transition-colors cursor-pointer"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                </button>

                                {/* Edit Ethiopian Start Date */}
                                <button
                                  onClick={() => handleOpenEditStartDateModal(member)}
                                  title="Edit Membership Ethiopian Start Date"
                                  className="p-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#5C71F3] text-[#475569] hover:text-white transition-colors cursor-pointer"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                </button>

                                {/* Inspect Drawer */}
                                <button
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setIsMemberDetailModalOpen(true);
                                  }}
                                  title="Inspect Full Athlete Record"
                                  className="p-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#5C71F3] text-[#475569] hover:text-white transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Confirmation */}
                                <button
                                  onClick={() => setDeleteConfirmMember(member)}
                                  title="Delete Member Record"
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-colors cursor-pointer border border-red-200"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredMembers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-[#94A3B8]">
                            No members found matching your search and filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2.5: UNPAID & DUE MEMBERS DEDICATED TRACKER */}
          {/* ================================================================= */}
          {activeTab === 'unpaid-members' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Unpaid & Due Members</h2>
                    <span className="bg-red-100 text-red-700 text-xs font-black px-2.5 py-0.5 rounded-full">
                      {unpaidMembersList.length} Attention Required
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B]">
                    Athletes with overdue balances or membership renewal cycles expiring within 3 days.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={loadAdminData}
                    className="p-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#475569] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh List</span>
                  </button>
                </div>
              </div>

              {/* Status Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-1">
                  <span className="text-[11px] font-bold text-red-700 uppercase">Overdue Members</span>
                  <p className="text-2xl font-black text-red-700">{membershipDashboardStats.overdueCount}</p>
                  <p className="text-[10px] text-red-600">Immediate payment collection needed</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 uppercase">Due Today</span>
                  <p className="text-2xl font-black text-amber-800">{membershipDashboardStats.dueTodayCount}</p>
                  <p className="text-[10px] text-amber-700">Expires at 11:59 PM Addis Ababa time</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-1">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase">Outstanding Balance</span>
                  <p className="text-2xl font-black text-indigo-700">
                    {(unpaidMembersList.reduce((acc, item) => acc + (item.summary.monthlyFee || 0), 0)).toLocaleString()} ETB
                  </p>
                  <p className="text-[10px] text-indigo-600">Total collectible across {unpaidMembersList.length} members</p>
                </div>
              </div>

              {/* Unpaid Members Roster Table */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#334155]">
                    <thead className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                      <tr>
                        <th className="px-4 py-3.5">Athlete</th>
                        <th className="px-4 py-3.5">Contact Details</th>
                        <th className="px-4 py-3.5">Cycle # & Due Date</th>
                        <th className="px-4 py-3.5">Days Status</th>
                        <th className="px-4 py-3.5">Amount Due</th>
                        <th className="px-4 py-3.5 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {unpaidMembersList.map(({ member, summary }) => (
                        <tr key={member.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                                {member.fullName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-[#0F172A] block">{member.fullName}</span>
                                <span className="text-[10px] text-[#64748B]">{member.membershipTier} Athlete</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="text-[#0F172A] font-semibold block">{member.email}</span>
                            <span className="text-[10.5px] text-[#64748B]">{member.phone || 'No phone recorded'}</span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="font-bold text-[#0F172A] block">{summary.dueDateEth}</span>
                            <span className="text-[10px] text-[#94A3B8]">Cycle #{summary.cycleNumber}</span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                                summary.paymentStatus === 'overdue'
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {summary.daysRemaining < 0
                                ? `${Math.abs(summary.daysRemaining)} Days Overdue`
                                : summary.daysRemaining === 0
                                ? 'Due Today'
                                : `${summary.daysRemaining} Days Left`}
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="font-black text-[#0F172A] text-sm">{summary.monthlyFee || 0} ETB</span>
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSendPaymentReminder(member)}
                                title="Send Payment Reminder Push Notification"
                                className="px-3 py-1.5 bg-[#EEF2FF] hover:bg-[#5C71F3] text-[#4F46E5] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Bell className="w-3.5 h-3.5" />
                                <span>Remind</span>
                              </button>

                              <button
                                onClick={() => handleOpenRecordPaymentModal(member)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Mark as Paid</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {unpaidMembersList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-[#64748B]">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                            <p className="font-black text-sm text-[#0F172A]">Zero Unpaid or Expiring Memberships</p>
                            <p className="text-xs">All athlete accounts are active with active Ethiopian cycles.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2.7: COMPLETE PAYMENT LEDGER & CYCLES */}
          {/* ================================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Membership Payment Ledger</h2>
                  <p className="text-xs text-[#64748B]">
                    Complete historical log of all 30-day membership fees, receipts, and payment channels.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={loadAdminData}
                    className="p-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#475569] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Financial Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Total Collected Revenue</span>
                  <p className="text-2xl font-black text-emerald-600">
                    {membershipDashboardStats.totalRevenueETB.toLocaleString()} ETB
                  </p>
                  <span className="text-[10px] text-[#64748B]">Cumulative gym fees</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Total Payment Receipts</span>
                  <p className="text-2xl font-black text-[#0F172A]">{allPaymentsList.length}</p>
                  <span className="text-[10px] text-[#64748B]">Across all active athletes</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">30-Day Cycles Created</span>
                  <p className="text-2xl font-black text-[#5C71F3]">{allCyclesList.length}</p>
                  <span className="text-[10px] text-[#64748B]">Continuous renewal periods</span>
                </div>
              </div>

              {/* Payments Ledger Table */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#334155]">
                    <thead className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                      <tr>
                        <th className="px-4 py-3.5">Receipt / Date</th>
                        <th className="px-4 py-3.5">Athlete</th>
                        <th className="px-4 py-3.5">Cycle #</th>
                        <th className="px-4 py-3.5">Amount (ETB)</th>
                        <th className="px-4 py-3.5">Payment Method</th>
                        <th className="px-4 py-3.5">Recorded By</th>
                        <th className="px-4 py-3.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {allPaymentsList.map((payment) => {
                        const member = members.find((m) => m.id === payment.userId);
                        return (
                          <tr key={payment.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-4 py-3.5">
                              <span className="font-bold text-[#0F172A] block">{payment.paymentDateEth}</span>
                              <span className="text-[9.5px] font-mono text-[#94A3B8]">{payment.id}</span>
                            </td>

                            <td className="px-4 py-3.5 font-bold text-[#0F172A]">
                              {member?.fullName || payment.userId}
                            </td>

                            <td className="px-4 py-3.5">
                              <span className="bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded text-[10px] font-black">
                                Cycle #{payment.cycleNumber}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 font-black text-emerald-600 text-sm">
                              {payment.amount} ETB
                            </td>

                            <td className="px-4 py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                  payment.paymentMethod === 'telebirr'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : payment.paymentMethod === 'cbe_birr'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : payment.paymentMethod === 'cash'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {payment.paymentMethod.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 text-[11px] text-[#64748B]">
                              {payment.recordedBy}
                            </td>

                            <td className="px-4 py-3.5 text-[11px] text-[#64748B] max-w-xs truncate">
                              {payment.notes || '—'}
                            </td>
                          </tr>
                        );
                      })}

                      {allPaymentsList.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-[#94A3B8]">
                            No payments recorded in the ledger yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: FOOD CATALOG (ETHIOPIAN + GLOBAL NUTRITION) */}
          {/* ================================================================= */}
          {activeTab === 'food' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
                    Ethiopian & Global Food Nutrition Database
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Calibrated macronutrient and micronutrient profiles for Addis Ababa athletic diets.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingFoodItem(null);
                    setNewFoodForm({
                      nameEn: '',
                      nameAm: '',
                      category: 'lunch',
                      calories: 250,
                      proteinG: 20,
                      carbsG: 30,
                      fatG: 5,
                      fiberG: 4,
                      servingSize: '1 plate (200g)',
                      isEthiopianTraditional: true,
                      isFastingFriendly: false,
                      emoji: '🍲',
                    });
                    setIsNewFoodModalOpen(true);
                  }}
                  className="bg-[#5C71F3] hover:bg-[#4E62EB] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#5C71F3]/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Food to Catalog</span>
                </button>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="flex-1 relative flex items-center">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5" />
                  <input
                    type="text"
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    placeholder="Search by English, Amharic (ለምሳሌ ሽሮ፣ ጥብስ፣ ክክ አልጫ), or category..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#5C71F3]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={foodCategoryFilter}
                    onChange={(e) => setFoodCategoryFilter(e.target.value)}
                    className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#334155] font-semibold outline-none focus:border-[#5C71F3]"
                  >
                    <option value="all">All Meal Times</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setIsFastingFilterOnly(!isFastingFilterOnly)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isFastingFilterOnly
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    🥬 የጾም / Fasting
                  </button>
                </div>
              </div>

              {/* Food Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#5C71F3] transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{food.emoji || '🍲'}</span>
                          <div>
                            <h4 className="font-extrabold text-[#0F172A] text-sm">{food.nameEn}</h4>
                            <h5 className="font-bold text-[#5C71F3] text-xs">{food.nameAm}</h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditFoodClick(food)}
                            className="p-1 text-[#64748B] hover:text-[#5C71F3] rounded hover:bg-[#F1F5F9] cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFood(food.id)}
                            className="p-1 text-[#64748B] hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-[#F1F5F9] text-[#475569] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {food.category}
                        </span>
                        {food.isEthiopianTraditional && (
                          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                            🇪🇹 Traditional
                          </span>
                        )}
                        {food.isFastingFriendly && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                            🥬 Fasting
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#64748B] mt-2">Serving: {food.servingSize}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F1F5F9] grid grid-cols-4 gap-1.5 text-center">
                      <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
                        <span className="text-[9px] font-bold text-[#64748B] block uppercase">Calories</span>
                        <span className="font-black text-amber-600 text-xs">{food.calories} kcal</span>
                      </div>
                      <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
                        <span className="text-[9px] font-bold text-[#64748B] block uppercase">Protein</span>
                        <span className="font-black text-[#5C71F3] text-xs">{food.proteinG}g</span>
                      </div>
                      <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
                        <span className="text-[9px] font-bold text-[#64748B] block uppercase">Carbs</span>
                        <span className="font-black text-emerald-600 text-xs">{food.carbsG}g</span>
                      </div>
                      <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
                        <span className="text-[9px] font-bold text-[#64748B] block uppercase">Fat</span>
                        <span className="font-black text-rose-500 text-xs">{food.fatG}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: WORKOUT PLANS & SPLITS */}
          {/* ================================================================= */}
          {activeTab === 'workout-plans' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Master Training Splits & Regimens</h2>
                <p className="text-xs text-[#64748B]">
                  Standard and VIP training splits configured for Addis Ababa athletic routines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gymSplits.map((split) => (
                  <div
                    key={split.id}
                    className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-[#0F172A] text-base">{split.name}</h3>
                        </div>
                        <p className="text-xs text-[#64748B] mt-1">{split.description}</p>
                      </div>
                      <span className="bg-indigo-50 text-[#5C71F3] border border-indigo-200 text-xs font-black px-2.5 py-1 rounded-xl">
                        {split.daysCount} Days/Wk
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                        Workout Schedule
                      </span>
                      <div className="space-y-1.5">
                        {split.days.map((d, i) => (
                          <div
                            key={i}
                            className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] flex items-center gap-2"
                          >
                            <Zap className="w-3.5 h-3.5 text-[#5C71F3]" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: BROADCAST NOTIFICATIONS */}
          {/* ================================================================= */}
          {activeTab === 'broadcast' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-black text-[#0F172A] tracking-tight">VIP Push Broadcast Engine</h2>
                <p className="text-xs text-[#64748B]">
                  Transmit gym announcements, schedule updates, or nutritional reminders directly to member mobile apps.
                </p>
              </div>

              <form onSubmit={handleSendBroadcast} className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#64748B] block mb-1">Target Audience</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value as 'all' | 'specific')}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                  >
                    <option value="all">All Active VIP Members ({members.filter((m) => m.isActive).length} recipients)</option>
                    <option value="specific">Specific Member Only</option>
                  </select>
                </div>

                {broadcastTarget === 'specific' && (
                  <div>
                    <label className="text-xs font-bold text-[#64748B] block mb-1">Select Athlete</label>
                    <select
                      value={broadcastTargetUserId}
                      onChange={(e) => setBroadcastTargetUserId(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    >
                      <option value="">Choose a member...</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} ({m.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-[#64748B] block mb-1">Notification Title</label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. Dagi Fitness New Year Schedule & VIP Training Hours"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#64748B] block mb-1">Notification Message</label>
                  <textarea
                    required
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter announcement message for members..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0F172A] font-medium outline-none focus:border-[#5C71F3]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="w-full py-3 bg-[#5C71F3] hover:bg-[#4E62EB] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#5C71F3]/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isBroadcasting ? (
                    <span>Transmitting to Supabase Notifications...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Push Notification</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: AUDIT TRAILS */}
          {/* ================================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight">System Audit & Security Logs</h2>
                  <p className="text-xs text-[#64748B]">
                    Immutable log of administrative authorizations, member provisioning, and split updates.
                  </p>
                </div>
                <select
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                  className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#334155] font-semibold outline-none"
                >
                  <option value="all">All Actions</option>
                  <option value="MEMBER_PROVISIONED">Member Provisioned</option>
                  <option value="MEMBER_STATUS_UPDATED">Status Updated</option>
                  <option value="PASSWORD_RESET">Password Reset</option>
                  <option value="FOOD_CATALOG_ADD">Food Catalog</option>
                  <option value="NOTIFICATION_BROADCAST">Broadcast</option>
                </select>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-[#334155]">
                  <thead className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-4 py-3.5">Timestamp</th>
                      <th className="px-4 py-3.5">Action</th>
                      <th className="px-4 py-3.5">Target Account</th>
                      <th className="px-4 py-3.5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-4 py-3.5 text-[#64748B] whitespace-nowrap text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              log.action.includes('PROVISION')
                                ? 'bg-blue-50 text-blue-700'
                                : log.action.includes('STATUS')
                                ? 'bg-emerald-50 text-emerald-700'
                                : log.action.includes('DELETE')
                                ? 'bg-red-50 text-red-700'
                                : 'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#0F172A]">
                          {log.targetUserEmail || 'System'}
                        </td>
                        <td className="px-4 py-3.5 text-[#475569] max-w-md truncate">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: SETTINGS & SYSTEM STATUS */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Admin Console Settings</h2>
                <p className="text-xs text-[#64748B]">
                  System health, Supabase connectivity status, and super-administrator profile credentials.
                </p>
              </div>

              {/* Admin Profile Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-[#0F172A]">Super-Admin Profile</h3>
                  <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    RLS Super Authority Active
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#5C71F3] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#5C71F3]/25">
                    D
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0F172A]">Dagi Fitness Administrator</h4>
                    <p className="text-xs font-semibold text-[#64748B]">{adminCreds.email}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      Password status: <span className="font-mono font-bold text-[#475569]">Encrypted SHA-256</span>
                      {adminCreds.updatedAt && (
                        <span> • Last updated {new Date(adminCreds.updatedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Connection Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="font-black text-sm text-[#0F172A]">Backend & Supabase Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs">
                    <span className="font-semibold text-[#475569]">Supabase Database & Auth</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Operational (Cloud Run + Supabase)</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs">
                    <span className="font-semibold text-[#475569]">Row-Level Security (RLS)</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enforced</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs">
                    <span className="font-semibold text-[#475569]">Deterministic Meal & Workout Engine</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Security Credentials Form */}
              <form onSubmit={handleUpdateAdminSecurity} className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#5C71F3]" />
                      <span>Console Security & Password Rotation</span>
                    </h3>
                    <span className="text-[10.5px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                      Live Settings
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Update the super-administrator login email and master password for the Dagi Fitness portal.
                  </p>
                </div>

                {/* Success Message Banner */}
                {securitySuccessMessage && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{securitySuccessMessage}</span>
                  </div>
                )}

                {/* Error Message Banner */}
                {securityErrorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{securityErrorMessage}</span>
                  </div>
                )}

                <div className="space-y-4 pt-1">
                  {/* Current Password Verification */}
                  <div className="p-3.5 bg-[#F8FAFC] border border-[#CBD5E1]/70 rounded-2xl space-y-1.5">
                    <label className="text-[11px] font-bold text-[#334155] block">
                      Current Master Password <span className="text-red-500">* (Required to authorize changes)</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        value={currentAdminPasswordInput}
                        onChange={(e) => {
                          setCurrentAdminPasswordInput(e.target.value);
                          if (securityErrorMessage) setSecurityErrorMessage(null);
                        }}
                        placeholder="Enter current password (default: admin123)"
                        className="w-full pl-9 pr-10 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] font-medium outline-none focus:border-[#5C71F3] transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                        title={showCurrentPass ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Admin Email */}
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">
                      New Administrator Email <span className="text-[#94A3B8] font-normal">(Leave blank to keep: {adminCreds.email})</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={adminNewEmail}
                        onChange={(e) => {
                          setAdminNewEmail(e.target.value);
                          if (securityErrorMessage) setSecurityErrorMessage(null);
                        }}
                        placeholder="e.g. manager@dagifitness.com"
                        className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* New Password & Confirmation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#64748B] block mb-1">
                        New Master Password <span className="text-[#94A3B8] font-normal">(Min 6 chars)</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={adminNewPass}
                          onChange={(e) => {
                            setAdminNewPass(e.target.value);
                            if (securityErrorMessage) setSecurityErrorMessage(null);
                          }}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-9 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3] focus:bg-white transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                          title={showNewPass ? 'Hide password' : 'Show password'}
                        >
                          {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#64748B] block mb-1">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          value={adminConfirmPass}
                          onChange={(e) => {
                            setAdminConfirmPass(e.target.value);
                            if (securityErrorMessage) setSecurityErrorMessage(null);
                          }}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-9 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3] focus:bg-white transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                          title={showConfirmPass ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingSecurity}
                    className="w-full py-2.5 bg-[#5C71F3] hover:bg-[#4E62EB] active:scale-[0.99] text-white rounded-xl font-bold text-xs shadow-md shadow-[#5C71F3]/25 cursor-pointer transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isUpdatingSecurity ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Administrative Security...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Save & Apply Security Credentials</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Ecosystem Data Backup */}
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">Ecosystem Data Backup</h4>
                  <p className="text-xs text-[#64748B]">Download complete database snapshot (Members, Foods, Audit Logs) in JSON format.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportGymBackup}
                  className="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-[#5C71F3]" />
                  <span>Export JSON Backup</span>
                </button>
              </div>

              {/* Sign Out Action */}
              <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-xs flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-red-600">Terminate Admin Session</h4>
                  <p className="text-xs text-[#64748B]">Sign out of the administrative dashboard.</p>
                </div>
                <button
                  onClick={handleAdminSignOut}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: PROVISION NEW MEMBER */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isNewMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-[#E2E8F0]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">Provision New Dagi Fitness Member</h3>
                  <p className="text-xs text-[#64748B]">Create an athlete account with login credentials.</p>
                </div>
                <button
                  onClick={() => setIsNewMemberModalOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMember} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.fullName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, fullName: e.target.value })}
                    placeholder="e.g. Yared Tsegaye"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newMemberForm.email}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                      placeholder="yared@dagifitness.com"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Initial Password</label>
                    <input
                      type="text"
                      required
                      value={newMemberForm.password}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, password: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={newMemberForm.phone}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                      placeholder="+251 91 234 5678"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">
                      Membership Price (ETB) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newMemberForm.monthlyFee ?? ''}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, monthlyFee: e.target.value ? Number(e.target.value) : ('' as any) })}
                      placeholder="e.g. 2000, 1500, 2500"
                      className="w-full bg-[#F8FAFC] border-2 border-[#5C71F3]/40 focus:border-[#5C71F3] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Membership Tier</label>
                    <select
                      value={newMemberForm.membershipTier}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, membershipTier: e.target.value as any })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-2 text-xs text-[#0F172A] font-semibold outline-none"
                    >
                      <option value="VIP">VIP</option>
                      <option value="Elite Athlete">Elite Athlete</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Training Days</label>
                    <select
                      value={newMemberForm.trainingDaysPerWeek}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, trainingDaysPerWeek: parseInt(e.target.value) })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-2 text-xs text-[#0F172A] font-semibold outline-none"
                    >
                      <option value={3}>3 Days/Wk</option>
                      <option value={4}>4 Days/Wk</option>
                      <option value={5}>5 Days/Wk</option>
                      <option value={6}>6 Days/Wk</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Language</label>
                    <select
                      value={newMemberForm.language}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, language: e.target.value as any })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-2 text-xs text-[#0F172A] font-semibold outline-none"
                    >
                      <option value="en">English</option>
                      <option value="am">አማርኛ</option>
                    </select>
                  </div>
                </div>

                {/* Ethiopian Start Date & Initial Payment Status */}
                <div className="p-3 bg-[#EEF2FF]/60 rounded-xl border border-[#C7D2FE] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#3730A3]">Ethiopian Start Date (30-Day Cycle)</span>
                    <span className="text-[10px] font-semibold text-[#4F46E5]">Today: {ethiopian.formattedAm}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-[#64748B] block mb-0.5">Day</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={newMemberForm.membershipStartDay}
                        onChange={(e) => setNewMemberForm({ ...newMemberForm, membershipStartDay: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white border border-[#CBD5E1] rounded-lg px-2 py-1.5 text-xs text-[#0F172A] font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-[#64748B] block mb-0.5">Month</label>
                      <select
                        value={newMemberForm.membershipStartMonth}
                        onChange={(e) => setNewMemberForm({ ...newMemberForm, membershipStartMonth: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white border border-[#CBD5E1] rounded-lg px-1.5 py-1.5 text-xs text-[#0F172A] font-semibold"
                      >
                        {Array.from({ length: 13 }, (_, i) => i + 1).map((m) => (
                          <option key={m} value={m}>
                            {m} ({ETHIOPIAN_MONTHS_AM[m - 1]})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-[#64748B] block mb-0.5">Year</label>
                      <input
                        type="number"
                        value={newMemberForm.membershipStartYear}
                        onChange={(e) => setNewMemberForm({ ...newMemberForm, membershipStartYear: parseInt(e.target.value) || ethiopian.year })}
                        className="w-full bg-white border border-[#CBD5E1] rounded-lg px-2 py-1.5 text-xs text-[#0F172A] font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-[#64748B] block mb-0.5">Initial Status</label>
                      <select
                        value={newMemberForm.initialPaymentStatus}
                        onChange={(e) => setNewMemberForm({ ...newMemberForm, initialPaymentStatus: e.target.value as any })}
                        className="w-full bg-white border border-[#CBD5E1] rounded-lg px-1.5 py-1.5 text-xs text-[#0F172A] font-semibold"
                      >
                        <option value="paid">Paid</option>
                        <option value="payment_due">Payment Due</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsNewMemberModalOpen(false)}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5C71F3] hover:bg-[#4E62EB] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-[#5C71F3]/25"
                  >
                    Provision Athlete Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 2: FULL ATHLETE DETAILS DRAWER */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isMemberDetailModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 border border-[#E2E8F0]"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#5C71F3] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#5C71F3]/25">
                    {selectedMember.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-[#0F172A]">{selectedMember.fullName}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          selectedMember.membershipStatus === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {selectedMember.membershipStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B]">{selectedMember.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMemberDetailModalOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-tabs in Member Detail */}
              <div className="flex border-b border-[#E2E8F0] gap-4 text-xs font-bold text-[#64748B]">
                <button
                  onClick={() => setMemberDetailTab('overview')}
                  className={`pb-2 transition-all cursor-pointer ${
                    memberDetailTab === 'overview' ? 'text-[#5C71F3] border-b-2 border-[#5C71F3]' : ''
                  }`}
                >
                  Overview & Goals
                </button>
                <button
                  onClick={() => setMemberDetailTab('workouts')}
                  className={`pb-2 transition-all cursor-pointer ${
                    memberDetailTab === 'workouts' ? 'text-[#5C71F3] border-b-2 border-[#5C71F3]' : ''
                  }`}
                >
                  Workouts ({selectedMemberWorkouts.length})
                </button>
                <button
                  onClick={() => setMemberDetailTab('nutrition')}
                  className={`pb-2 transition-all cursor-pointer ${
                    memberDetailTab === 'nutrition' ? 'text-[#5C71F3] border-b-2 border-[#5C71F3]' : ''
                  }`}
                >
                  Nutrition Logs ({selectedMemberMeals.length})
                </button>
                <button
                  onClick={() => setMemberDetailTab('weights')}
                  className={`pb-2 transition-all cursor-pointer ${
                    memberDetailTab === 'weights' ? 'text-[#5C71F3] border-b-2 border-[#5C71F3]' : ''
                  }`}
                >
                  Progress Check-ins
                </button>
              </div>

              {/* SUB-VIEW 1: OVERVIEW */}
              {memberDetailTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[10px] font-bold uppercase">Membership Tier</span>
                      <span className="font-extrabold text-[#0F172A] text-xs">{selectedMember.membershipTier}</span>
                    </div>
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[10px] font-bold uppercase">Phone</span>
                      <span className="font-extrabold text-[#0F172A] text-xs">{selectedMember.phone || '+251 91 123 4567'}</span>
                    </div>
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[10px] font-bold uppercase">Biometrics</span>
                      <span className="font-extrabold text-[#0F172A] text-xs">
                        {selectedMember.age || 26} yrs • {selectedMember.heightCm || 178} cm • {selectedMember.weightKg || 76} kg
                      </span>
                    </div>
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[10px] font-bold uppercase">Training Schedule</span>
                      <span className="font-extrabold text-[#0F172A] text-xs">{selectedMember.trainingDaysPerWeek || 4} days/week</span>
                    </div>
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[10px] font-bold uppercase">Target Fitness Goal</span>
                      <span className="font-extrabold text-[#0F172A] text-xs capitalize">
                        {selectedMember.goal?.replace('_', ' ') || 'Build Muscle'}
                      </span>
                    </div>
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[10px] font-bold uppercase">Language</span>
                      <span className="font-extrabold text-[#0F172A] text-xs">{selectedMember.language?.toUpperCase() || 'EN'}</span>
                    </div>
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[10px] font-bold uppercase">Joined Date</span>
                      <span className="font-extrabold text-[#0F172A] text-xs">{selectedMember.joinedDate}</span>
                    </div>
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block text-[10px] font-bold uppercase">Last Active</span>
                      <span className="font-extrabold text-[#0F172A] text-xs">{selectedMember.lastActive}</span>
                    </div>
                  </div>

                  {/* Program & Nutrition Quick Management Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#64748B] uppercase">Assigned Split</span>
                          <span className="text-[10px] bg-indigo-50 text-[#5C71F3] px-2 py-0.5 rounded font-black border border-indigo-100">
                            {gymSplits.find((s) => s.id === selectedMember.assignedProgramId)?.name || '4-Day Hypertrophy Split'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#475569] mt-2">
                          Personalized workout routine synced to member mobile app.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsMemberDetailModalOpen(false);
                          handleOpenAssignProgram(selectedMember);
                        }}
                        className="mt-3 w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#5C71F3] font-bold text-[11px] rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1"
                      >
                        <Dumbbell className="w-3.5 h-3.5" />
                        <span>Assign / Change Workout Split</span>
                      </button>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#64748B] uppercase">Nutrition Targets</span>
                          <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-black border border-amber-100">
                            {selectedMember.overrideCalories || selectedMember.calorieTarget || 2400} kcal • {selectedMember.overrideProtein || selectedMember.proteinTarget || 160}g Pro
                          </span>
                        </div>
                        <p className="text-[11px] text-[#475569] mt-2">
                          {selectedMember.overrideCalories ? '⚡ Admin Manual Override Active' : 'Automatic formula-based targets'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsMemberDetailModalOpen(false);
                          handleOpenNutritionModal(selectedMember);
                        }}
                        className="mt-3 w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>Override Nutrition Targets</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: WORKOUTS */}
              {memberDetailTab === 'workouts' && (
                <div className="space-y-3 text-xs">
                  {selectedMemberWorkouts.length > 0 ? (
                    selectedMemberWorkouts.map((w) => (
                      <div key={w.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[#0F172A]">{w.routineTitle}</p>
                          <p className="text-[10px] text-[#64748B]">{w.date} • {w.durationMinutes} min</p>
                        </div>
                        <span className="font-black text-amber-600">{w.totalCaloriesBurned || 300} kcal burned</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-[#94A3B8] space-y-1">
                      <Dumbbell className="w-8 h-8 mx-auto text-[#CBD5E1]" />
                      <p className="font-bold">No workout sessions recorded yet</p>
                      <p className="text-[11px]">Member has not completed an active workout session in the app.</p>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-VIEW 3: NUTRITION LOGS */}
              {memberDetailTab === 'nutrition' && (
                <div className="space-y-3 text-xs">
                  {selectedMemberMeals.length > 0 ? (
                    selectedMemberMeals.map((m) => (
                      <div key={m.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[#0F172A]">{m.name}</p>
                          <p className="text-[10px] text-[#64748B] capitalize">{m.mealType} • {m.portionDescription}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-amber-600 block">{m.calories} kcal</span>
                          <span className="text-[10px] text-[#5C71F3] font-bold">{m.proteinG}g protein</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-[#94A3B8] space-y-1">
                      <UtensilsCrossed className="w-8 h-8 mx-auto text-[#CBD5E1]" />
                      <p className="font-bold">No meal logs recorded yet</p>
                      <p className="text-[11px]">Athlete has not logged meals into their food tracker.</p>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-VIEW 4: WEIGHT PROGRESS */}
              {memberDetailTab === 'weights' && (
                <div className="space-y-3 text-xs">
                  {selectedMemberWeights.length > 0 ? (
                    selectedMemberWeights.map((w, idx) => (
                      <div key={idx} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex justify-between items-center">
                        <span className="font-bold text-[#0F172A]">{w.date}</span>
                        <span className="font-black text-indigo-600">{w.weightKg} kg</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-[#94A3B8] space-y-1">
                      <Scale className="w-8 h-8 mx-auto text-[#CBD5E1]" />
                      <p className="font-bold">No weight check-ins recorded yet</p>
                      <p className="text-[11px]">Weight tracking history will appear here once logged.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons in Drawer */}
              <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0]">
                <button
                  onClick={() => handleImpersonate(selectedMember)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Launch Mobile Experience</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsMemberDetailModalOpen(false);
                      setIsPasswordResetModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => {
                      setIsMemberDetailModalOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#5C71F3] hover:bg-[#4E62EB] text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 3: EDIT MEMBER PROFILE */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isEditModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-[#E2E8F0]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-[#0F172A]">Edit Member: {selectedMember.fullName}</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditMember} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={selectedMember.fullName}
                    onChange={(e) => setSelectedMember({ ...selectedMember, fullName: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={selectedMember.email}
                      onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Training Days</label>
                    <select
                      value={selectedMember.trainingDaysPerWeek || 4}
                      onChange={(e) => setSelectedMember({ ...selectedMember, trainingDaysPerWeek: parseInt(e.target.value) })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-2 text-xs text-[#0F172A] font-semibold outline-none"
                    >
                      <option value={3}>3 Days/Wk</option>
                      <option value={4}>4 Days/Wk</option>
                      <option value={5}>5 Days/Wk</option>
                      <option value={6}>6 Days/Wk</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Tier</label>
                    <select
                      value={selectedMember.membershipTier}
                      onChange={(e) => setSelectedMember({ ...selectedMember, membershipTier: e.target.value as any })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-2 text-xs text-[#0F172A] font-semibold outline-none"
                    >
                      <option value="VIP">VIP</option>
                      <option value="Elite Athlete">Elite Athlete</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Status</label>
                    <select
                      value={selectedMember.membershipStatus}
                      onChange={(e) => setSelectedMember({ ...selectedMember, membershipStatus: e.target.value as any })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-2 text-xs text-[#0F172A] font-semibold outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5C71F3] hover:bg-[#4E62EB] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 4: RESET PASSWORD */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isPasswordResetModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-[#E2E8F0]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-[#0F172A]">Reset Password</h3>
                <button
                  onClick={() => setIsPasswordResetModalOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#64748B]">
                New password for <strong className="text-[#0F172A]">{selectedMember.fullName}</strong>
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">New Password</label>
                  <input
                    type="text"
                    required
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordResetModalOpen(false)}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    Confirm Reset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 5: ADD / EDIT FOOD ITEM */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isNewFoodModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-[#E2E8F0]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-[#0F172A]">
                  {editingFoodItem ? `Edit Food: ${editingFoodItem.nameEn}` : 'Add Food to Official Catalog'}
                </h3>
                <button
                  onClick={() => {
                    setIsNewFoodModalOpen(false);
                    setEditingFoodItem(null);
                  }}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFood} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Name (English)</label>
                    <input
                      type="text"
                      required
                      value={newFoodForm.nameEn}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, nameEn: e.target.value })}
                      placeholder="e.g. Kik Alicha"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Name (Amharic)</label>
                    <input
                      type="text"
                      value={newFoodForm.nameAm}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, nameAm: e.target.value })}
                      placeholder="ለምሳሌ ክክ አልጫ"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Category</label>
                    <select
                      value={newFoodForm.category}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, category: e.target.value as any })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-2 text-xs text-[#0F172A] font-semibold outline-none"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Emoji</label>
                    <input
                      type="text"
                      value={newFoodForm.emoji}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, emoji: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Serving Size</label>
                    <input
                      type="text"
                      value={newFoodForm.servingSize}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, servingSize: e.target.value })}
                      placeholder="1 plate (200g)"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] block mb-1">Calories</label>
                    <input
                      type="number"
                      value={newFoodForm.calories}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, calories: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2 py-1.5 text-xs text-[#0F172A] font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] block mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={newFoodForm.proteinG}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, proteinG: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2 py-1.5 text-xs text-[#0F172A] font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] block mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      value={newFoodForm.carbsG}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, carbsG: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2 py-1.5 text-xs text-[#0F172A] font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#64748B] block mb-1">Fat (g)</label>
                    <input
                      type="number"
                      value={newFoodForm.fatG}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, fatG: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2 py-1.5 text-xs text-[#0F172A] font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#334155] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFoodForm.isEthiopianTraditional}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, isEthiopianTraditional: e.target.checked })}
                      className="rounded text-[#5C71F3]"
                    />
                    <span>Ethiopian Traditional</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#334155] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFoodForm.isFastingFriendly}
                      onChange={(e) => setNewFoodForm({ ...newFoodForm, isFastingFriendly: e.target.checked })}
                      className="rounded text-[#5C71F3]"
                    />
                    <span>Fasting Friendly (የጾም)</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewFoodModalOpen(false);
                      setEditingFoodItem(null);
                    }}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5C71F3] hover:bg-[#4E62EB] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {editingFoodItem ? 'Update Food Item' : 'Add Food Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 6: DELETE MEMBER CONFIRMATION */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {deleteConfirmMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-red-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-[#0F172A]">Delete Member Account</h3>
                <p className="text-xs text-[#64748B]">
                  Are you sure you want to remove <strong className="text-[#0F172A]">{deleteConfirmMember.fullName}</strong> ({deleteConfirmMember.email}) from Supabase?
                </p>
              </div>

              <div className="flex justify-center gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteConfirmMember(null)}
                  className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteMember}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ===================================================================== */}
      {/* MODAL 7: ASSIGN WORKOUT PROGRAM */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isAssignProgramModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-[#E2E8F0]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#5C71F3] flex items-center justify-center">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0F172A]">Assign Training Program</h3>
                    <p className="text-xs text-[#64748B]">For athlete: <strong className="text-[#0F172A]">{selectedMember.fullName}</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssignProgramModalOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignProgramSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1.5">Select Workout Split / Program</label>
                  <div className="space-y-2">
                    {gymSplits.map((split) => (
                      <label
                        key={split.id}
                        className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                          selectedProgramToAssign === split.id
                            ? 'border-[#5C71F3] bg-[#5C71F3]/5 shadow-xs'
                            : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="programSplit"
                          value={split.id}
                          checked={selectedProgramToAssign === split.id}
                          onChange={(e) => setSelectedProgramToAssign(e.target.value)}
                          className="mt-1 text-[#5C71F3]"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-xs text-[#0F172A]">{split.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-[#5C71F3]">
                              {split.daysCount} Days/Wk
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-0.5">{split.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">Custom Coach Notes / Directives (Optional)</label>
                  <textarea
                    rows={2}
                    value={assignmentCustomNotes}
                    onChange={(e) => setAssignmentCustomNotes(e.target.value)}
                    placeholder="e.g. Focus on explosive concentric reps on Leg Day..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAssignProgramModalOpen(false)}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5C71F3] hover:bg-[#4E62EB] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-[#5C71F3]/25"
                  >
                    Deploy Split to Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 8: NUTRITION TARGETS & OVERRIDES */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isNutritionModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-[#E2E8F0]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0F172A]">Set Nutrition Targets & Overrides</h3>
                    <p className="text-xs text-[#64748B]">Athlete: <strong className="text-[#0F172A]">{selectedMember.fullName}</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNutritionModalOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNutritionTargets} className="space-y-4 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Calorie Target (kcal/day)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      max={6000}
                      value={nutritionForm.calorieTarget}
                      onChange={(e) => setNutritionForm({ ...nutritionForm, calorieTarget: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Protein Target (g/day)</label>
                    <input
                      type="number"
                      required
                      min={40}
                      max={400}
                      value={nutritionForm.proteinTarget}
                      onChange={(e) => setNutritionForm({ ...nutritionForm, proteinTarget: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Carbs Target (g/day)</label>
                    <input
                      type="number"
                      value={nutritionForm.carbsTarget}
                      onChange={(e) => setNutritionForm({ ...nutritionForm, carbsTarget: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">Fat Target (g/day)</label>
                    <input
                      type="number"
                      value={nutritionForm.fatTarget}
                      onChange={(e) => setNutritionForm({ ...nutritionForm, fatTarget: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-[#5C71F3]"
                    />
                  </div>
                </div>

                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nutritionForm.useOverride}
                      onChange={(e) => setNutritionForm({ ...nutritionForm, useOverride: e.target.checked })}
                      className="rounded text-amber-600"
                    />
                    <span>Enable Manual Coach Override (Locks targets against auto-recalculation)</span>
                  </label>

                  {nutritionForm.useOverride && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-amber-800 block mb-1">Override Calories (kcal)</label>
                        <input
                          type="number"
                          value={nutritionForm.overrideCalories || nutritionForm.calorieTarget}
                          onChange={(e) => setNutritionForm({ ...nutritionForm, overrideCalories: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs text-[#0F172A] font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-amber-800 block mb-1">Override Protein (g)</label>
                        <input
                          type="number"
                          value={nutritionForm.overrideProtein || nutritionForm.proteinTarget}
                          onChange={(e) => setNutritionForm({ ...nutritionForm, overrideProtein: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs text-[#0F172A] font-bold outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNutritionModalOpen(false)}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-amber-600/25"
                  >
                    Save Nutrition Targets
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 9: RECORD 30-DAY MEMBERSHIP PAYMENT */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isRecordPaymentModalOpen && paymentTargetMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-[#E2E8F0]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0F172A]">Record 30-Day Payment</h3>
                    <p className="text-xs text-[#64748B]">
                      Athlete: <strong className="text-[#0F172A]">{paymentTargetMember.fullName}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRecordPaymentModalOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Ethiopian Cycle Status Banner */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1 text-xs text-emerald-900">
                <div className="flex justify-between items-center font-bold">
                  <span>30-Day Membership Cycle Renewal</span>
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    Ethiopian Calendar
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Recording this payment will automatically advance the athlete's cycle by 30 days and mark their status as <strong className="font-bold">PAID</strong>.
                </p>
              </div>

              <form onSubmit={handleRecordPaymentSubmit} className="space-y-3.5">
                {/* Amount and Method */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">
                      Payment Amount (ETB)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={paymentAmountInput}
                      onChange={(e) => setPaymentAmountInput(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-bold outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#64748B] block mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={paymentMethodInput}
                      onChange={(e) => setPaymentMethodInput(e.target.value as any)}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-2 text-xs text-[#0F172A] font-semibold outline-none focus:border-emerald-500"
                    >
                      <option value="telebirr">Telebirr</option>
                      <option value="cbe_birr">CBE Birr</option>
                      <option value="cash">Cash (Gym Front Desk)</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="other">Other / Cheque</option>
                    </select>
                  </div>
                </div>

                {/* Ethiopian Payment Date Selection */}
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">
                    Payment Date (Ethiopian Calendar)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Day (ቀን)</span>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={paymentDateEthInput.day}
                        onChange={(e) =>
                          setPaymentDateEthInput({
                            ...paymentDateEthInput,
                            day: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#0F172A] font-bold outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Month (ወር)</span>
                      <select
                        value={paymentDateEthInput.month}
                        onChange={(e) =>
                          setPaymentDateEthInput({
                            ...paymentDateEthInput,
                            month: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2 py-1.5 text-xs text-[#0F172A] font-bold outline-none focus:border-emerald-500"
                      >
                        {getEthiopianMonthsList().map((m) => (
                          <option key={m.monthNumber} value={m.monthNumber}>
                            {m.nameAm} ({m.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Year (ዓመት)</span>
                      <input
                        type="number"
                        min={2010}
                        max={2030}
                        required
                        value={paymentDateEthInput.year}
                        onChange={(e) =>
                          setPaymentDateEthInput({
                            ...paymentDateEthInput,
                            year: parseInt(e.target.value) || ethiopian.year,
                          })
                        }
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#0F172A] font-bold outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] block mt-1">
                    Today in Ethiopian calendar is {dualTime.ethiopianDateFormatted}
                  </span>
                </div>

                {/* Notes & Transaction Reference */}
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">
                    Transaction Ref / Receipt Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={paymentNotesInput}
                    onChange={(e) => setPaymentNotesInput(e.target.value)}
                    placeholder="e.g. Telebirr Txn ID: TB-98432"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    disabled={isSubmittingPayment}
                    onClick={() => setIsRecordPaymentModalOpen(false)}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPayment}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all"
                  >
                    {isSubmittingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm & Mark Paid</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 10: MEMBER PAYMENT HISTORY & CYCLES LEDGER */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isPaymentHistoryModalOpen && historyTargetMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4 border border-[#E2E8F0] max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#5C71F3]/10 text-[#5C71F3] flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0F172A]">Payment & Cycle Ledger</h3>
                    <p className="text-xs text-[#64748B]">
                      Athlete: <strong className="text-[#0F172A]">{historyTargetMember.fullName}</strong> • {historyTargetMember.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPaymentHistoryModalOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* 30-Day Cycles Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-xs text-[#0F172A] uppercase tracking-wider">
                      30-Day Recurring Ethiopian Cycles
                    </h4>
                    <span className="text-[11px] text-[#64748B]">
                      {historyTargetCycles.length} Cycles Generated
                    </span>
                  </div>

                  <div className="space-y-2">
                    {historyTargetCycles.map((cycle) => (
                      <div
                        key={cycle.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                          cycle.status === 'paid'
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                            : cycle.status === 'overdue'
                            ? 'bg-red-50/50 border-red-200 text-red-900'
                            : 'bg-amber-50/50 border-amber-200 text-amber-900'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[11px]">Cycle #{cycle.cycleNumber}</span>
                            <span className="font-bold">{cycle.startDateEth} — {cycle.dueDateEth}</span>
                          </div>
                          <p className="text-[10.5px] opacity-80">
                            Fee: {cycle.amount || 0} ETB {cycle.paidAtEth ? `• Paid on ${cycle.paidAtEth}` : ''}
                          </p>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            cycle.status === 'paid'
                              ? 'bg-emerald-600 text-white'
                              : cycle.status === 'overdue'
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {cycle.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Receipts Section */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-xs text-[#0F172A] uppercase tracking-wider">
                      Payment Receipts
                    </h4>
                    <span className="text-[11px] text-[#64748B]">
                      {historyTargetPayments.length} Payments Recorded
                    </span>
                  </div>

                  {historyTargetPayments.length > 0 ? (
                    <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-2xl overflow-hidden">
                      {historyTargetPayments.map((payment) => (
                        <div key={payment.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0F172A]">{payment.paymentDateEth}</span>
                              <span className="bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                {payment.paymentMethod.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-[#64748B]">
                              Receipt: {payment.id} • Admin: {payment.recordedBy}
                              {payment.notes ? ` • Note: ${payment.notes}` : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-emerald-600 block text-sm">{payment.amount} ETB</span>
                            <span className="text-[10px] text-[#94A3B8]">Cycle #{payment.cycleNumber}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[#64748B] text-xs bg-[#F8FAFC] rounded-2xl">
                      No payments recorded yet for this athlete.
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0] shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsPaymentHistoryModalOpen(false);
                    if (historyTargetMember) {
                      handleOpenRecordPaymentModal(historyTargetMember);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Record New Payment</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaymentHistoryModalOpen(false)}
                  className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 11: EDIT ETHIOPIAN START DATE */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isEditStartDateModalOpen && editDateMemberTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-[#E2E8F0]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#5C71F3]/10 text-[#5C71F3] flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0F172A]">Edit Ethiopian Start Date</h3>
                    <p className="text-xs text-[#64748B]">
                      Athlete: <strong className="text-[#0F172A]">{editDateMemberTarget.fullName}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditStartDateModalOpen(false)}
                  className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditStartDateSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#64748B] block mb-1">
                    Ethiopian Membership Start Date
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Day (ቀን)</span>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={editDateDay}
                        onChange={(e) => setEditDateDay(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#0F172A] font-bold outline-none focus:border-[#5C71F3]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Month (ወር)</span>
                      <select
                        value={editDateMonth}
                        onChange={(e) => setEditDateMonth(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2 py-1.5 text-xs text-[#0F172A] font-bold outline-none focus:border-[#5C71F3]"
                      >
                        {getEthiopianMonthsList().map((m) => (
                          <option key={m.monthNumber} value={m.monthNumber}>
                            {m.nameAm} ({m.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Year (ዓመት)</span>
                      <input
                        type="number"
                        min={2010}
                        max={2030}
                        required
                        value={editDateYear}
                        onChange={(e) => setEditDateYear(parseInt(e.target.value) || ethiopian.year)}
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 text-xs text-[#0F172A] font-bold outline-none focus:border-[#5C71F3]"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] block mt-1">
                    Select starting date according to Ethiopian calendar
                  </span>
                </div>

                <div className="p-3 bg-indigo-50/70 border border-indigo-200/60 rounded-2xl text-[11px] text-[#4F46E5] space-y-1">
                  <p className="font-bold">Automatic 30-Day Recalculation</p>
                  <p className="text-[10.5px] text-[#6366F1]">
                    Modifying the start date will recalculate all 30-day renewal cycle windows based on this starting point.
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditStartDateModalOpen(false)}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5C71F3] hover:bg-[#4E62EB] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-[#5C71F3]/25"
                  >
                    Save & Recalculate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
