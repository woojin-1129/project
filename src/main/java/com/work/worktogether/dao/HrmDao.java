package com.work.worktogether.dao;

import java.io.File;
import java.util.List;
import java.util.UUID;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.DepartmentVo;
import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.TeamVo;
import com.work.worktogether.vo.TierCodeVo;
import com.work.worktogether.vo.page.Page;



@Component
public class HrmDao {
    SqlSession session;
    Page page;
    // String uploadPath =
    // "C:/Users/y/Desktop/WorkTogether/src/main/resources/static/upload/";
    String uploadPath = "C:\\Users\\y\\Desktop\\WorkTogether\\src\\main\\resources\\static\\upload\\";

    public HrmDao() {
        session = MybaFactory.getFactory().openSession();
    }

    public List<EmployeesVo> selectAll() {
        List<EmployeesVo> list = session.selectList("hrm.all");
        return list;
    }

    public List<EmployeesVo> select(Page page) {
        List<EmployeesVo> list = null;
        int totSize = getTotSize(page);
        page.setTotSize(totSize);
        page.pageCompute();
        this.page = page;
        list = session.selectList("hrm.select", page);
        return list;
    }

    public int getTotSize(Page page) {
        int totSize = session.selectOne("hrm.totSize", page);
        return totSize;
    }

    public EmployeesVo view(int sno) {
        // sno에 해당하는 본문글 1건
        EmployeesVo vo = session.selectOne("hrm.view", sno);
        return vo;
    }

    public List<TeamVo> teamName(String departName) {
        List<TeamVo> list = session.selectList("hrm.teamName", departName);
        return list;
    }

    public String dirNumber(int tier, String departCode, String teamCode) {
        EmployeesVo vo = new EmployeesVo();
        vo.setTier(tier - 1);
        vo.setDepartCode(departCode);
        vo.setTeamCode(teamCode);
        String msg = session.selectOne("hrm.dirNumber", vo);
        return msg;
    }

    public String selectEmployeeNumber(){
        return session.selectOne("hrm.getEmployeeNumber");
    }

    // 저장하기
    public String registerR(EmployeesVo vo, List<MultipartFile> mul) {
        String msg = "";
        int cnt = 0;
        try {
            int sno = session.selectOne("hrm.getSno", "i");
            vo.setSno(sno);
            cnt = session.insert("hrm.register", vo);
                if (cnt < 1) {
                    msg = "저장 중 오류 발생";
                    throw new Exception(msg);
                }
            for (MultipartFile f : mul) {
                if (f.getOriginalFilename()==("")) {
                    break;
                }

                UUID uuid = UUID.randomUUID();
                String sysFile = String.format("%s-%s", uuid, f.getOriginalFilename());

                vo.setSysPhoto(sysFile);
                vo.setOriPhoto(f.getOriginalFilename());

                File saveFile = new File(uploadPath + sysFile);
                f.transferTo(saveFile);
                

                cnt = session.insert("hrm.registerAtt", vo);
                if (cnt < 1) {
                    msg = "저장 중 오류 발생";
                    throw new Exception(msg);
                }
            }

            session.commit();
            msg = "저장되었습니다.";

        } catch (Exception ex) {
            msg = ex.getMessage();
            session.rollback();

            // 첨부 이미지 삭제
            File delFile = new File(uploadPath + vo.getSysPhoto());
            if (delFile.exists()) {
                delFile.delete();
            }
        }
        return msg;
    }

    // 삭제하기
    public String deleteR(int sno) {
        String msg = "";
        EmployeesVo vo = session.selectOne("hrm.view", sno);
        try {
            /* 게시물 삭제 */
            int cnt = session.delete("hrm.delete", sno);
            if (cnt < 1) {
                msg = "게시글 삭제중 오류 발생";
                throw new Exception(msg);
            }

            if (vo.getSysPhoto() != null || vo.getSysPhoto() != "") { // 첨부파일이 있는 경우
                /* 첨부파일 삭제 */
                File file = new File(uploadPath + vo.getSysPhoto());
                if (file.exists())
                    file.delete();
            }
            session.commit();
            msg = "삭제되었습니다.";
        } catch (Exception ex) {
            msg = ex.getMessage();
            session.rollback();
        }
        return msg;
    }

    // 수정하기
    public String modifyR(EmployeesVo vo, List<MultipartFile> mul) {
        String msg = "";
        int cnt = 0;
        String del = vo.getSysPhoto();

        try {
            // 수정될 내용을 담아서 update 실행
            cnt = session.update("hrm.updateText", vo);
            if (cnt < 1) {
                msg = "수정중 오류발생1";
                throw new Exception(msg);
            }
            /* 새로운 첨부파일 업로드 */
            for (MultipartFile f : mul) {
                if (f.getOriginalFilename()==("")) {
                    continue;
                }
                UUID uuid = UUID.randomUUID();
                String sysFile = String.format("%s-%s", uuid, f.getOriginalFilename());

                // 이전 sysPhoto 및 oriPhoto 삭제
                if (del != null && !del.equals("")) {
                    File oldFile = new File(uploadPath + del);
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }
                // 신규 파일 저장
                File saveFile = new File(uploadPath + sysFile);
                f.transferTo(saveFile);

                vo.setSysPhoto(sysFile);
                vo.setOriPhoto(f.getOriginalFilename());

                // 수정될 내용을 담아서 update 실행
                cnt = session.update("hrm.updateImage", vo);
                if (cnt < 1) {
                    msg = "수정중 오류발생2";
                    throw new Exception(msg);
                }
            }

            /* 삭제된 첨부 파일 처리(delAtt) */
            if (del != null && !del.equals("")) { // 첨부파일이 있는 경우
                /* 첨부파일 삭제 */
                File file = new File(uploadPath + del);
                if (file.exists()) {
                    file.delete();
                }
            }
            session.commit();
            msg = "수정이 완료되었습니다.";

        } catch (Exception ex) {
            session.rollback();
            msg = ex.getMessage();
            File file = new File(uploadPath + vo.getSysPhoto());
            if (file.exists()) {
                file.delete();
            }
        }
        return msg;
    }

    public Page getPage() {
        return this.page;
    }

    public List<DepartmentVo> allDepartment() {
        List<DepartmentVo> list = session.selectList("hrm.allDepartment");
        return list;
    }

    public List<TierCodeVo> allTier() {
        List<TierCodeVo> list = session.selectList("hrm.allTierCode");
        return list;
    }

    public List<TeamVo> allTeam(String departCode) {
        List<TeamVo> list = session.selectList("hrm.allTeam" , departCode);
        return list;
    }
}
