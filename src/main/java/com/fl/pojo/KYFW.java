package com.fl.pojo;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//解决开发初期的跨域问题
public class KYFW implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // TODO Auto-generated method stub

    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        chain.doFilter(req, res);//实现浏览器的跨域使用
    }

    @Override
    public void destroy() {
        // TODO Auto-generated method stub

    }
}
