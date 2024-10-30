package com.AuroraSkinCare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.AuroraSkinCare.models.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("SELECT a FROM Appointment a WHERE a.patient.name LIKE %:name% OR a.id = :id")
    List<Appointment> findByPatientNameOrAppointmentId(@Param("name") String name, @Param("id") Long id);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDateTime LIKE :date%")
    List<Appointment> findByAppointmentDate(@Param("date") String date);
}
