package com.AuroraSkinCare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.AuroraSkinCare.models.Dermatologists;

@Repository
public interface  DermatologistsRepository extends JpaRepository<Dermatologists, Long> {
    
}
