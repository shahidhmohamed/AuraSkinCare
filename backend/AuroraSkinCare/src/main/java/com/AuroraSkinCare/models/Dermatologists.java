package com.AuroraSkinCare.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Dermatologists {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)

    private Long dermatologistsID;
    private String dermatologistsName;

    public Long getDermatologistsID() {
        return dermatologistsID;
    }

    public String getDermatologistsName() {
        return dermatologistsName;
    }

    public void setDermatologistsID(Long dermatologistsID) {
        this.dermatologistsID = dermatologistsID;
    }

    public void setDermatologistsName(String dermatologistsName) {
        this.dermatologistsName = dermatologistsName;
    }
        
}
