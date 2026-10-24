package com.homestay.repository;

import com.homestay.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByGuestEmail(String guestEmail);
    List<Booking> findByHomestayId(String homestayId);
}
