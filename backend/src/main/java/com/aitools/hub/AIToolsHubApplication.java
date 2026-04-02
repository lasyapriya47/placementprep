package com.aitools.hub;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.aitools.hub.model.AITool;
import com.aitools.hub.model.User;
import com.aitools.hub.repository.AIToolRepository;
import com.aitools.hub.repository.UserRepository;

@SpringBootApplication
public class AIToolsHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(AIToolsHubApplication.class, args);
    }

    @Bean
    CommandLineRunner dataLoader(AIToolRepository repository, UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@aitools.io");
                admin.setPassword("admin123");
                admin.setCreatedAt(java.time.LocalDateTime.now());
                userRepository.save(admin);
            }
            List<String> categories = List.of("Web Development", "Content Writing", "Image Generation", "Video Editing", "Coding", "Productivity", "Data Science", "Marketing", "Design", "Education");
            List<String> goodUseCases = List.of("Build responsive websites", "Generate blog content", "Create social media visuals", "Edit video clips", "Assist coding", "Manage tasks", "Analyze datasets", "Run campaigns", "Design UX", "Teach coding");
            List<String> tagSets = List.of("web development", "website builder", "frontend", "backend", "content writing", "copywriting", "ai design", "video editing", "programming", "data analytics", "marketing", "automation", "seo", "ai research");
            Random random = new Random();
            List<AITool> all = new ArrayList<>();

            for (int i = 1; i <= 120; i++) {
                String category = categories.get((i - 1) % categories.size());
                String name = String.format("%s AI Tool %03d", category, i);
                String description = "AI-powered " + category.toLowerCase() + " assistant for " + goodUseCases.get((i - 1) % goodUseCases.size()).toLowerCase() + ".";
                List<String> useCases = List.of(goodUseCases.get((i - 1) % goodUseCases.size()));
                String normalizedName = name.toLowerCase().replace(" ", "+").replace("%", "");
                List<String> learningLinks = List.of(
                    "https://www.youtube.com/results?search_query=" + normalizedName + "+tutorial",
                    "https://www.google.com/search?q=" + normalizedName + "+ai+tool+tutorial"
                );
                List<String> tags = List.of(tagSets.get((i - 1) % tagSets.size()), tagSets.get((i) % tagSets.size()));
                int popularity = random.nextInt(1000) + 100;
                LocalDate createdAt = LocalDate.now().minusDays(120 - i);

                AITool tool = new AITool();
                tool.setName(name);
                tool.setCategory(category);
                tool.setDescription(description);
                tool.setWebsite("https://www.google.com/search?q=" + normalizedName + "+ai+tool");
                tool.setUseCases(useCases);
                tool.setLearningLinks(learningLinks);
                tool.setTags(tags);
                tool.setPopularity(popularity);
                tool.setFavoriteCount(random.nextInt(60));
                tool.setRatingCount(random.nextInt(50));
                double avg = 3.5 + random.nextDouble() * 1.5;
                tool.setAverageRating(Math.round(avg * 10.0) / 10.0);
                tool.setCreatedAt(createdAt);

                all.add(tool);
            }

            repository.saveAll(all);
        };
    }
}
