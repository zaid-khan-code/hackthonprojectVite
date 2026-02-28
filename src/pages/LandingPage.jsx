import {
  ClipboardList,
  HeartPulse,
  Shield,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPatients } from "../services/patientService";
import { getAllDoctors } from "../services/userService";

const roleCards = [
  { label: "Admin", icon: Shield, path: "/admin" },
  { label: "Doctor", icon: Stethoscope, path: null },
  { label: "Receptionist", icon: ClipboardList, path: "/receptionist" },
  { label: "Patient", icon: User, path: null },
];

function LandingPage() {
  const navigate = useNavigate();
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState(null);

  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);

  const openPatientModal = async () => {
    setShowPatientModal(true);
    try {
      setPatientsLoading(true);
      setPatientsError(null);
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      setPatientsError(
        err.response?.data?.message || "Failed to load patients.",
      );
    } finally {
      setPatientsLoading(false);
    }
  };

  const openDoctorModal = async () => {
    setShowDoctorModal(true);
    try {
      setDoctorsLoading(true);
      setDoctorsError(null);
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (err) {
      setDoctorsError(err.response?.data?.message || "Failed to load doctors.");
    } finally {
      setDoctorsLoading(false);
    }
  };

  const handleCardClick = (card) => {
    if (card.label === "Patient") {
      openPatientModal();
    } else if (card.label === "Doctor") {
      openDoctorModal();
    } else {
      navigate(card.path);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#bfdbfe_0,_#eff6ff_35%,_#f8fbff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white/95 p-8 shadow-lg sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
                <HeartPulse className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Clinic Management Platform
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                CareBridge Medical Center
              </h1>
              <p className="mt-4 max-w-2xl text-slate-600">
                Centralized portal for administrators, doctors, receptionists,
                and patients. Track appointments, manage records, and keep
                clinical data organized in one secure system.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Quick Role Access
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Select a portal below to preview each role dashboard layout.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roleCards.map((card) => {
            const CardIcon = card.icon;
            return (
              <article
                key={card.label}
                className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3">
                  <CardIcon className="h-5 w-5 text-blue-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {card.label}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Open {card.label.toLowerCase()} dashboard
                </p>
                <button
                  type="button"
                  onClick={() => handleCardClick(card)}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Open {card.label}
                </button>
              </article>
            );
          })}
        </section>

        {showPatientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-blue-100 bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Select a Patient
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPatientModal(false)}
                  className="rounded-lg border border-blue-100 p-1.5 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {patientsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                </div>
              ) : patientsError ? (
                <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {patientsError}
                </p>
              ) : patients.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No patients found.
                </p>
              ) : (
                <div className="max-h-96 space-y-3 overflow-y-auto">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/40 p-4"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900">
                          {patient.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Age: {patient.age} &middot; {patient.gender} &middot;{" "}
                          {patient.contact}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPatientModal(false);
                          navigate(`/patient/view/${patient.id}`);
                        }}
                        className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showDoctorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-blue-100 bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Select a Doctor
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="rounded-lg border border-blue-100 p-1.5 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {doctorsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                </div>
              ) : doctorsError ? (
                <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {doctorsError}
                </p>
              ) : doctors.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No doctors found.
                </p>
              ) : (
                <div className="max-h-96 space-y-3 overflow-y-auto">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/40 p-4"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900">
                          {doctor.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doctor.email} &middot;{" "}
                          {doctor.specialty || "No specialty"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDoctorModal(false);
                          navigate(`/doctor/view/${doctor.id}`);
                        }}
                        className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
