package com.homestay.models;

import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String homestayId;
    private String homestayName;
    private String roomId;
    private String guestEmail;
    
    private String guestName;
    private String guestPhone;
    
    private String checkInDate;
    private String checkOutDate;
    
    private String paymentMethod; // "ONLINE" or "CASH"
    private String paymentStatus; // "PENDING", "COMPLETED"
    
    private LocalDateTime bookingDate;
}
