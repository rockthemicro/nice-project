package com.alexandru.timemanagement.dto;

import com.alexandru.timemanagement.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Integer id;
    private String username;
    private String password;
    private User.RoleEnum role;
    private Integer preferredWorkingHours;
}
