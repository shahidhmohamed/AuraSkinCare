package com.AuroraSkinCare.services;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AuroraSkinCare.models.Appointment;
import com.AuroraSkinCare.repository.AppointmentRepository;

@Service
public class AppointmentService {


    // Injecting the AppointmentRepository to interact with the database
    @Autowired
    AppointmentRepository appointmentRepository;

    // List to store available time slots for appointments
    private final List<String> timeSlots = new ArrayList<>();

    // Constructor to generate time slots for specific days of the week
    public AppointmentService() {
        generateTimeSlotsForMonday();
        generateTimeSlotsForWednesday();
        generateTimeSlotsForFriday();
        generateTimeSlotsForSaturday();
    }

    // Generates time slots for Monday from 10:00 AM to 1:00 PM
    private void generateTimeSlotsForMonday() {
        addTimeSlots("Monday", LocalTime.of(10, 0), LocalTime.of(13, 0));
    }

    // Generates time slots for Wednesday from 2:00 PM to 5:00 PM
    private void generateTimeSlotsForWednesday() {
        addTimeSlots("Wednesday", LocalTime.of(14, 0), LocalTime.of(17, 0));
    }

    // Generates time slots for Friday from 4:00 PM to 6:00 PM
    private void generateTimeSlotsForFriday() {
        addTimeSlots("Friday", LocalTime.of(16, 0), LocalTime.of(18, 0));
    }

    // Generates time slots for Saturday from 11:00 AM to 1:00 PM
    private void generateTimeSlotsForSaturday() {
        addTimeSlots("Saturday", LocalTime.of(11, 0), LocalTime.of(13, 0));
    }

    // Adds 15-minute interval time slots for a specified day
    private void addTimeSlots(String day, LocalTime startTime, LocalTime endTime) {
        while (!startTime.isAfter(endTime)) {
            timeSlots.add(day + " " + startTime);
            startTime = startTime.plusMinutes(15);
        }
    }

    // Returns a list of all available time slots
    public List<String> getAllTimeSlots() {
        return timeSlots;
    }

    // Retrieves all appointments from the database
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Saves a new appointment to the database
    public Appointment addAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    // Deletes an appointment from the database by its ID
    public void deleteAppointmentById(Long id) {
        appointmentRepository.deleteById(id);
    }

    // Searches for appointments by patient name or appointment ID
    public List<Appointment> searchByPatientNameOrAppointmentId(String name, Long id) {
        return appointmentRepository.findByPatientNameOrAppointmentId(name, id);
    }

    // Filters appointments by a specific date
    public List<Appointment> filterByDate(String date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    // Updates an existing appointment's details based on its ID
    public Appointment updateAppointment(Long id, Appointment updatedAppointmentDetails) {
        Optional<Appointment> existingAppointmentOptional = appointmentRepository.findById(id);
        
        if (existingAppointmentOptional.isPresent()) {
            Appointment existingAppointment = existingAppointmentOptional.get();
            existingAppointment.setAppointmentDateTime(updatedAppointmentDetails.getAppointmentDateTime());
            existingAppointment.setRegistration(updatedAppointmentDetails.getRegistration());
            existingAppointment.setPatient(updatedAppointmentDetails.getPatient());
            existingAppointment.setDermatologists(updatedAppointmentDetails.getDermatologists());
    
            return appointmentRepository.save(existingAppointment);
        } else {
            throw new RuntimeException("Appointment with ID " + id + " not found");
        }
    }
}