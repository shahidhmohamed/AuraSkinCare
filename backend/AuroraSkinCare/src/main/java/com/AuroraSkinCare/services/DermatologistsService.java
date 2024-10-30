package com.AuroraSkinCare.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AuroraSkinCare.models.Dermatologists;
import com.AuroraSkinCare.repository.DermatologistsRepository;

@Service
public class DermatologistsService {
    @Autowired
    DermatologistsRepository dermatologistsRepository;

    public Dermatologists addDermatologists(Dermatologists dermatologists){
        return dermatologistsRepository.save(dermatologists);
    }

    public List<Dermatologists>getAllDermatologists(){
        return dermatologistsRepository.findAll();
    }
}
