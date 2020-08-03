package com.fl.pojo;

//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;

//@Data
////@AllArgsConstructor
////@NoArgsConstructor
public class User {
    private String username;
    private String password;
    private Integer user_id;
    private String phone;
    private Integer user_type;
    private Integer vip_type;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getUser_type() {
        return user_type;
    }

    public void setUser_type(Integer user_type) {
        this.user_type = user_type;
    }

    public Integer getVip_type() {
        return vip_type;
    }

    public void setVip_type(Integer vip_type) {
        this.vip_type = vip_type;
    }

    public User() {
    }

    @Override
    public String toString() {
        return "user{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", user_id=" + user_id +
                ", phone='" + phone + '\'' +
                ", user_type=" + user_type +
                ", vip_type=" + vip_type +
                '}';
    }
}
