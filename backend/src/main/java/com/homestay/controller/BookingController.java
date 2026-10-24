package com.homestay.controller;

import com.homestay.models.Booking;
import com.homestay.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        booking.setBookingDate(LocalDateTime.now());
        booking.setPaymentStatus("COMPLETED"); // Mock success
        return bookingRepository.save(booking);
    }

    @GetMapping("/guest/{email}")
    public List<Booking> getBookingsByGuest(@PathVariable("email") String email) {
        return bookingRepository.findByGuestEmail(email);
    }

    @GetMapping("/homestay/{homestayId}")
    public List<Booking> getBookingsByHomestay(@PathVariable("homestayId") String homestayId) {
        return bookingRepository.findByHomestayId(homestayId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable("id") String id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            LocalDateTime oneDayAfter = booking.getBookingDate().plusDays(1);
            if (LocalDateTime.now().isBefore(oneDayAfter)) {
                bookingRepository.deleteById(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().body("Cancellation period of 1 day has expired.");
            }
        }
        return ResponseEntity.notFound().build();
    }
}
