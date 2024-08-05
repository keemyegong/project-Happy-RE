package com.example.happyre.exception.diary;

public class DiaryEntryAlreadyExistsException extends RuntimeException {
    public DiaryEntryAlreadyExistsException(String message) {
        super(message);
    }
}