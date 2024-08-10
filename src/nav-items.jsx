import { Home, Users, Clock, DollarSign, BarChart2, UserPlus, Settings, FileText, PieChart, Folder, Workflow } from "lucide-react";
import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmployeeManagement from "./pages/EmployeeManagement.jsx";
import AttendanceTracking from "./pages/AttendanceTracking.jsx";
import PayrollManagement from "./pages/PayrollManagement.jsx";
import PerformanceManagement from "./pages/PerformanceManagement.jsx";
import RecruitmentOnboarding from "./pages/RecruitmentOnboarding.jsx";
import BenefitsAdministration from "./pages/BenefitsAdministration.jsx";
import ComplianceReporting from "./pages/ComplianceReporting.jsx";
import ReportingAnalytics from "./pages/ReportingAnalytics.jsx";
import DocumentManagement from "./pages/DocumentManagement.jsx";
import WorkflowAutomation from "./pages/WorkflowAutomation.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Login",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
    roles: ['admin', 'manager', 'employee', 'hr'],
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <PieChart className="h-4 w-4" />,
    page: <Dashboard />,
    roles: ['admin', 'manager', 'employee', 'hr'],
  },
  {
    title: "Employee Management",
    to: "/employee-management",
    icon: <Users className="h-4 w-4" />,
    page: <EmployeeManagement />,
  },
  {
    title: "Attendance Tracking",
    to: "/attendance-tracking",
    icon: <Clock className="h-4 w-4" />,
    page: <AttendanceTracking />,
  },
  {
    title: "Payroll Management",
    to: "/payroll-management",
    icon: <DollarSign className="h-4 w-4" />,
    page: <PayrollManagement />,
  },
  {
    title: "Performance Management",
    to: "/performance-management",
    icon: <BarChart2 className="h-4 w-4" />,
    page: <PerformanceManagement />,
  },
  {
    title: "Recruitment & Onboarding",
    to: "/recruitment-onboarding",
    icon: <UserPlus className="h-4 w-4" />,
    page: <RecruitmentOnboarding />,
  },
  {
    title: "Benefits Administration",
    to: "/benefits-administration",
    icon: <Settings className="h-4 w-4" />,
    page: <BenefitsAdministration />,
  },
  {
    title: "Compliance & Reporting",
    to: "/compliance-reporting",
    icon: <FileText className="h-4 w-4" />,
    page: <ComplianceReporting />,
  },
  {
    title: "Reporting & Analytics",
    to: "/reporting-analytics",
    icon: <PieChart className="h-4 w-4" />,
    page: <ReportingAnalytics />,
  },
  {
    title: "Document Management",
    to: "/document-management",
    icon: <Folder className="h-4 w-4" />,
    page: <DocumentManagement />,
  },
  {
    title: "Workflow Automation",
    to: "/workflow-automation",
    icon: <Workflow className="h-4 w-4" />,
    page: <WorkflowAutomation />,
  },
];
