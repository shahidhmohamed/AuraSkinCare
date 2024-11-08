package com.AuroraSkinCare.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.AuroraSkinCare.models.Appointment;
import com.AuroraSkinCare.services.AppointmentService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Endpoint to retrieve all available time slots for appointments
    @GetMapping("/timeslots")
    public List<String> getTimeSlots() {
        return appointmentService.getAllTimeSlots();
    }
    
    // Endpoint to get all appointments
    @GetMapping
    public List<Appointment> getAppointments() {
        return appointmentService.getAllAppointments();
    }

    // Endpoint to create a new appointment
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        Appointment savedAppointment = appointmentService.addAppointment(appointment);
        return ResponseEntity.ok(savedAppointment);
    }

    // Endpoint to delete an appointment by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointmentById(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint to search for appointments by patient name or appointment ID
    @GetMapping("/search")
    public List<Appointment> searchAppointments(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) Long id) {
        return appointmentService.searchByPatientNameOrAppointmentId(name, id);
    }

    // Endpoint to filter appointments by a specific date
    @GetMapping("/filter")
    public List<Appointment> filterAppointments(@RequestParam String date) {
        return appointmentService.filterByDate(date);
    }


    // Endpoint to update an existing appointment by its ID
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id, 
            @RequestBody Appointment appointment) {
        Appointment updatedAppointment = appointmentService.updateAppointment(id, appointment);
        return ResponseEntity.ok(updatedAppointment);
    }
}
