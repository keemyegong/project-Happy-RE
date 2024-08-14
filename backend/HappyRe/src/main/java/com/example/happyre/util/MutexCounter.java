package com.example.happyre.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MutexCounter{
    private Integer count;
    public void increase(){
        this.count++;
    }

    public void decrease(){
        this.count--;
    }
}
