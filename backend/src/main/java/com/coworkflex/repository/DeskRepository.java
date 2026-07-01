package com.coworkflex.repository;

import com.coworkflex.entity.Desk;
import com.coworkflex.entity.DeskType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeskRepository extends JpaRepository<Desk, Long> {
    List<Desk> findBySpaceId(Long spaceId);
    List<Desk> findBySpaceIdAndAvailable(Long spaceId, Boolean available);
    List<Desk> findBySpaceIdAndType(Long spaceId, DeskType type);
}
