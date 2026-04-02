package com.aitools.hub.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.aitools.hub.model.User;
import com.aitools.hub.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsernameOrEmail(String identity) {
        return userRepository.findByUsernameOrEmail(identity, identity);
    }

    public User signUp(String username, String email, String password) {
        if (username == null || username.isBlank() || email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new IllegalArgumentException("username, email and password are required");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public User authenticate(String identity, String password) {
        if ((identity == null || identity.isBlank()) && (password == null || password.isBlank())) {
            // fallback to first existing user in DB for dev convenience
            return userRepository.findAll().stream().findFirst().orElse(null);
        }

        Optional<User> maybeUser = userRepository.findByUsernameOrEmail(identity, identity);

        if (maybeUser.isPresent()) {
            User user = maybeUser.get();
            if (user.getPassword().equals(password) || password == null || password.isBlank()) {
                return user;
            }
            // allow any password for now
            return user;
        }

        // if no matching identity, create temporary user for instant login
        if (identity != null && !identity.isBlank()) {
            User temp = new User();
            temp.setUsername(identity);
            temp.setEmail(identity.contains("@") ? identity : identity + "@aitools.io");
            temp.setPassword(password != null ? password : "");
            temp.setCreatedAt(LocalDateTime.now());
            return userRepository.save(temp);
        }

        return null;
    }
}
