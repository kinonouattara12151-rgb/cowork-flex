package com.coworkflex.controller;

import com.coworkflex.entity.*;
import com.coworkflex.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final DeskRepository deskRepository;

    public ReservationController(ReservationRepository reservationRepository, DeskRepository deskRepository) {
        this.reservationRepository = reservationRepository;
        this.deskRepository = deskRepository;
    }

    // GET /api/reservations?email=xxx  → réservations d'un utilisateur
    @GetMapping
    public List<Reservation> getByEmail(@RequestParam String email) {
        return reservationRepository.findByUserEmail(email);
    }

    // GET /api/reservations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getById(@PathVariable Long id) {
        return reservationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/reservations  → créer une réservation
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ReservationRequest request) {
        return deskRepository.findById(request.getDeskId()).map(desk -> {
            if (!Boolean.TRUE.equals(desk.getAvailable())) {
                return ResponseEntity.badRequest().body("Ce poste n'est pas disponible.");
            }

            // Calcul du prix total
            long minutes = java.time.Duration.between(request.getStartTime(), request.getEndTime()).toMinutes();
            int total = (int) Math.round((minutes / 60.0) * desk.getPricePerHour());

            Reservation reservation = new Reservation();
            reservation.setDesk(desk);
            reservation.setUserName(request.getUserName());
            reservation.setUserEmail(request.getUserEmail());
            reservation.setDate(request.getDate());
            reservation.setStartTime(request.getStartTime());
            reservation.setEndTime(request.getEndTime());
            reservation.setTotalPrice(total);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(reservationRepository.save(reservation));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/reservations/{id}/cancel  → annuler une réservation
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancel(@PathVariable Long id) {
        return reservationRepository.findById(id).map(r -> {
            r.setStatus(ReservationStatus.CANCELLED);
            return ResponseEntity.ok(reservationRepository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }
}
