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

  nic: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';

  registration: string = '';

  editingAppointmentId: number | null = null;
  editingAppointmentData: any = {
    appointmentDateTime: '',
    patient: '',
    dermatologists: null,
    registration: '',
  };

  treatmentsArray: any[] = [];

  totalAmount: number = 0;
  taxAmount: number = 0;
  registrationFee: number = 500; // Fixed registration fee
  grandTotal: number = 0;

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
    this.loadTreatments();
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

  editAppointment(appointment: {
    id: number | null;
    appointmentDateTime: any;
    patient: { id: any };
    dermatologists: { dermatologistsID: any };
    registration: any;
  }) {
    this.editingAppointmentId = appointment.id;
    this.editingAppointmentData = {
      appointmentDateTime: appointment.appointmentDateTime,
      patient: appointment.patient,
      dermatologists: appointment.dermatologists,
      registration: appointment.registration,
    };
  }

  updateAppointment(): void {
    if (this.editingAppointmentId) {
      this.editingAppointmentData.treatments = this.treatmentsArray.filter(
        (treatment) => treatment.selected
      );

      this.appointmentService
        .updateAppointment(
          this.editingAppointmentId,
          this.editingAppointmentData
        )
        .subscribe(
          (resultData) => {
            console.log(resultData);
            alert('Appointment updated successfully');
            this.getAllAppointments();
            this.resetEditForm();
          },
          (error) => {
            console.error('Error updating appointment:', error);
            alert('Failed to update appointment');
          }
        );
    } else {
      alert('No appointment selected for editing.');
    }
  }

  resetEditForm(): void {
    this.editingAppointmentId = null;
    this.editingAppointmentData = {
      appointmentDateTime: '',
      patient: '',
      dermatologists: null,
      registration: '',
      treatments: [],
    };
    // Reset treatment selections
    this.treatmentsArray.forEach((treatment) => {
      treatment.selected = false;
    });
    this.calculateTotal(); // Reset calculation when form is reset
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

  loadTreatments() {
    this.appointmentService.getTreatments().subscribe((data) => {
      this.treatmentsArray = data.map((treatment: any) => ({
        ...treatment,
        selected: false,
      }));
    });
  }

  calculateTotal() {
    // Reset totals before calculation
    this.totalAmount = 0;
    this.taxAmount = 0;
    this.grandTotal = 0;

    // Calculate total amount from selected treatments
    this.treatmentsArray.forEach((treatment) => {
      if (treatment.selected) {
        this.totalAmount += treatment.price;
      }
    });

    // Add 2.5% tax
    this.taxAmount = this.totalAmount * 0.025;

    // Add registration fee
    this.grandTotal = this.totalAmount + this.taxAmount + this.registrationFee;
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

  // Triggered when date is changed, updates available time slots and Hide Booked Slots
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

  togglePatientForm(): void {
    this.isPatientFormVisible = !this.isPatientFormVisible;
  }
  isPatientFormVisible: boolean = false;

  addPatient(): void {
    const bodyData = {
      nic: this.nic,
      name: this.name,
      email: this.email,
      phone: this.phone,
    };
    this.http.post('http://localhost:8080/api/patients', bodyData).subscribe(
      (resultData) => {
        console.log(resultData);
        alert('Patient added successfully');
        this.resetPatientForm();
        this.isPatientFormVisible = false;
        this.loadPatient();
      },
      (error) => {
        console.error('Error adding patient:', error);
        alert('Failed to add patient');
      }
    );
  }

  resetPatientForm(): void {
    this.nic = '';
    this.name = '';
    this.email = '';
    this.phone = '';
  }

  // Add Appointment
  addAppointment(): void {
    if (this.dayOfWeek && this.selectedTimeSlots[this.dayOfWeek]) {
      const selectedTime = this.selectedTimeSlots[this.dayOfWeek];
      const appointmentDateTime = `${this.selectedDate} ${selectedTime}`;

      const bodyData = {
        appointmentDateTime: appointmentDateTime,
        patient: this.selectedPatient,
        dermatologists: this.selectedDermatologist,
        registration: this.registration,
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
    this.registration = '';
    this.selectedDermatologist = null;
    this.selectedPatient = '';
  }

  resetFilters() {
    // Reset search and filter fields and show all appointments
    this.filterDate = '';
    this.searchName = '';
    this.searchId = null;
    this.searchResults = [];
  }

  generateInvoice(): void {
    const treatmentDetails = this.treatmentsArray
      .filter((treatment) => treatment.selected)
      .map((treatment) => ({
        treatment: treatment.treatment,
        price: treatment.price,
      }));

    const invoice = {
      patientName: this.editingAppointmentData.patient.name,
      dermatologistName:
        this.editingAppointmentData.dermatologists.dermatologistsName,
      treatments: treatmentDetails,
      totalAmount: this.totalAmount,
      taxAmount: this.taxAmount,
      registrationFee: this.registrationFee,
      grandTotal: this.grandTotal,
    };

    // Display the invoice in the console or show a modal with the invoice details
    console.log('Invoice Details:', invoice);
    alert(`
      Invoice for ${invoice.patientName} - ${invoice.dermatologistName}:
      \nTreatments: 
      ${invoice.treatments
        .map((t) => `${t.treatment}: ${t.price}Rs`)
        .join('\n')}
      \nTotal Amount: ${invoice.totalAmount} Rs
      Tax Amount (2.5%): ${invoice.taxAmount} Rs
      Registration Fee: ${invoice.registrationFee} Rs
      \nGrand Total: ${invoice.grandTotal} Rs
    `);

    // Optionally, you can send this invoice to a server or save it as a PDF
  }
}
