package com.fl.controller;

import com.fl.pojo.JsonData;
import com.fl.pojo.MD5_test;
import com.fl.pojo.User;
import com.fl.service.UserService;
import org.apache.ibatis.annotations.Param;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@Controller
@ContextConfiguration(locations = {"classpath*:spring-mybatis.xml"})
public class UserController {
    @Autowired
    private UserService service;
    public MD5_test md5;
     ObjectMapper map = new ObjectMapper();

    @RequestMapping("/login")
    public Object login(@Param("username") String username, @Param("password") String password,
                        HttpSession session
    ) {
        String pwd = md5.MD5(password);
        User user = service.login(username, pwd);
        if (user != null) {
            session.setAttribute("USER_SESSION", user);
            return "redirect:/main";
        } else {
            return "redirect:/log";
        }
    }

    @RequestMapping(path = "/log")
    public Object log() {
        return "login";
    }

    @RequestMapping(path = "/main")
    public String tomain() {
        return "main";
    }

    @RequestMapping(path = "/logout")
    public String tomain(HttpSession session) {
        session.invalidate();
        return "redirect:/log";
    }
    @RequestMapping(path = "/queryall")
    @ResponseBody
    public Object querylist(Model model) throws IOException {
        List<User> userList = service.queryall();
        if (userList!=null){
            //model.addAttribute("userlist",userList);
            String str = map.writeValueAsString(userList);
            return str;
        }else {
            return JsonData.error("查询错误");
        }
    }

}
