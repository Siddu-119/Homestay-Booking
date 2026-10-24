package com.homestay.controller;

import com.homestay.models.Homestay;
import com.homestay.models.Review;
import com.homestay.repository.HomestayRepository;
import com.homestay.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private HomestayRepository homestayRepository;

    @GetMapping("/homestay/{homestayId}")
    public List<Review> getReviewsByHomestay(@PathVariable("homestayId") String homestayId) {
        return reviewRepository.findByHomestayId(homestayId);
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        review.setReviewDate(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);
        
        // Update average rating
        List<Review> allReviews = reviewRepository.findByHomestayId(review.getHomestayId());
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        
        Optional<Homestay> homestayOpt = homestayRepository.findById(review.getHomestayId());
        if (homestayOpt.isPresent()) {
            Homestay h = homestayOpt.get();
            h.setAverageRating(avg);
            homestayRepository.save(h);
        }
        
        return ResponseEntity.ok(savedReview);
    }
}
