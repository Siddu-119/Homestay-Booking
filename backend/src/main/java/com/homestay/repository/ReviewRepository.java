package com.homestay.repository;

import com.homestay.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByHomestayId(String homestayId);
}
