package com.alexandru.timemanagement.dto.output;

import com.alexandru.timemanagement.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUsersOutput extends Output {
    private UserDto[] users;
}
