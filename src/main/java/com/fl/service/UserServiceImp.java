package com.fl.service;

import com.fl.dao.UserDao;
import com.fl.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UserDao dao;

    @Override
    public User login(String username, String password) {
        return dao.login(username, password);
    }

    @Override
    public List<User> queryall() {
        return dao.queryall();
    }
}
