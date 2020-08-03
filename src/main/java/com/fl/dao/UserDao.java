package com.fl.dao;

import com.fl.pojo.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserDao {
    User login(@Param("username") String username,@Param("password") String password);
    User queryUser(@Param("user_id") Integer user_id);
    List<User> queryall();
}
