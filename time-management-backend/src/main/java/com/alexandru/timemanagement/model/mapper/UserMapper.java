package com.alexandru.timemanagement.model.mapper;

import com.alexandru.timemanagement.dto.UserDto;
import com.alexandru.timemanagement.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    User userDtoToUser(UserDto userDto);
    UserDto userToUserDto(User user);
}
