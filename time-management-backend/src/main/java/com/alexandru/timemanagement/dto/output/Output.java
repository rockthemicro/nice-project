package com.alexandru.timemanagement.dto.output;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Output {
    private StatusEnum statusEnum = StatusEnum.SUCCESS;
    private List<Message> messages = new ArrayList<>();

    public Output addMessage(StatusEnum statusEnum, String content) {
        if (messages == null) {
            messages = new ArrayList<>();
        }
        messages.add(new Message(statusEnum, content));

        return this;
    }

    public enum StatusEnum {
        SUCCESS,
        WARNING,
        ERROR
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message {
        private StatusEnum statusEnum = StatusEnum.SUCCESS;
        private String content;
    }
}
