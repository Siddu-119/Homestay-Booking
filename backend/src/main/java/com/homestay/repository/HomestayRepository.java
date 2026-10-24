package com.homestay.repository;

import com.homestay.models.Homestay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HomestayRepository extends JpaRepository<Homestay, String> {
    List<Homestay> findByNameContainingIgnoreCase(String name);
    List<Homestay> findByAdminEmail(String adminEmail);

    @Query("SELECT h FROM Homestay h WHERE lower(h.name) LIKE lower(concat('%', :search, '%')) OR lower(h.address) LIKE lower(concat('%', :search, '%')) OR lower(h.locationMapUrl) LIKE lower(concat('%', :search, '%')) OR h.averageRating >= :rating")
    List<Homestay> searchHomestays(@Param("search") String search, @Param("rating") Double rating);

    @Query("SELECT h FROM Homestay h WHERE lower(h.name) LIKE lower(concat('%', :search, '%')) OR lower(h.address) LIKE lower(concat('%', :search, '%')) OR lower(h.locationMapUrl) LIKE lower(concat('%', :search, '%'))")
    List<Homestay> searchHomestaysWithoutRating(@Param("search") String search);
}
