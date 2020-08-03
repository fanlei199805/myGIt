package com.fl.service;


import com.fl.pojo.User;

import java.util.List;

public interface UserService {
    User login(String username, String password);
    List<User> queryall();
}
