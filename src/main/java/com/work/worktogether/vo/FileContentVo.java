package com.work.worktogether.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileContentVo {
    int sno,pSno;
    String oriFile,sysFile,code;

    public FileContentVo(int sno,String oriFile,String sysFile){
        this.pSno=sno;
        this.oriFile = oriFile;
        this.sysFile = sysFile;
    }
}
