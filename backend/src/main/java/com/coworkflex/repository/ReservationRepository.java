package com.coworkflex.repository;

import com.coworkflex.entity.Reservation;
import com.coworkflex.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserEmail(String userEmail);
    List<Reservation> findByUserEmailAndStatus(String userEmail, ReservationStatus status);
    List<Reservation> findByDeskId(Long deskId);
}
