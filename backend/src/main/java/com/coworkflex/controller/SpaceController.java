package com.coworkflex.controller;

import com.coworkflex.entity.Space;
import com.coworkflex.repository.SpaceRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/spaces")
@CrossOrigin(origins = "*")
public class SpaceController {

    private final SpaceRepository spaceRepository;

    public SpaceController(SpaceRepository spaceRepository) {
        this.spaceRepository = spaceRepository;
    }

    // GET /api/spaces  → tous les espaces (filtre ville optionnel)
    @GetMapping
    public List<Space> getAll(@RequestParam(required = false) String city) {
        if (city != null && !city.isBlank()) {
            return spaceRepository.findByCityContainingIgnoreCase(city);
        }
        return spaceRepository.findAll();
    }

    // GET /api/spaces/{id}  → un espace par id
    @GetMapping("/{id}")
    public ResponseEntity<Space> getById(@PathVariable Long id) {
        return spaceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/spaces  → créer un espace (admin)
    @PostMapping
    public ResponseEntity<Space> create(@Valid @RequestBody Space space) {
        Space saved = spaceRepository.save(space);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/spaces/{id}  → modifier un espace (admin)
    @PutMapping("/{id}")
    public ResponseEntity<Space> update(@PathVariable Long id, @Valid @RequestBody Space updated) {
        return spaceRepository.findById(id).map(space -> {
            space.setName(updated.getName());
            space.setCity(updated.getCity());
            space.setAddress(updated.getAddress());
            space.setRating(updated.getRating());
            space.setCapacity(updated.getCapacity());
            space.setAvailable(updated.getAvailable());
            space.setAmenities(updated.getAmenities());
            space.setPriceFrom(updated.getPriceFrom());
            space.setDescription(updated.getDescription());
            return ResponseEntity.ok(spaceRepository.save(space));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/spaces/{id}  → supprimer un espace (admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!spaceRepository.existsById(id)) return ResponseEntity.notFound().build();
        spaceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
