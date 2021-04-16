package com.alexandru.timemanagement.utils;

import com.alexandru.timemanagement.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class Commons {
    public static boolean checkUserDetailsRole(UserDetails userDetails, User.RoleEnum role) {

        for (GrantedAuthority ga : userDetails.getAuthorities()) {
            if (ga.getAuthority().equals(role.toString())) {
                return true;
            }
        }
        return false;
    }

    public static UserDetails getUserDetails() {
        return (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
}
