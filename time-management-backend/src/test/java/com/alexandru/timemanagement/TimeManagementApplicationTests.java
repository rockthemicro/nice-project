package com.alexandru.timemanagement;

import com.alexandru.timemanagement.dto.UserDto;
import com.alexandru.timemanagement.dto.input.RegisterInput;
import com.alexandru.timemanagement.dto.output.AuthOutput;
import com.alexandru.timemanagement.dto.output.GetUserOutput;
import com.alexandru.timemanagement.dto.output.Output;
import com.alexandru.timemanagement.dto.output.RegisterOutput;
import com.alexandru.timemanagement.model.User;
import com.alexandru.timemanagement.model.mapper.UserMapper;
import com.alexandru.timemanagement.repository.NoteRepository;
import com.alexandru.timemanagement.repository.UserRepository;
import com.alexandru.timemanagement.security.SecurityConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Slf4j
@AutoConfigureMockMvc
class TimeManagementApplicationTests {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private NoteRepository noteRepository;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	private static boolean initiatedTokens = false;
	/* 3 tokens; 1st is regular user, 2nd is manager, 3rd is admin */
	private static final List<String> tokens = new ArrayList<>();
	private final List<User> perTestUsers = new ArrayList<>();

	@BeforeEach
	@SneakyThrows
	public void setup() {
		User user = new User(
				0,
				"user1",
				bCryptPasswordEncoder.encode("passwd"),
				User.RoleEnum.USER,
				1);
		user = userRepository.save(user);
		perTestUsers.add(user);

		user = new User(
				0,
				"user2",
				bCryptPasswordEncoder.encode("passwd"),
				User.RoleEnum.MANAGER,
				2);
		user = userRepository.save(user);
		perTestUsers.add(user);

		user = new User(
				0,
				"user3",
				bCryptPasswordEncoder.encode("passwd"),
				User.RoleEnum.ADMIN,
				3);
		user = userRepository.save(user);
		perTestUsers.add(user);


		if (!initiatedTokens) {
			initiateTokens();
			initiatedTokens = true;
		}
	}

	@AfterEach
	public void tearDown() {
		for (User user : perTestUsers) {
			userRepository.deleteById(user.getId());
		}
		perTestUsers.clear();
	}

	@Test
	void testNonAuthenticatedRequest() throws Exception {
		mockMvc
				.perform(get("/api/test/ping"))
				.andDo(print())
				.andExpect(status().is(403));
	}

	@Test
	void testAuthenticatedRequest() throws Exception {
		mockMvc
				.perform(get("/api/test/ping")
						.header(SecurityConstants.HEADER_STRING,
								SecurityConstants.TOKEN_PREFIX + tokens.get(0)))
				.andDo(print())
				.andExpect(status().isOk());
	}

	@Test
	void testRegister() throws Exception {
		RegisterInput ri = new RegisterInput("foo", "bar");
		String riString = objectMapper.writeValueAsString(ri);

		MvcResult mvcResult = mockMvc
				.perform(post("/api/user/register")
						.contentType(APPLICATION_JSON)
						.content(riString))
				.andExpect(status().isOk())
				.andReturn();

		/* make sure the newly created user is cleaned up at the end */
		RegisterOutput registerOutput = extractContentAsTypeFromMvcResult(RegisterOutput.class, mvcResult);
		perTestUsers.add(UserMapper.INSTANCE.userDtoToUser(registerOutput.getUser()));

		String token = performAuthAndGetToken("foo", "bar");
		mockMvc
				.perform(get("/api/test/ping")
						.header(SecurityConstants.HEADER_STRING,
								SecurityConstants.TOKEN_PREFIX + token))
				.andExpect(status().isOk())
				.andReturn();

	}

	@Test
	void testRegularUserAttemptsDeleteUser() throws Exception {
		mockMvc
				.perform(get("/api/user/manage/deleteUser")
						.header(SecurityConstants.HEADER_STRING,
								SecurityConstants.TOKEN_PREFIX + tokens.get(0))
						.param("userId", String.valueOf(perTestUsers.get(0).getId())))
				.andExpect(status().is(403));
	}

	@Test
	public void testManagerCreatesManager() throws Exception {
		UserDto userDto = new UserDto(
				0,
				"manager_user",
				"pass",
				User.RoleEnum.MANAGER,
				123456);

		mockMvc
				.perform(post("/api/user/manage/createOrUpdate")
						.contentType(APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(userDto))
						.header(SecurityConstants.HEADER_STRING,
								SecurityConstants.TOKEN_PREFIX + tokens.get(1)))
				.andExpect(status().isOk());

		User user = userRepository.findByUsername("manager_user").orElseThrow();
		assertThat(user.getPreferredWorkingHours()).isEqualTo(123456);
		assertThat(user.getRole()).isEqualTo(User.RoleEnum.MANAGER);

		/* cleanup */
		perTestUsers.add(user);
	}

	@Test
	public void testManagerCreatesAdmin() throws Exception {
		UserDto userDto = new UserDto(
				0,
				"admin_user",
				"pass",
				User.RoleEnum.ADMIN,
				null);

		MvcResult mvcResult = mockMvc
				.perform(post("/api/user/manage/createOrUpdate")
						.contentType(APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(userDto))
						.header(SecurityConstants.HEADER_STRING,
								SecurityConstants.TOKEN_PREFIX + tokens.get(1)))
				.andExpect(status().isOk())
				.andReturn();

		Output output = extractContentAsTypeFromMvcResult(Output.class, mvcResult);
		assertThat(output.getStatusEnum().equals(Output.StatusEnum.ERROR));

	}

	@Test
	public void testGetUser() throws Exception {
		User regularUser = perTestUsers.get(0);
		String adminToken = tokens.get(2);

		MvcResult mvcResult = mockMvc
				.perform(get("/api/user/manage/getUser")
						.param("username", regularUser.getUsername())
						.header(SecurityConstants.HEADER_STRING,
								SecurityConstants.TOKEN_PREFIX + adminToken))
				.andExpect(status().isOk())
				.andReturn();

		UserDto regularUserDto = extractContentAsTypeFromMvcResult(GetUserOutput.class, mvcResult).getUser();
		assertThat(regularUserDto.getId()).isEqualTo(regularUser.getId());
		assertThat(regularUserDto.getPreferredWorkingHours())
				.isEqualTo(regularUser.getPreferredWorkingHours());
		assertThat(regularUserDto.getUsername()).isEqualTo(regularUser.getUsername());
		assertThat(regularUserDto.getRole()).isEqualTo(regularUser.getRole());
	}

	private void initiateTokens() throws Exception {
		for (String username : new String[] {"user1", "user2", "user3"}) {
			String token = performAuthAndGetToken(username, "passwd");
			tokens.add(token);
		}
	}

	private String performAuthAndGetToken(String username, String password) throws Exception {
		Map<String, String> creds = new HashMap<>();
		creds.put("username", username);
		creds.put("password", password);

		MvcResult mvcResult = mockMvc
				.perform(post("/api/user/auth")
						.contentType(APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(creds)))
				.andExpect(status().isOk())
				.andReturn();

		AuthOutput authOutput = extractContentAsTypeFromMvcResult(AuthOutput.class, mvcResult);
		return authOutput.getToken();
	}

	private <T> T extractContentAsTypeFromMvcResult(Class<T> clazz, MvcResult mvcResult) throws Exception {
		String content = mvcResult.getResponse().getContentAsString();
		return objectMapper.readValue(content, clazz);
	}
}
