import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";
import {
  adminNavItems,
  doctorNavItems,
  patientNavItems,
  receptionistNavItems,
} from "./config/navigation";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPatientsPage from "./pages/admin/AdminPatientsPage";
import ManageDoctorsPage from "./pages/admin/ManageDoctorsPage";
import ManageReceptionistsPage from "./pages/admin/ManageReceptionistsPage";
import DoctorAnalyticsPage from "./pages/doctor/DoctorAnalyticsPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
import DoctorDashboardPage from "./pages/doctor/DoctorDashboardPage";
import DoctorViewPage from "./pages/doctor/DoctorViewPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MyAppointmentsPage from "./pages/patient/MyAppointmentsPage";
import MyPrescriptionsPage from "./pages/patient/MyPrescriptionsPage";
import PatientDashboardPage from "./pages/patient/PatientDashboardPage";
import PatientProfilePage from "./pages/patient/PatientProfilePage";
import PatientViewPage from "./pages/patient/PatientViewPage";
import AppointmentsPage from "./pages/receptionist/AppointmentsPage";
import PatientsPage from "./pages/receptionist/PatientsPage";
import ReceptionistDashboardPage from "./pages/receptionist/ReceptionistDashboardPage";
import NotFoundPage from "./pages/shared/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/patient/view/:id" element={<PatientViewPage />} />
      <Route path="/doctor/view/:id" element={<DoctorViewPage />} />

      <Route
        element={
          <DashboardLayout portalName="Admin Panel" navItems={adminNavItems} />
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/doctors" element={<ManageDoctorsPage />} />
        <Route
          path="/admin/receptionists"
          element={<ManageReceptionistsPage />}
        />
        <Route path="/admin/patients" element={<AdminPatientsPage />} />
      </Route>

      <Route
        element={
          <DashboardLayout
            portalName="Receptionist Panel"
            navItems={receptionistNavItems}
          />
        }
      >
        <Route path="/receptionist" element={<ReceptionistDashboardPage />} />
        <Route path="/receptionist/patients" element={<PatientsPage />} />
        <Route
          path="/receptionist/appointments"
          element={<AppointmentsPage />}
        />
      </Route>

      <Route
        element={
          <DashboardLayout
            portalName="Doctor Panel"
            navItems={doctorNavItems}
          />
        }
      >
        <Route path="/doctor" element={<DoctorDashboardPage />} />
        <Route
          path="/doctor/appointments"
          element={<DoctorAppointmentsPage />}
        />
        <Route path="/doctor/analytics" element={<DoctorAnalyticsPage />} />
        <Route path="/patient/:id" element={<PatientProfilePage />} />
      </Route>

      <Route
        element={
          <DashboardLayout
            portalName="Patient Panel"
            navItems={patientNavItems}
          />
        }
      >
        <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
        <Route path="/patient/appointments" element={<MyAppointmentsPage />} />
        <Route
          path="/patient/prescriptions"
          element={<MyPrescriptionsPage />}
        />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
}

export default App;
