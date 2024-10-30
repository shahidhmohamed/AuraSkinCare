export interface Appointment {
  id?: number;
  patientId: number;
  dermatologistId: number;
  appointmentDate: string; // Format YYYY-MM-DD
  appointmentTime: string; // Format HH:mm
}
