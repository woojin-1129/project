package com.work.worktogether.vo.page;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageCommute {
    private int startNo = 1, endNo;
    private int listSize = 18, blockSize = 5;
    private int startPage = 1, endPage;
    private int totSize, totPage;
    private int nowPage = 1;
    private String findStr;
    private String current;

    public PageCommute() {}
    public PageCommute(int totSize, int nowPage) {
        this.totSize = totSize;
        this.nowPage = nowPage;
        pageCompute();
    }

    public void pageCompute() {
        totPage = (int) Math.ceil(totSize / (double) listSize);
        endNo = listSize * nowPage;
        startNo = endNo - listSize;
        if (endNo > totSize)
            endNo = totSize;
        
        endPage = (int) Math.ceil(nowPage / (double) blockSize) * blockSize;
        startPage = endPage - blockSize + 1;
        if (endPage > totPage)
            endPage = totPage;
    }
}
