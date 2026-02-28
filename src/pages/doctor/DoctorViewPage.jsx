import clsx from "clsx";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Stethoscope,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { getDoctorById } from "../../services/userService";
import { getAllPatients } from "../../services/patientService";
import { getAppointmentsByDoctor } from "../../services/appointmentService";
import { getPrescriptionsByDoctor } from "../../services/prescriptionService";
import {
  getDiagnosisByDoctor,
  createDiagnosis,
} from "../../services/diagnosisService";
import { formatDate, formatDateTime } from "../../utils/formatters";

const tabs = [
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "prescriptions", label: "Prescriptions", icon: ClipboardList },
  { key: "diagnosis", label: "Diagnosis History", icon: Activity },
  { key: "analytics", label: "Analytics", icon: Activity },
];

function DoctorViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctorId = Number(id);

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("appointments");

  const [patients, setPatients] = useState([]);
  const [appointmentRows, setAppointmentRows] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const [prescriptionRows, setPrescriptionRows] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(true);

  const [diagnosisRows, setDiagnosisRows] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [diagnosisLoading, setDiagnosisLoading] = useState(true);

  const [diagnosisForm, setDiagnosisForm] = useState({
    patient_id: "",
    symptoms: "",
    diagnosis: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError(null);
        const [doctorData, patientsData] = await Promise.all([
          getDoctorById(doctorId),
          getAllPatients(),
        ]);
        setDoctor(doctorData);
        setPatients(patientsData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load doctor data. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setAppointmentsLoading(true);
        const data = await getAppointmentsByDoctor(doctorId);
        setAppointmentRows(data);
      } catch {
        setAppointmentRows([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setPrescriptionsLoading(true);
        const data = await getPrescriptionsByDoctor(doctorId);
        setPrescriptionRows(data);
      } catch {
        setPrescriptionRows([]);
      } finally {
        setPrescriptionsLoading(false);
      }
    };
    fetchPrescriptions();
  }, [doctorId]);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        setAnalyticsLoading(true);
        setDiagnosisLoading(true);
        const data = await getDiagnosisByDoctor(doctorId);
        const rows = Array.isArray(data) ? data : data?.data || [];
        setDiagnosisRows(rows);
      } catch {
        setDiagnosisRows([]);
      } finally {
        setAnalyticsLoading(false);
        setDiagnosisLoading(false);
      }
    };
    fetchDiagnosis();
  }, [doctorId]);

  const fetchDiagnosisRefresh = async () => {
    try {
      setDiagnosisLoading(true);
      const data = await getDiagnosisByDoctor(doctorId);
      const rows = Array.isArray(data) ? data : data?.data || [];
      setDiagnosisRows(rows);
    } catch {
      setDiagnosisRows([]);
    } finally {
      setDiagnosisLoading(false);
    }
  };

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((entry) => [entry.id, entry.name])),
    [patients],
  );

  const mostRecentAppointmentDate = useMemo(() => {
    if (!appointmentRows.length) return "N/A";
    const sorted = [...appointmentRows].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    return formatDate(sorted[0].date);
  }, [appointmentRows]);

  const mostRecentPrescriptionDate = useMemo(() => {
    if (!prescriptionRows.length) return "N/A";
    const sorted = [...prescriptionRows].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
    return formatDateTime(sorted[0].created_at);
  }, [prescriptionRows]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#bfdbfe_0,_#eff6ff_35%,_#f8fbff_100%)] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        </div>
      </div>
    );

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#bfdbfe_0,_#eff6ff_35%,_#f8fbff_100%)] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 text-sm text-slate-700 shadow-sm">
            Doctor record not found for ID: {id}
          </div>
        </div>
      </div>
    );
  }

  const appointmentColumns = [
    {
      key: "patient",
      label: "Patient Name",
      render: (row) => patientMap[row.patient_id] || "Unknown Patient",
    },
    {
      key: "date",
      label: "Date",
      render: (row) => formatDate(row.date),
    },
    { key: "time", label: "Time" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const prescriptionColumns = [
    {
      key: "patient",
      label: "Patient Name",
      render: (row) => patientMap[row.patient_id] || "Unknown Patient",
    },
    { key: "medicines", label: "Medicines" },
    { key: "dosage", label: "Dosage" },
    { key: "notes", label: "Notes" },
    {
      key: "date",
      label: "Date",
      render: (row) => formatDateTime(row.created_at),
    },
  ];

  const diagnosisColumns = [
    {
      key: "patient",
      label: "Patient Name",
      render: (row) =>
        row.patient_name || patientMap[row.patient_id] || "Unknown Patient",
    },
    { key: "symptoms", label: "Symptoms" },
    { key: "diagnosis", label: "Diagnosis" },
    {
      key: "date",
      label: "Date",
      render: (row) => formatDateTime(row.created_at),
    },
  ];

  const handleDiagnosisChange = (event) => {
    setDiagnosisForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleDiagnosisSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      await createDiagnosis({
        patient_id: Number(diagnosisForm.patient_id),
        doctor_id: doctorId,
        symptoms: diagnosisForm.symptoms,
        diagnosis: diagnosisForm.diagnosis,
      });
      setDiagnosisForm({ patient_id: "", symptoms: "", diagnosis: "" });
      setSubmitSuccess("Diagnosis added successfully");
      await fetchDiagnosisRefresh();
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Failed to add diagnosis. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#bfdbfe_0,_#eff6ff_35%,_#f8fbff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          &larr; Back to Home
        </button>

        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2.5">
              <Stethoscope className="h-5 w-5 text-blue-700" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Doctor Info
            </h2>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Name
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{doctor.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Email
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{doctor.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Specialty
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                {doctor.specialty || "N/A"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const selected = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition",
                    selected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50",
                  )}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "appointments" ? (
            appointmentsLoading ? (
              <LoadingSpinner />
            ) : (
              <DataTable
                loading={false}
                columns={appointmentColumns}
                rows={appointmentRows}
                emptyTitle="No appointments found"
                emptyMessage="This doctor has no appointment records yet."
              />
            )
          ) : null}

          {activeTab === "prescriptions" ? (
            prescriptionsLoading ? (
              <LoadingSpinner />
            ) : (
              <DataTable
                loading={false}
                columns={prescriptionColumns}
                rows={prescriptionRows}
                emptyTitle="No prescriptions found"
                emptyMessage="This doctor has no prescription records yet."
              />
            )
          ) : null}

          {activeTab === "diagnosis" ? (
            diagnosisLoading ? (
              <LoadingSpinner />
            ) : (
              <DataTable
                loading={false}
                columns={diagnosisColumns}
                rows={diagnosisRows}
                emptyTitle="No diagnosis found"
                emptyMessage="This doctor has no diagnosis records yet."
              />
            )
          ) : null}

          {activeTab === "analytics" ? (
            analyticsLoading || appointmentsLoading || prescriptionsLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  title="Total Appointments"
                  value={appointmentRows.length}
                  icon={CalendarDays}
                />
                <StatCard
                  title="Total Prescriptions"
                  value={prescriptionRows.length}
                  icon={ClipboardList}
                />
                <StatCard
                  title="Total Diagnoses"
                  value={diagnosisRows.length}
                  icon={Activity}
                />
                <StatCard
                  title="Most Recent Appointment"
                  value={mostRecentAppointmentDate}
                  icon={CalendarDays}
                />
                <StatCard
                  title="Most Recent Prescription"
                  value={mostRecentPrescriptionDate}
                  icon={ClipboardList}
                />
              </div>
            )
          ) : null}
        </section>

        {activeTab === "diagnosis" && (
          <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Add Diagnosis
            </h3>

            {submitSuccess && (
              <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {submitError}
              </div>
            )}

            <form onSubmit={handleDiagnosisSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="patient_id"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  patient
                </label>
                <select
                  id="patient_id"
                  name="patient_id"
                  value={diagnosisForm.patient_id}
                  onChange={handleDiagnosisChange}
                  required
                  className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="symptoms"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  symptoms
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={diagnosisForm.symptoms}
                  onChange={handleDiagnosisChange}
                  placeholder="symptoms"
                  rows={3}
                  required
                  className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="diagnosis"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  diagnosis
                </label>
                <textarea
                  id="diagnosis"
                  name="diagnosis"
                  value={diagnosisForm.diagnosis}
                  onChange={handleDiagnosisChange}
                  placeholder="diagnosis"
                  rows={3}
                  required
                  className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Diagnosis"}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default DoctorViewPage;
