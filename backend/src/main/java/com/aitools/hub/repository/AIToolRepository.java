package com.aitools.hub.repository;

import com.aitools.hub.model.AITool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIToolRepository extends JpaRepository<AITool, Long> {
    List<AITool> findByNameContainingIgnoreCase(String name);
    List<AITool> findByCategoryIgnoreCase(String category);
}
