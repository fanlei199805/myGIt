package com.fl.interceptor;

import com.fl.pojo.User;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class Loginterceptor implements HandlerInterceptor {
//    @Override
//    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException, ServletException {
//        String url = request.getRequestURI();
//        String path = request.getServletPath();
//        HttpSession session = request.getSession();
//        User u = (User) session.getAttribute("USER_SESSION");
//        if (url.indexOf("/login")>=0 || path=="/log") {
//            return true;
//        }
//        if (u != null) {
//            return true;
//        }
//        response.setCharacterEncoding("UTF-8");
//        response.getWriter().print("请登录后再试！");
//        request.setCharacterEncoding("UTF-8");
//        request.getRequestDispatcher("WEB-INF/jsp/login.jsp").forward(request, response);
//        return false;
//    }
}
