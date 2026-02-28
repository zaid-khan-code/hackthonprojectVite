import clsx from "clsx";
import { Activity, CalendarDays, ClipboardList, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatusBadge from "../../components/ui/StatusBadge";
import { getPatientById } from "../../services/patientService";
import { getAppointmentsByPatient } from "../../services/appointmentService";
import { getPrescriptionsByPatient } from "../../services/prescriptionService";
import {
  getDiagnosisByPatient,
  createDiagnosis,
} from "../../services/diagnosisService";
import { getAllDoctors } from "../../services/userService";
import { formatDate, formatDateTime } from "../../utils/formatters";

const tabs = [
  { key: "appointments", label: "My Appointments", icon: CalendarDays },
  { key: "prescriptions", label: "My Prescriptions", icon: ClipboardList },
  { key: "diagnosis", label: "Diagnosis History", icon: Activity },
];

function PatientViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patientId = Number(id);

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("appointments");

  const [appointmentRows, setAppointmentRows] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const [prescriptionRows, setPrescriptionRows] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(true);

  const [doctors, setDoctors] = useState([]);

  const [diagnosisRows, setDiagnosisRows] = useState([]);
  const [diagnosisLoading, setDiagnosisLoading] = useState(true);

  const [diagnosisForm, setDiagnosisForm] = useState({
    doctor_id: "",
    symptoms: "",
    diagnosis: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError(null);
        const [patientData, doctorsData] = await Promise.all([
          getPatientById(patientId),
          getAllDoctors(),
        ]);
        setPatient(patientData);
        setDoctors(doctorsData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load patient data. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setAppointmentsLoading(true);
        const data = await getAppointmentsByPatient(patientId);
        setAppointmentRows(data);
      } catch {
        setAppointmentRows([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setPrescriptionsLoading(true);
        const data = await getPrescriptionsByPatient(patientId);
        setPrescriptionRows(data);
      } catch {
        setPrescriptionRows([]);
      } finally {
        setPrescriptionsLoading(false);
      }
    };
    fetchPrescriptions();
  }, [patientId]);

  const fetchDiagnosis = async () => {
    try {
      setDiagnosisLoading(true);
      const data = await getDiagnosisByPatient(patientId);
      setDiagnosisRows(Array.isArray(data) ? data : data?.data || []);
    } catch {
      setDiagnosisRows([]);
    } finally {
      setDiagnosisLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnosis();
  }, [patientId]);

  const doctorMap = useMemo(
    () => Object.fromEntries(doctors.map((entry) => [entry.id, entry.name])),
    [doctors],
  );

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

  if (!patient) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#bfdbfe_0,_#eff6ff_35%,_#f8fbff_100%)] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 text-sm text-slate-700 shadow-sm">
            Patient record not found for ID: {id}
          </div>
        </div>
      </div>
    );
  }

  const appointmentColumns = [
    {
      key: "doctor",
      label: "Doctor Name",
      render: (row) => doctorMap[row.doctor_id] || "Unknown Doctor",
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
      key: "doctor",
      label: "Doctor Name",
      render: (row) => doctorMap[row.doctor_id] || "Unknown Doctor",
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
              <UserRound className="h-5 w-5 text-blue-700" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Patient Info
            </h2>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Name
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{patient.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Age
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{patient.age}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Gender
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{patient.gender}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Contact
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{patient.contact}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Blood Group
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                {patient.blood_group}
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
                emptyMessage="This patient has no appointment records yet."
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
                emptyMessage="This patient has no prescription records yet."
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
                emptyMessage="This patient has no diagnosis records yet."
              />
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
                  htmlFor="doctor_id"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  doctor
                </label>
                <select
                  id="doctor_id"
                  name="doctor_id"
                  value={diagnosisForm.doctor_id}
                  onChange={handleDiagnosisChange}
                  required
                  className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
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

export default PatientViewPage;
