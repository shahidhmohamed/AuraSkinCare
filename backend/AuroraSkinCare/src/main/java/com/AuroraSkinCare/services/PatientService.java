package com.AuroraSkinCare.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AuroraSkinCare.models.Patient;
import com.AuroraSkinCare.repository.PatientRepository;

@Service
public class PatientService {
    @Autowired
    PatientRepository patientRepository;

    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatient() {
        return patientRepository.findAll();
    }
}
