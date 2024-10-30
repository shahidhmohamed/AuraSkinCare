import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent implements OnInit {
  timeSlots: { [key: string]: string[] } = {};
  availableTimeSlots: { [key: string]: string[] } = {};
  selectedTimeSlots: { [key: string]: string | undefined } = {};
  selectedDate: string = '';
  dayOfWeek: string | undefined;
  AppointmentArray: any[] = [];
  PatientArray: any[] = [];
  DermatologistsArray: any[] = [];
  selectedPatient: string = '';
  selectedDermatologist: {
    dermatologistsID: number;
    dermatologistsName: string;
  } | null = null;

  filterDate: string = '';
  searchName: string = '';
  searchId: number | null = null;
  searchResults: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private http: HttpClient
  ) {
    this.getAllAppointments();
  }

  ngOnInit() {
    this.loadTimeSlots();
    this.loadPatient();
    this.loadDermatologists();
  }

  searchAppointments() {
    this.appointmentService
      .searchAppointments(this.searchName, this.searchId!)
      .subscribe((data) => {
        this.searchResults = data;
      });
  }

  filterAppointmentsByDate() {
    this.appointmentService
      .filterAppointments(this.filterDate)
      .subscribe((data) => {
        this.searchResults = data;
      });
  }

  loadPatient(): void {
    this.http
      .get<any[]>('http://localhost:8080/api/patients')
      .subscribe((data) => {
        this.PatientArray = data;
      });
  }

  loadDermatologists(): void {
    this.http
      .get<any[]>('http://localhost:8080/api/dermatologists')
      .subscribe((data) => {
        this.DermatologistsArray = data;
      });
  }

  loadTimeSlots() {
    this.appointmentService.getTimeSlots().subscribe(
      (data) => {
        data.forEach((slot) => {
          const [day, time] = slot.split(' ', 2);
          if (!this.timeSlots[day]) {
            this.timeSlots[day] = [];
          }
          this.timeSlots[day].push(time);
        });
      },
      (error) => {
        console.error('Error fetching time slots:', error);
      }
    );
  }

  onDateChange(event: any) {
    const date = new Date(event.target.value);
    const options = { weekday: 'long' } as const;
    this.dayOfWeek = date.toLocaleDateString('en-US', options);
    this.selectedDate = event.target.value;

    this.availableTimeSlots[this.dayOfWeek] = this.timeSlots[
      this.dayOfWeek
    ].filter(
      (slot) =>
        !this.AppointmentArray.some(
          (app) =>
            app.appointmentDateTime.includes(`${this.selectedDate} ${slot}`) &&
            app.dermatologists &&
            app.dermatologists.dermatologistsID ===
              this.selectedDermatologist!.dermatologistsID
        )
    );

    console.log('Selected Date:', this.selectedDate);
    console.log('Selected Dermatologist:', this.selectedDermatologist);
    console.log(
      'Available Time Slots:',
      this.availableTimeSlots[this.dayOfWeek]
    );
  }

  addAppointment(): void {
    if (this.dayOfWeek && this.selectedTimeSlots[this.dayOfWeek]) {
      const selectedTime = this.selectedTimeSlots[this.dayOfWeek];
      const appointmentDateTime = `${this.selectedDate} ${selectedTime}`;

      const bodyData = {
        appointmentDateTime: appointmentDateTime,
        patient: this.selectedPatient,
        dermatologists: this.selectedDermatologist,
      };

      this.http
        .post('http://localhost:8080/api/appointments', bodyData)
        .subscribe((resultData: any) => {
          console.log(resultData);
          alert('Appointment added successfully');
          this.getAllAppointments();
          this.resetForm();
        });
    } else {
      alert('Please select a valid date and time slot.');
    }
  }

  getAllAppointments() {
    this.http
      .get('http://localhost:8080/api/appointments')
      .subscribe((resultData: any) => {
        console.log(resultData);
        this.AppointmentArray = resultData;
      });
  }

  deleteAppointment(appointmentId: number): void {
    console.log('Deleting appointment with ID:', appointmentId);
    const confirmDelete = confirm(
      'Are you sure you want to delete this appointment?'
    );
    if (confirmDelete) {
      this.http
        .delete(`http://localhost:8080/api/appointments/${appointmentId}`)
        .subscribe(() => {
          alert('Appointment deleted successfully');
          this.getAllAppointments();
        });
    }
  }

  setTodayDate() {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  resetForm(): void {
    const today = new Date();
    this.selectedDate = '';
    this.dayOfWeek = undefined;
    this.selectedTimeSlots = {};
  }

  resetFilters() {
    // Reset search and filter fields and show all appointments
    this.filterDate = '';
    this.searchName = '';
    this.searchId = null;
    this.searchResults = [];
  }
}
