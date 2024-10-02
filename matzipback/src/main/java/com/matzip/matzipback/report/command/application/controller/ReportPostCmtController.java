package com.matzip.matzipback.report.command.application.controller;

import com.matzip.matzipback.report.command.application.service.ReportPostCmtService;
import com.matzip.matzipback.report.command.dto.PostCmtReportReqDTO;
import com.matzip.matzipback.responsemessage.SuccessCode;
import com.matzip.matzipback.responsemessage.SuccessResMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ReportPostCmtController {

    private final ReportPostCmtService reportPostCmtService;

    @PostMapping("/postcomment/report")
    public ResponseEntity<SuccessResMessage> createPostCmtReport(@RequestBody PostCmtReportReqDTO postCmtReportDTO) {
        boolean savedPostCmtReport = reportPostCmtService.savePostCmtReport(postCmtReportDTO);
            return ResponseEntity.ok(new SuccessResMessage(SuccessCode.BASIC_SAVE_SUCCESS));
    }

}
