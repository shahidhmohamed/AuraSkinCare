export interface Appointment {
  id?: number;
  patientId: number;
  dermatologistId: number;
  appointmentDate: string;
  appointmentTime: string;
}
