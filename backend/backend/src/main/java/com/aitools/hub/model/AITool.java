package com.aitools.hub.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "ai_tools")
public class AITool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    @Column(length = 1200)
    private String description;

    @ElementCollection
    @CollectionTable(name = "ai_tool_usecases", joinColumns = @JoinColumn(name = "tool_id"))
    @Column(name = "use_case")
    private List<String> useCases;

    @ElementCollection
    @CollectionTable(name = "ai_tool_learning_links", joinColumns = @JoinColumn(name = "tool_id"))
    @Column(name = "learning_link")
    private List<String> learningLinks;

    @ElementCollection
    @CollectionTable(name = "ai_tool_tags", joinColumns = @JoinColumn(name = "tool_id"))
    @Column(name = "tag")
    private List<String> tags;

    private String website;

    private int popularity;
    private LocalDate createdAt;

    private int favoriteCount;
    private int ratingCount;
    private double averageRating;

    public AITool() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getUseCases() {
        return useCases;
    }

    public void setUseCases(List<String> useCases) {
        this.useCases = useCases;
    }

    public List<String> getLearningLinks() {
        return learningLinks;
    }

    public void setLearningLinks(List<String> learningLinks) {
        this.learningLinks = learningLinks;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getPopularity() {
        return popularity;
    }

    public void setPopularity(int popularity) {
        this.popularity = popularity;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public int getFavoriteCount() {
        return favoriteCount;
    }

    public void setFavoriteCount(int favoriteCount) {
        this.favoriteCount = favoriteCount;
    }

    public int getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(int ratingCount) {
        this.ratingCount = ratingCount;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }
}
