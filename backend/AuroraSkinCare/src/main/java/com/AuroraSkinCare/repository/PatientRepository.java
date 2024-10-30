package com.AuroraSkinCare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.AuroraSkinCare.models.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

}
