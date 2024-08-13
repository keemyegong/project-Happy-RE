package com.example.happyre.util;

import jakarta.persistence.AttributeConverter;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;

public class AttributeEncryptor implements AttributeConverter<String, String> {

    private static String secretKey;
    private static TextEncryptor encryptor;

    public static void setSecretKey(String sk){
        secretKey = sk;
        encryptor = Encryptors.text(secretKey, "12341522");
        System.out.println("Key has been set: " + secretKey);
    }

    public AttributeEncryptor(){

    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) {
            return null;
        }
        return encryptor.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return encryptor.decrypt(dbData);
    }

}
