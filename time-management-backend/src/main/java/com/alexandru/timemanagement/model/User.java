package com.alexandru.timemanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private RoleEnum role;

    @Column
    private Integer preferredWorkingHours;

    @Getter
    public enum RoleEnum {
        USER ("USER"),
        MANAGER ("MANAGER"),
        ADMIN ("ADMIN"),
        ;

        private final String role;

        RoleEnum(String role) {
            this.role = role;
        }
    }
}
