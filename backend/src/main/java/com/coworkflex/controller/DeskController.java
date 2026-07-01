package com.coworkflex.controller;

import com.coworkflex.entity.Desk;
import com.coworkflex.entity.DeskType;
import com.coworkflex.repository.DeskRepository;
import com.coworkflex.repository.SpaceRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DeskController {

    private final DeskRepository deskRepository;
    private final SpaceRepository spaceRepository;

    public DeskController(DeskRepository deskRepository, SpaceRepository spaceRepository) {
        this.deskRepository = deskRepository;
        this.spaceRepository = spaceRepository;
    }

    // GET /api/spaces/{spaceId}/desks  → postes d'un espace
    @GetMapping("/spaces/{spaceId}/desks")
    public ResponseEntity<List<Desk>> getBySpace(
            @PathVariable Long spaceId,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) DeskType type) {

        if (!spaceRepository.existsById(spaceId)) return ResponseEntity.notFound().build();

        List<Desk> desks;
        if (available != null) {
            desks = deskRepository.findBySpaceIdAndAvailable(spaceId, available);
        } else if (type != null) {
            desks = deskRepository.findBySpaceIdAndType(spaceId, type);
        } else {
            desks = deskRepository.findBySpaceId(spaceId);
        }
        return ResponseEntity.ok(desks);
    }

    // GET /api/desks/{id}  → un poste par id
    @GetMapping("/desks/{id}")
    public ResponseEntity<Desk> getById(@PathVariable Long id) {
        return deskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/spaces/{spaceId}/desks  → ajouter un poste (admin)
    @PostMapping("/spaces/{spaceId}/desks")
    public ResponseEntity<Desk> create(@PathVariable Long spaceId, @Valid @RequestBody Desk desk) {
        return spaceRepository.findById(spaceId).map(space -> {
            desk.setSpace(space);
            return ResponseEntity.status(HttpStatus.CREATED).body(deskRepository.save(desk));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/desks/{id}  → supprimer un poste (admin)
    @DeleteMapping("/desks/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!deskRepository.existsById(id)) return ResponseEntity.notFound().build();
        deskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
