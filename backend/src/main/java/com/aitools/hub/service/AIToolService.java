package com.aitools.hub.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aitools.hub.model.AITool;
import com.aitools.hub.repository.AIToolRepository;

@Service
public class AIToolService {
    private final AIToolRepository repository;

    public AIToolService(AIToolRepository repository) {
        this.repository = repository;
    }

    public List<AITool> findAll() {
        return repository.findAll();
    }

    public Optional<AITool> findById(Long id) {
        return repository.findById(id);
    }

    public AITool save(AITool tool) {
        if (tool.getCreatedAt() == null) {
            tool.setCreatedAt(java.time.LocalDate.now());
        }
        return repository.save(tool);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<AITool> search(String q) {
        if (q == null || q.isBlank()) {
            return findAll();
        }

        String query = q.trim().toLowerCase();
        Set<String> tokens = Arrays.stream(query.split("\\s+"))
                .map(String::trim)
                .filter(it -> !it.isBlank())
                .collect(Collectors.toSet());

        List<AITool> all = repository.findAll();

        List<AITool> matched = all.stream().filter(tool -> {
            String text = String.join(" ",
                    tool.getName() == null ? "" : tool.getName(),
                    tool.getCategory() == null ? "" : tool.getCategory(),
                    tool.getDescription() == null ? "" : tool.getDescription()).toLowerCase();
            boolean nameMatch = tokens.stream().anyMatch(text::contains);
            List<String> useCases = tool.getUseCases() == null ? Collections.emptyList() : tool.getUseCases();
            List<String> tags = tool.getTags() == null ? Collections.emptyList() : tool.getTags();
            boolean useCaseMatch = useCases.stream().anyMatch(uc -> tokens.stream().anyMatch(tok -> uc.toLowerCase().contains(tok)));
            boolean tagMatch = tags.stream().anyMatch(tag -> tokens.stream().anyMatch(tok -> tag.toLowerCase().contains(tok)));
            boolean recMatch = matchingRecommendation(tool, tokens);
            return nameMatch || useCaseMatch || tagMatch || recMatch;
        }).collect(Collectors.toList());

        matched.sort(Comparator.comparingInt(AITool::getPopularity).reversed());

        return matched;
    }

    private boolean matchingRecommendation(AITool tool, Set<String> tokens) {
        Set<String> recKeywords = Set.of("create", "website", "web", "development", "frontend", "backend", "design", "code", "build", "generate");
        if (!Collections.disjoint(tokens, recKeywords)) {
            List<String> tags = tool.getTags() == null ? Collections.emptyList() : tool.getTags();
            return tags.stream().anyMatch(tag -> recKeywords.stream().anyMatch(tag::contains));
        }
        return false;
    }

    public List<AITool> filterByCategorySorted(String category, String sortBy) {
        List<AITool> list = repository.findByCategoryIgnoreCase(category);
        if (sortBy == null) {
            return list;
        }
        if (sortBy.equalsIgnoreCase("popular") || sortBy.equalsIgnoreCase("most popular")) {
            list.sort(Comparator.comparingInt(AITool::getPopularity).reversed());
        } else if (sortBy.equalsIgnoreCase("latest")) {
            list.sort(Comparator.comparing(AITool::getCreatedAt).reversed());
        } else if (sortBy.equalsIgnoreCase("top-rated") || sortBy.equalsIgnoreCase("rating")) {
            list.sort(Comparator.comparingDouble(AITool::getAverageRating).reversed().thenComparingInt(AITool::getRatingCount).reversed());
        } else if (sortBy.equalsIgnoreCase("most-loved") || sortBy.equalsIgnoreCase("favorite")) {
            list.sort(Comparator.comparingInt(AITool::getFavoriteCount).reversed());
        }
        return list;
    }

    public AITool incrementFavorite(Long id) {
        return repository.findById(id).map(tool -> {
            tool.setFavoriteCount(tool.getFavoriteCount() + 1);
            tool.setPopularity(tool.getPopularity() + 1);
            return repository.save(tool);
        }).orElse(null);
    }

    public AITool addRating(Long id, int rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        return repository.findById(id).map(tool -> {
            double total = tool.getAverageRating() * tool.getRatingCount();
            total += rating;
            int count = tool.getRatingCount() + 1;
            tool.setRatingCount(count);
            tool.setAverageRating(total / count);
            return repository.save(tool);
        }).orElse(null);
    }

    public List<AITool> paging(int page, int size) {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(AITool::getCreatedAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }
}
