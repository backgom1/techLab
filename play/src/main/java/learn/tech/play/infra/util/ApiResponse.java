package learn.tech.play.infra.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private final boolean success;
    private final String message;
    private final String messageCode;
    private final T data;

    private ApiResponse(boolean success, String message, String messageCode, T data) {
        this.success = success;
        this.message = message;
        this.messageCode = messageCode;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, null, data);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    public static <T> ApiResponse<T> success(T data, String message, String messageCode) {
        return new ApiResponse<>(true, message, messageCode, data);
    }

    public static <T> ApiResponse<T> success(String message, String messageCode) {
        return new ApiResponse<>(true, message, messageCode, null);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, null, data);
    }

    public static <T> ApiResponse<T> failure(String message, String messageCode) {
        return new ApiResponse<>(false, message, messageCode, null);
    }

    public static <T> ApiResponse<T> failure(String message, String messageCode, T data) {
        return new ApiResponse<>(false, message, messageCode, data);
    }
}
