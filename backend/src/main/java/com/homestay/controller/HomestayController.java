package com.homestay.controller;

import com.homestay.models.Homestay;
import com.homestay.models.Room;
import com.homestay.repository.HomestayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/homestays")
public class HomestayController {

    @Autowired
    private HomestayRepository homestayRepository;

    @GetMapping
    public List<Homestay> getAllHomestays(@RequestParam(name = "search", required = false) String search) {
        if (search != null && !search.isEmpty()) {
            try {
                double ratingValue = Double.parseDouble(search);
                return homestayRepository.searchHomestays(search, ratingValue);
            } catch (NumberFormatException e) {
                return homestayRepository.searchHomestaysWithoutRating(search);
            }
        }
        return homestayRepository.findAll();
    }
    
    @GetMapping("/admin/{email}")
    public List<Homestay> getHomestaysByAdmin(@PathVariable("email") String email) {
        return homestayRepository.findByAdminEmail(email);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Homestay> getHomestayById(@PathVariable("id") String id) {
        return homestayRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Homestay createHomestay(@RequestBody Homestay homestay) {
        return homestayRepository.save(homestay);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHomestay(@PathVariable("id") String id) {
        homestayRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Rooms
    @PostMapping("/{homestayId}/rooms")
    public ResponseEntity<Homestay> addRoom(@PathVariable("homestayId") String homestayId, @RequestBody Room room) {
        Optional<Homestay> homestayOpt = homestayRepository.findById(homestayId);
        if (homestayOpt.isPresent()) {
            Homestay homestay = homestayOpt.get();
            homestay.getRooms().add(room);
            homestayRepository.save(homestay);
            return ResponseEntity.ok(homestay);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{homestayId}/rooms/{roomId}")
    public ResponseEntity<Homestay> deleteRoom(@PathVariable("homestayId") String homestayId, @PathVariable("roomId") String roomId) {
        Optional<Homestay> homestayOpt = homestayRepository.findById(homestayId);
        if (homestayOpt.isPresent()) {
            Homestay homestay = homestayOpt.get();
            homestay.getRooms().removeIf(r -> r.getId().equals(roomId));
            homestayRepository.save(homestay);
            return ResponseEntity.ok(homestay);
        }
        return ResponseEntity.notFound().build();
    }
}
