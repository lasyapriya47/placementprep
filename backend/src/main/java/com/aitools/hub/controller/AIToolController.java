package com.aitools.hub.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aitools.hub.model.AITool;
import com.aitools.hub.service.AIToolService;

@RestController
@RequestMapping("/tools")
public class AIToolController {
    private final AIToolService service;

    public AIToolController(AIToolService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AITool>> getAllTools(@RequestParam(required = false) String category,
                                                     @RequestParam(required = false, defaultValue = "") String sort,
                                                     @RequestParam(required = false, defaultValue = "0") int page,
                                                     @RequestParam(required = false, defaultValue = "20") int size) {
        List<AITool> list;
        if (category != null && !category.isBlank()) {
            list = service.filterByCategorySorted(category.trim(), sort);
        } else {
            list = service.findAll();
            if (sort != null && !sort.isBlank()) {
                if (sort.equalsIgnoreCase("popular") || sort.equalsIgnoreCase("most popular")) {
                    list.sort((a, b) -> Integer.compare(b.getPopularity(), a.getPopularity()));
                } else if (sort.equalsIgnoreCase("latest")) {
                    list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
                } else if (sort.equalsIgnoreCase("top-rated") || sort.equalsIgnoreCase("rating")) {
                    list.sort((a, b) -> {
                        int cmp = Double.compare(b.getAverageRating(), a.getAverageRating());
                        if (cmp != 0) return cmp;
                        return Integer.compare(b.getRatingCount(), a.getRatingCount());
                    });
                } else if (sort.equalsIgnoreCase("most-loved") || sort.equalsIgnoreCase("favorite")) {
                    list.sort((a, b) -> Integer.compare(b.getFavoriteCount(), a.getFavoriteCount()));
                }
            }
        }
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        int from = Math.min(page * size, list.size());
        int to = Math.min(from + size, list.size());
        return ResponseEntity.ok(list.subList(from, to));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<AITool> addFavorite(@PathVariable Long id) {
        AITool updated = service.incrementFavorite(id);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/rating")
    public ResponseEntity<AITool> addRating(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer rating = body.get("rating");
        if (rating == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            AITool updated = service.addRating(id, rating);
            if (updated == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AITool> getToolById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<AITool>> search(@RequestParam(required = false, defaultValue = "") String q) {
        if (q.isBlank()) {
            return ResponseEntity.ok(service.findAll());
        }
        return ResponseEntity.ok(service.search(q));
    }

    @PostMapping
    public ResponseEntity<AITool> addTool(@RequestBody AITool tool) {
        AITool saved = service.save(tool);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AITool> updateTool(@PathVariable Long id, @RequestBody AITool updates) {
        return service.findById(id).map(existing -> {
            existing.setName(updates.getName());
            existing.setCategory(updates.getCategory());
            existing.setDescription(updates.getDescription());
            existing.setUseCases(updates.getUseCases());
            existing.setLearningLinks(updates.getLearningLinks());
            existing.setTags(updates.getTags());
            existing.setPopularity(updates.getPopularity());
            AITool updated = service.save(existing);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTool(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<AITool> all = service.findAll();
        List<String> categories = all.stream()
                .map(AITool::getCategory)
                .distinct()
                .sorted()
                .toList();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<AITool>> getFeatured() {
        List<AITool> all = service.findAll();
        List<AITool> featured = all.stream()
                .sorted((a, b) -> Integer.compare(b.getPopularity(), a.getPopularity()))
                .limit(8)
                .toList();
        return ResponseEntity.ok(featured);
    }

    @GetMapping("/recommend")
    public ResponseEntity<List<AITool>> recommend(@RequestParam(required = false, defaultValue = "") String q) {
        if (q.isBlank()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(service.search(q));
    }
}
