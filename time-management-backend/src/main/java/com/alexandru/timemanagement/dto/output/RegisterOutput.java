package com.alexandru.timemanagement.dto.output;

import com.alexandru.timemanagement.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterOutput extends Output {
    private UserDto user;
}
