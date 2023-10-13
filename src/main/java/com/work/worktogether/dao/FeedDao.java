package com.work.worktogether.dao;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.FileContentVo;
import com.work.worktogether.vo.feed.FeedListVo;
import com.work.worktogether.vo.feed.FeedVo;




@Component
public class FeedDao {
    SqlSession session;
    String uploadPath="C:\\Users\\y\\Desktop\\WorkTogether\\src\\main\\resources\\static\\upload\\";
    

    public FeedDao(){
        session = MybaFactory.getFactory().openSession();
    }
    //로그인이후 사용자 code찾기
    public String findCodes(String code, String employeeNumber) {
        if("depart".equals(code)){
            code = session.selectOne("feed.departChange",employeeNumber);
        }
        if ("team".equals(code)) {
            code = session.selectOne("feed.teamChange", employeeNumber);
        }
        return code;
    }

    //대화목록
    public List<FeedVo> peedView(String code){
        List<FeedVo> list = null;
        list = session.selectList("feed.select",code);

        return list;
    }
    //파일목록
    public List<FileContentVo> fileView(String code){
        List<FileContentVo> attFiles=null;
        attFiles = session.selectList("feed.attFile",code);

        return attFiles;
    }

    // 게시판 상단이름
    public String feedName(String code) {
        String feedName;
        if (code.equals("employee")) {
            feedName = "";
        } else {
            feedName = session.selectOne("feed.feedName", code);
        }

        return feedName;
    }

    //글 등록
    public String register(FeedVo vo, List<MultipartFile> mul) {
    String msg="";
        int cnt=0;
        List<FileContentVo> attFiles = new ArrayList<>();//업로드된 파일정보,List<MultipartFile>mul를 직접 사용할수없어서 가공해서사용
        try{
            int sno = session.selectOne("feed.getSerial","i");
            vo.setSno(sno);
            cnt = session.insert("feed.register", vo);
            if(cnt<1){
                throw new Exception(msg);
            }
            for (MultipartFile f : mul) {
                if(f.getOriginalFilename() == (""))continue;
                UUID uuid = UUID.randomUUID();
                String sysFile = String.format("%s-%s" , uuid.toString() , f.getOriginalFilename());
                File saveFile = new File(uploadPath + sysFile);
                f.transferTo(saveFile);
                FileContentVo att = new FileContentVo(sno,f.getOriginalFilename(),sysFile);
                attFiles.add(att);
            }
            if(attFiles.size()>0){//첨부파일이 있는경우
                cnt = session.insert("feed.fileRegister", attFiles);
                if(cnt != attFiles.size()){
                    msg="첨부파일정보저장중 오류발생";
                    throw new Exception(msg);
                }
            }
            session.commit();
        }
        catch(Exception ex){
            msg = "오류발생!!";
            session.rollback();
            for(FileContentVo att : attFiles){
                File delFile = new File(uploadPath+att.getSysFile());
                if(delFile.exists()) delFile.delete();
            }
        }
        return msg;
    }

    //글 삭제
    public String delete(FeedVo vo) {
        String msg = "";
        int cnt = 0;
        List<FileContentVo> delFileList = null;
        try {
            //개시물삭제
            cnt = session.delete("feed.delete", vo.getSno());
            if (cnt < 1) {
                msg = "계시물 삭제중 오류발생";
                throw new Exception(msg);
            }
            //삭제할 파일목록
            delFileList = session.selectList("feed.attFiles", vo.getSno());

            String[] delFile = new String[delFileList.size()];
            for (int i = 0; i < delFileList.size(); i++) {
                FileContentVo att = delFileList.get(i);
                delFile[i] = att.getSysFile();
            }
            if (delFileList.size() > 0) {//첨부파일이 있는경우
                cnt = session.delete("feed.deleteAtt", delFile);
                if (cnt != delFile.length) {
                    msg = "첨부파일 정보 삭제중 오류발생";
                    throw new Exception(msg);
                }
                //첨부파일 삭제
                for (String f : delFile) {
                    File file = new File(uploadPath + f);
                    if (file.exists())
                        file.delete();
                }
            }
            session.commit();
        } catch (Exception ex) {
            msg = ex.getMessage();
            session.rollback();
        }
        return msg;
    }
    
    public List<FeedListVo> feedList(String code) {
        List<FeedListVo> list = null;

        if (code.equals("departAll")) {
            list = session.selectList("feed.departAll");
        } else if (code.equals("teamAll")) {
            list = session.selectList("feed.teamAll");
        } else {
            String codes = code.replaceAll("All", "");
            list = session.selectList("feed.findTeam", codes);
        }
        return list;
    }
    
    public List<FeedVo> callDate(String code) {
        List<FeedVo> list = null;
        list = session.selectList("feed.callDateAll", code);
        return list;
    }
}
