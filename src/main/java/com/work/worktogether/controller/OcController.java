package com.work.worktogether.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.OcDao;
import com.work.worktogether.vo.DepartmentVo;
import com.work.worktogether.vo.EmployeesVo;

@RestController
public class OcController {

    @Autowired
    OcDao dao;

    @RequestMapping("/ocMain")
    public ModelAndView ocList() {
        ModelAndView mv = new ModelAndView();
        List<DepartmentVo> departList = dao.selectDepart(); // 부서 정보 조회
        List<Map<String , Object>> ocList = new ArrayList<>(); // 최종 결과 리스트
        for (DepartmentVo depart : departList) {
            Map<String, Object> map = new HashMap<>();
            map.put("departName", depart.getDepartName());
            List<EmployeesVo> employees = dao.selectEmployeeDepart(depart.getDepartCode()); // 부서별 직원 조회
            map.put("employees", employees);
            ocList.add(map);
        }
        mv.addObject("ocList", ocList);
        mv.setViewName("/oc/oc");
        return mv;
    }

    @RequestMapping("/search")
    public ModelAndView search(String findStr) {
        ModelAndView mv = new ModelAndView();
        List<DepartmentVo> departList = dao.selectDepartTest(findStr); // 부서 정보 조회
        List<Map<String, Object>> ocList = new ArrayList<>(); // 최종 결과 리스트
        for (DepartmentVo depart : departList) {
            Map<String, Object> tempMap = new HashMap<>();
            tempMap.put("findStr", findStr);
            tempMap.put("depart", depart.getDepartCode());

            List<EmployeesVo> employees = dao.selectEmployeeDepartTest(tempMap); // 부서별 직원 조회
            Map<String, Object> map = new HashMap<>();
            map.put("departName", depart.getDepartName());
            map.put("employees", employees);
            ocList.add(map);
        }
        mv.addObject("ocList", ocList);

        mv.setViewName("/oc/oc");
        return mv;
    }
}
