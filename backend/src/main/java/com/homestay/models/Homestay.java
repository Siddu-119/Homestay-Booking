package com.homestay.models;

import lombok.Data;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import java.util.ArrayList;

@Data
@Entity
@Table(name = "homestays")
public class Homestay {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String address; // Address of the homestay
    private String locationMapUrl; // Location in map format optionally
    private String photoUrl; // Photo of the homestay from folder
    private String adminEmail; // The email of the admin who created this
    
    // We'll store basic details and list of rooms
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "homestay_id")
    private List<Room> rooms = new ArrayList<>();
    
    // Derived overall rating
    private double averageRating;
}
