import clsx from "clsx";
import { Activity, CalendarDays, ClipboardList, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { getPatientById } from "../../services/patientService";
import { getAppointmentsByPatient } from "../../services/appointmentService";
import {
  getPrescriptionsByPatient,
  createPrescription,
} from "../../services/prescriptionService";
import {
  getDiagnosisByPatient,
  createDiagnosis,
} from "../../services/diagnosisService";
import { getAllDoctors } from "../../services/userService";
import { formatDate, formatDateTime } from "../../utils/formatters";

const tabs = [
  { key: "appointments", label: "Appointment History", icon: CalendarDays },
  { key: "prescriptions", label: "Prescription History", icon: ClipboardList },
  { key: "diagnosis", label: "Diagnosis History", icon: Activity },
];

function PatientProfilePage() {
  const { id } = useParams();
  const patientId = Number(id);

  const [patient, setPatient] = useState(null);
  const [appointmentRows, setAppointmentRows] = useState([]);
  const [prescriptionRows, setPrescriptionRows] = useState([]);
  const [diagnosisRows, setDiagnosisRows] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("appointments");
  const [prescriptionForm, setPrescriptionForm] = useState({
    doctor_id: "",
    medicines: "",
    dosage: "",
    notes: "",
  });
  const [diagnosisForm, setDiagnosisForm] = useState({
    doctor_id: "",
    symptoms: "",
    diagnosis: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(null);
  const [prescriptionError, setPrescriptionError] = useState(null);
  const [diagnosisSubmitting, setDiagnosisSubmitting] = useState(false);
  const [diagnosisSuccess, setDiagnosisSuccess] = useState(null);
  const [diagnosisError, setDiagnosisError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [
        patientData,
        appointmentsData,
        prescriptionsData,
        diagnosisData,
        doctorsData,
      ] = await Promise.all([
        getPatientById(patientId),
        getAppointmentsByPatient(patientId),
        getPrescriptionsByPatient(patientId),
        getDiagnosisByPatient(patientId),
        getAllDoctors(),
      ]);
      setPatient(patientData);
      setAppointmentRows(appointmentsData);
      setPrescriptionRows(prescriptionsData);
      setDiagnosisRows(diagnosisData);
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

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const doctorMap = useMemo(
    () => Object.fromEntries(doctors.map((entry) => [entry.id, entry.name])),
    [doctors],
  );

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );

  if (!patient) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-6 text-sm text-slate-700 shadow-sm">
        Patient record not found for ID: {id}
      </div>
    );
  }

  const appointmentColumns = [
    {
      key: "date",
      label: "Date",
      render: (row) => formatDate(row.date),
    },
    { key: "time", label: "Time" },
    {
      key: "doctor",
      label: "Doctor Name",
      render: (row) => doctorMap[row.doctor_id] || "Unknown Doctor",
    },
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
      render: (row) =>
        row.doctor_name || doctorMap[row.doctor_id] || "Unknown Doctor",
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
      key: "doctor",
      label: "Doctor Name",
      render: (row) => doctorMap[row.doctor_id] || "Unknown Doctor",
    },
    { key: "symptoms", label: "Symptoms" },
    { key: "diagnosis", label: "Diagnosis" },
    {
      key: "date",
      label: "Date",
      render: (row) => formatDateTime(row.created_at),
    },
  ];

  const handlePrescriptionSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setPrescriptionError(null);
      setPrescriptionSuccess(null);
      await createPrescription({
        patient_id: patientId,
        doctor_id: Number(prescriptionForm.doctor_id),
        medicines: prescriptionForm.medicines,
        dosage: prescriptionForm.dosage,
        notes: prescriptionForm.notes || null,
      });
      setPrescriptionForm({
        doctor_id: "",
        medicines: "",
        dosage: "",
        notes: "",
      });
      setPrescriptionSuccess("Prescription added successfully");
      await fetchData();
    } catch (err) {
      setPrescriptionError(
        err.response?.data?.message ||
          "Failed to create prescription. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiagnosisSubmit = async (event) => {
    event.preventDefault();
    try {
      setDiagnosisSubmitting(true);
      setDiagnosisError(null);
      setDiagnosisSuccess(null);
      await createDiagnosis({
        patient_id: patientId,
        doctor_id: Number(diagnosisForm.doctor_id),
        symptoms: diagnosisForm.symptoms,
        diagnosis: diagnosisForm.diagnosis,
      });
      setDiagnosisForm({ doctor_id: "", symptoms: "", diagnosis: "" });
      setDiagnosisSuccess("Diagnosis added successfully");
      await fetchData();
    } catch (err) {
      setDiagnosisError(
        err.response?.data?.message ||
          "Failed to create diagnosis. Please try again.",
      );
    } finally {
      setDiagnosisSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Profile"
        description="Patient overview with appointments, prescriptions, and diagnosis logs."
      />

      <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2.5">
            <UserRound className="h-5 w-5 text-blue-700" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Patient Info</h2>
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
          <DataTable
            loading={false}
            columns={appointmentColumns}
            rows={appointmentRows}
            emptyTitle="No appointment history"
            emptyMessage="This patient has no appointment records yet."
          />
        ) : null}

        {activeTab === "prescriptions" ? (
          <DataTable
            loading={false}
            columns={prescriptionColumns}
            rows={prescriptionRows}
            emptyTitle="No prescription history"
            emptyMessage="Prescriptions written by doctors will show here."
          />
        ) : null}

        {activeTab === "diagnosis" ? (
          <DataTable
            loading={false}
            columns={diagnosisColumns}
            rows={diagnosisRows}
            emptyTitle="No diagnosis history"
            emptyMessage="Diagnosis logs for this patient will show here."
          />
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handlePrescriptionSubmit}
          className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            Add Prescription
          </h3>

          {prescriptionSuccess && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {prescriptionSuccess}
            </div>
          )}
          {prescriptionError && (
            <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {prescriptionError}
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="doctor_id"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Doctor
              </label>
              <select
                id="doctor_id"
                name="doctor_id"
                value={prescriptionForm.doctor_id}
                onChange={(event) =>
                  setPrescriptionForm((previous) => ({
                    ...previous,
                    doctor_id: event.target.value,
                  }))
                }
                required
                disabled={submitting}
                className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="medicines"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                medicines
              </label>
              <input
                id="medicines"
                name="medicines"
                type="text"
                value={prescriptionForm.medicines}
                onChange={(event) =>
                  setPrescriptionForm((previous) => ({
                    ...previous,
                    medicines: event.target.value,
                  }))
                }
                placeholder="medicines"
                required
                disabled={submitting}
                className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="dosage"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                dosage
              </label>
              <input
                id="dosage"
                name="dosage"
                type="text"
                value={prescriptionForm.dosage}
                onChange={(event) =>
                  setPrescriptionForm((previous) => ({
                    ...previous,
                    dosage: event.target.value,
                  }))
                }
                placeholder="dosage"
                required
                disabled={submitting}
                className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={prescriptionForm.notes}
                onChange={(event) =>
                  setPrescriptionForm((previous) => ({
                    ...previous,
                    notes: event.target.value,
                  }))
                }
                placeholder="notes"
                rows={3}
                disabled={submitting}
                className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </span>
              ) : (
                "Submit Prescription"
              )}
            </button>
          </div>
        </form>

        <form
          onSubmit={handleDiagnosisSubmit}
          className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            Add Diagnosis
          </h3>

          {diagnosisSuccess && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {diagnosisSuccess}
            </div>
          )}
          {diagnosisError && (
            <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {diagnosisError}
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="diag_doctor_id"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Doctor
              </label>
              <select
                id="diag_doctor_id"
                name="doctor_id"
                value={diagnosisForm.doctor_id}
                onChange={(event) =>
                  setDiagnosisForm((previous) => ({
                    ...previous,
                    doctor_id: event.target.value,
                  }))
                }
                required
                disabled={diagnosisSubmitting}
                className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
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
                onChange={(event) =>
                  setDiagnosisForm((previous) => ({
                    ...previous,
                    symptoms: event.target.value,
                  }))
                }
                placeholder="symptoms"
                rows={3}
                required
                disabled={diagnosisSubmitting}
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
                onChange={(event) =>
                  setDiagnosisForm((previous) => ({
                    ...previous,
                    diagnosis: event.target.value,
                  }))
                }
                placeholder="diagnosis"
                rows={3}
                required
                disabled={diagnosisSubmitting}
                className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={diagnosisSubmitting}
              className={`inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition ${diagnosisSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            >
              {diagnosisSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </span>
              ) : (
                "Submit Diagnosis"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default PatientProfilePage;
