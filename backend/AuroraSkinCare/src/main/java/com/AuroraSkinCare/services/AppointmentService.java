package com.AuroraSkinCare.services;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AuroraSkinCare.models.Appointment;
import com.AuroraSkinCare.repository.AppointmentRepository;

@Service
public class AppointmentService {

    @Autowired
    AppointmentRepository appointmentRepository;

    private final List<String> timeSlots = new ArrayList<>();


    public AppointmentService() {
        generateTimeSlotsForMonday();
        generateTimeSlotsForWednesday();
        generateTimeSlotsForFriday();
        generateTimeSlotsForSaturday();
    }


    private void generateTimeSlotsForMonday() {
        addTimeSlots("Monday", LocalTime.of(10, 0), LocalTime.of(13, 0));
    }

    private void generateTimeSlotsForWednesday() {
        addTimeSlots("Wednesday", LocalTime.of(14, 0), LocalTime.of(17, 0));
    }

    private void generateTimeSlotsForFriday() {
        addTimeSlots("Friday", LocalTime.of(16, 0), LocalTime.of(18, 0));
    }

    private void generateTimeSlotsForSaturday() {
        addTimeSlots("Saturday", LocalTime.of(11, 0), LocalTime.of(13, 0));
    }

    private void addTimeSlots(String day, LocalTime startTime, LocalTime endTime) {
        while (!startTime.isAfter(endTime)) {
            timeSlots.add(day + " " + startTime);
            startTime = startTime.plusMinutes(15);
        }
    }

    public List<String> getAllTimeSlots() {
        return timeSlots;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment addAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointmentById(Long id) {
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> searchByPatientNameOrAppointmentId(String name, Long id) {
        return appointmentRepository.findByPatientNameOrAppointmentId(name, id);
    }

    public List<Appointment> filterByDate(String date) {
        return appointmentRepository.findByAppointmentDate(date);
    }
}
