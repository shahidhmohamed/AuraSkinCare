package com.AuroraSkinCare.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AuroraSkinCare.models.Dermatologists;
import com.AuroraSkinCare.services.DermatologistsService;

@RestController
@RequestMapping("/api/dermatologists")
public class DermatologistsController {
    @Autowired
    DermatologistsService dermatologistsService;

    @PostMapping
    public ResponseEntity<Dermatologists> createDermatologists(@RequestBody Dermatologists dermatologists){
        Dermatologists savedDermatologists = dermatologistsService.addDermatologists(dermatologists);
        return ResponseEntity.ok(savedDermatologists);
    }

    @GetMapping
    List <Dermatologists> getDermatologistses(){
        return dermatologistsService.getAllDermatologists();
    }

    
    
}
