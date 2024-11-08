package com.AuroraSkinCare.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AuroraSkinCare.models.Treatment;
import com.AuroraSkinCare.repository.TreatmentRepository;

@Service
public class TreatmentService {

    @Autowired
    private TreatmentRepository treatmentRepository;


    private final List<Treatment> treatmentList = new ArrayList<>();

    public TreatmentService() {
        addExampleTreatments();
    }

    private void addExampleTreatments() {
        Treatment treatment1 = new Treatment();
        treatment1.setId(1);
        treatment1.setTreatment("Facial");
        treatment1.setPrice(50.00);

        Treatment treatment2 = new Treatment();
        treatment2.setId(2);
        treatment2.setTreatment("Acne Treatment");
        treatment2.setPrice(2750.00);

        Treatment treatment3 = new Treatment();
        treatment3.setId(3);
        treatment3.setTreatment("Skin Whitening");
        treatment3.setPrice(7650.00);

        Treatment treatment4 = new Treatment();
        treatment4.setId(4);
        treatment4.setTreatment("Mole Removal");
        treatment4.setPrice(3850.00);

        Treatment treatment5 = new Treatment();
        treatment5.setId(5);
        treatment5.setTreatment("Laser Treatment");
        treatment5.setPrice(12500.00);

        treatmentList.add(treatment1);
        treatmentList.add(treatment2);
        treatmentList.add(treatment3);
        treatmentList.add(treatment4);
        treatmentList.add(treatment5);
    }

    public List<Treatment> getAllTreatments() {
        return treatmentList;
    }

    // Method to add a treatment to the list
    public void addTreatment(String treatmentName, Double price) {
        Treatment treatment = new Treatment();
        treatment.setTreatment(treatmentName);
        treatment.setPrice(price);
        treatmentList.add(treatment);
    }
}
