package com.work.worktogether.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.SignDao;
import com.work.worktogether.vo.page.Page;
import com.work.worktogether.vo.sign.SignPay;
import com.work.worktogether.vo.sign.SignPayValueVo;
import com.work.worktogether.vo.sign.SignPayVo;
import com.work.worktogether.vo.sign.SignVacationVo;
import com.work.worktogether.vo.sign.SignVo;

import jakarta.servlet.http.HttpSession;

@RestController
public class SignController {

    @Autowired
    SignDao dao;
    
    @RequestMapping("/signView")
    public ModelAndView signView(Page page , HttpSession session) {
        ModelAndView mv = new ModelAndView();
        page.setEmployeeNumber(session.getAttribute("employeeNumber").toString());
        List<SignVo> list = dao.select(page);
        page = dao.getPage();
        mv.addObject("list", list);
        mv.addObject("page", page);
        mv.setViewName("sign/sign");
        return mv;
    }

    @RequestMapping("/signRegister")
    public ModelAndView signRegister(Page page) {
        ModelAndView mv = new ModelAndView();
        mv.addObject("page", page);
        mv.setViewName("sign/signRegister");
        return mv;
    }

    @RequestMapping("/paymentForm")
    public ModelAndView paymentForm() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("sign/signPayment");
        return mv;
    }

    @RequestMapping("/signPaymentR")
    public String signPaymentR(@ModelAttribute SignPayVo payVo, @ModelAttribute SignPayValueVo valVo,
            HttpSession session) {
        String msg = dao.signPaymentR(payVo, valVo, session , "저장");
        return msg;
    }
    
    @RequestMapping("/signPaymentTemp")
    public String signPaymentTemp(@ModelAttribute SignPayVo payVo, @ModelAttribute SignPayValueVo valVo,
            HttpSession session) {
            String msg = dao.signPaymentR(payVo, valVo, session , "임시");
        return msg;
    }
    
    @RequestMapping("/signPaymentView")
    public ModelAndView signViewR(Page page, int sno , String name) {
        ModelAndView mv = new ModelAndView();
        SignPay vo = dao.signPaymentView(sno);
        mv.addObject("vo", vo);
        mv.addObject("page", page);
        mv.addObject("name" , name);
        mv.setViewName("sign/signPayMentView");
        return mv;
    }
    
    @RequestMapping("/signCk")
    public String signCk(HttpSession session, int sno) {
        String msg = dao.signCk(session, sno);
        return msg;
    }
    
    @RequestMapping("/rejectionR")
    public String rejectionR(@ModelAttribute SignVo vo) {
        String msg = dao.rejectionR(vo);
        return msg;
    }

    @RequestMapping("/vacationForm")
    public ModelAndView vacation() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("sign/signVacation");
        return mv;
    }

    @RequestMapping("/signVacationR")
    public String signVacationR(@ModelAttribute SignVacationVo vo, HttpSession session) {
        String msg = dao.signVacationR(vo, session , "저장");
        return msg;
    }

    @RequestMapping("/signVacationTemp")
    public String signVacationTemp(@ModelAttribute SignVacationVo vo, HttpSession session) {
        String msg = dao.signVacationR(vo, session , "임시");
        return msg;
    }
    
    @RequestMapping("/signVacationView")
    public ModelAndView signVacationView(Page page, int sno, String name) {
        ModelAndView mv = new ModelAndView();
        SignPay vo = dao.signVacationView(sno);

        mv.addObject("vo", vo);
        mv.addObject("page", page);
        mv.addObject("name", name);
        mv.setViewName("sign/signVacationView");
        return mv;
    }

    @RequestMapping("/signSubmit")
    public String signSubmit(int sno, HttpSession session) {
        String msg = dao.signSubmit(sno, session);
        return msg;
    }
    
    @RequestMapping("/signDelete")
    public String signDelete(int sno , String kind) {
        String msg = dao.signDelete(sno , kind);
        return msg;
    }

    @RequestMapping("signVacationModify")
    public ModelAndView signVacationModify(Page page, int sno, String kind) {
        ModelAndView mv = new ModelAndView();
        SignVacationVo vo = dao.signVacationModify(sno);
        mv.addObject("vo", vo);
        mv.addObject("page", page);
        mv.addObject("kind", kind);
        mv.setViewName("sign/signVacationModify");
        return mv;
    }
    
    @RequestMapping("/signVacationModifyR")
    public String signVacationModifyR(@ModelAttribute SignVacationVo vo) {
        String msg = dao.signVacationModifyR(vo);
        return msg;
    }

    @RequestMapping("/signPaymentModify")
    public ModelAndView signPaymentModify(Page page, int sno, String kind) {
        ModelAndView mv = new ModelAndView();
        SignPay vo = dao.signPaymentModify(sno);
        mv.addObject("vo", vo);
        mv.addObject("page", page);
        mv.addObject("kind", kind);
        mv.setViewName("sign/signPaymentModify");
        return mv;
    }

    @RequestMapping("/signPaymentModifyR")
    public String signPaymentModifyR(SignPayVo spVo , SignPayValueVo spvVo) {
        String msg = dao.signPaymentModifyR(spVo , spvVo);
        return msg;
    }
}
