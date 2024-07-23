package com.example.s3api.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;

@Service
public class S3Service {
    @Value("${s3.bucket}")
    private String bucketName;

    private final AmazonS3 s3Client;

    public S3Service(AmazonS3 s3Client) {
        this.s3Client = s3Client;
    }

    public void uploadFile(String fileName, InputStream inputStream, long contentLength) {

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(contentLength);
        metadata.setContentType("audio/mpeg");  // MP3 파일의 Content-Type

        s3Client.putObject(bucketName, fileName, inputStream, metadata);
    }

}
