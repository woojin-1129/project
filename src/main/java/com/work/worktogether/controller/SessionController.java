package com.work.worktogether.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
public class SessionController {
    
    @RequestMapping("/refresh-session")
    @ResponseBody
    public String refreshSession(HttpSession httpSession) {
        // 세션을 갱신합니다. 세션의 최대 비활동 시간을 연장하려면 다음과 같이 사용합니다.
        httpSession.setMaxInactiveInterval(3600); // 1시간
        return "세션이 갱신되었습니다.";
    }
}
