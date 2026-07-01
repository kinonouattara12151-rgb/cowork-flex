package com.coworkflex.repository;

import com.coworkflex.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SpaceRepository extends JpaRepository<Space, Long> {
    List<Space> findByCity(String city);
    List<Space> findByCityContainingIgnoreCase(String city);
    List<Space> findByNameContainingIgnoreCase(String name);
}
