package com.alexandru.timemanagement;

import com.alexandru.timemanagement.dto.input.RegisterInput;
import com.alexandru.timemanagement.dto.output.AuthOutput;
import com.alexandru.timemanagement.model.User;
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
	private static final List<String> tokens = new ArrayList<>();
	private final List<User> users = new ArrayList<>();

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
		users.add(user);

		user = new User(
				0,
				"user2",
				bCryptPasswordEncoder.encode("passwd"),
				User.RoleEnum.MANAGER,
				2);
		user = userRepository.save(user);
		users.add(user);

		user = new User(
				0,
				"user3",
				bCryptPasswordEncoder.encode("passwd"),
				User.RoleEnum.ADMIN,
				3);
		user = userRepository.save(user);
		users.add(user);


		if (!initiatedTokens) {
			initiateTokens();
			initiatedTokens = true;
		}
	}

	@AfterEach
	public void tearDown() {
		for (User user : users) {
			userRepository.deleteById(user.getId());
		}
		users.clear();
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

		mockMvc
				.perform(post("/api/user/register")
						.contentType(APPLICATION_JSON)
						.content(riString))
				.andExpect(status().isOk());

		String token = performAuthAndGetToken("foo", "bar");
		mockMvc
				.perform(get("/api/test/ping")
						.header(SecurityConstants.HEADER_STRING,
								SecurityConstants.TOKEN_PREFIX + token))
				.andExpect(status().isOk());
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

		String content = mvcResult.getResponse().getContentAsString();
		AuthOutput authOutput = objectMapper.readValue(content, AuthOutput.class);

		return authOutput.getToken();
	}
}
