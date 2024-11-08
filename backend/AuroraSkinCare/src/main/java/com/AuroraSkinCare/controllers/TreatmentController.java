package com.AuroraSkinCare.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AuroraSkinCare.models.Treatment;
import com.AuroraSkinCare.services.TreatmentService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class TreatmentController {

    @Autowired
    private TreatmentService treatmentService;

    @GetMapping("/treatments")
    public List<Treatment> getTimeSlots() {
        return treatmentService.getAllTreatments();
    }
    
}
