package com.work.worktogether.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.work.worktogether.dao.LoginDao;
import com.work.worktogether.vo.EmployeesVo;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
public class LoginController {
    @Autowired
    LoginDao dao;

    // 로그인 구현
    @RequestMapping("/loginCheck")
    public String loginR(HttpSession session, EmployeesVo vo) {
        String msg = "";
        msg = dao.loginCheck(session, vo);
        return msg;
    }

    // 컨트롤러
    @RequestMapping("/logoutR")
    public void logoutR(HttpSession session) {
        session.setAttribute("id", null);
        session.setAttribute("name", null);
        session.setAttribute("employeeNumber", null);
        session.setAttribute("admin", null);
        session.setAttribute("comName", null);
        session.setAttribute("departCode", null);
        session.setAttribute("teamCode", null);
    }

    @RequestMapping("/loginCookieSet")
    public void setCookie(HttpServletResponse res, String id) {
        Cookie cookie = new Cookie("ItDa_id", id);
        cookie.setMaxAge(60 * 60 * 168);
        cookie.setPath("/");
        res.addCookie(cookie);
    }

    @RequestMapping("/loginCookieGet")
    public String getCookie(HttpServletRequest req) {
        String id = "";
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                String name = c.getName();
                String val = c.getValue();
                if (name.equals("ItDa_id")) {
                    id = val;
                }
            }
        }
        return id;
    }

    @RequestMapping("/loginCookieDelete")
    public void deleteCookie(HttpServletResponse res) {
        Cookie cookie = new Cookie("ItDa_id", null);
        cookie.setMaxAge(0); 
        res.addCookie(cookie);

    }
}
