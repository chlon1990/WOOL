$(function(){
	//fileType 0: master; 1: site file
	$('#masterFileTab').addClass("active");
	initTable(0);
	initFileInput(0);
	$('#masterFileTab').click(function(){
		$('#masterFileTab').addClass("active");
		$('#siteFileTab').removeClass("active");
		initTable(0);
		initFileInput(0);
	});
	$('#siteFileTab').click(function(){
		$('#siteFileTab').addClass("active");
		$('#masterFileTab').removeClass("active");
		initTable(1);
		initFileInput(1);
	});
	$("#logout").click(function(){
		$.ajax({
			url:'/logout',
			method: 'POST'
		}).done(function(res,status){
			window.location.reload();
		});
	});
});

var initTable = function(fileType) {
	$("#historyTableId").bootstrapTable('destroy').bootstrapTable({
		method: "get",
		contentType: "application/x-www-form-urlencoded",
	    dataType:"json",
		url: "/getHistoryData?fileType="+fileType,
		cache: false,
        striped: true,
        pagination: true,                   
        showPaginationSwitch: false,
        pageSize: 10, 
        pageNumber: 1, 
        pageList: [5, 10, 15, 20],
        search: false,
        sidePagination: 'server', 
        queryParamsType:'',
        classes: 'table table-bordered',
        dataField: "rows",
		columns: [
			//`file_name`,`upload_start_time`,`upload_end_time`,`parse_start_time`,`parse_end_time`,`status` FROM parse_file_history
			{field: 'id', title: 'id'},
			{field: 'file_name', title: 'File Name', formatter: formatterFileName},
			{field: 'upload_start_time', title: 'Upload Start Time', formatter: formatterDate},
			{field: 'upload_end_time', title: 'Upload End Time',formatter: formatterDate},
			{field: 'parse_start_time', title: 'Parse Start Time',formatter: formatterDate},
			{field: 'parse_end_time', title: 'Parse End Time',formatter: formatterDate},
			{field: 'status', title: 'Status', formatter: function(value, row, index) {
				switch (value){
					case 0: return '<div style="color: blue;">upload success</div>';
					case 1: return '<div style="color: blue;">parse ongoing</div>';
					case 2: return '<div style="color: red;">parse error</div>';
					case 3: return '<div style="color: green;">parse success</div>';
					case 4: return '<div style="color: red;">parse error</div>';
				}
					
			}},
			{field: '', title: 'Action',formatter: function(value, row, index) {
                var result = "";
                if (row.status === 0) {
                	result += "<a class='btn btn-success parse-class'  style='width:80px' onclick=\"parse(\'" + row.id+'\',\''+row.file_name + '\',\''+row.file_type +"\')\" title='parse' value='Parse'><i class='glyphicon glyphicon-refresh'></i> Parse</a> ";
                } 
                if (row.status === 2 ) {
                	 result += "<a class='btn btn-danger'  style='width:80px' onclick=\"showErrorDetail(\'" + row.id + "\')\" title='errorMsg' value='errorMsg'><i class='glyphicon glyphicon-info-sign'></i> Detail</a>";
                }
                if (row.status === 4 ) {
                	result += "<a class='btn btn-danger' style='width:80px' onclick=\"showFailedDetail(\'" + row.id + "\')\" title='failedMsg' value='failedMsg'><i class='glyphicon glyphicon-remove-sign'></i> Detail</a>";
                }
                return result;
			}},
		]
	});
	$("#historyTableId").bootstrapTable("hideColumn", "id");
}
var parse = function(id,fileName,fileType){
	$.ajax({
		type: "POST",
		url: "/parse?fileName="+fileName+"&id="+id+"&fileType="+fileType,
		timeout: 1200000,
		processData : false, 
		contentType : false,
		beforeSend: function(XMLHttpRequest){ 
			setTimeout(function(){ 
				$("#historyTableId").bootstrapTable("refresh");
			}, 1000);
     	},
		success: function(responseStr) { 
			alertMsg(responseStr.message);
			$("#historyTableId").bootstrapTable("refresh");
			$(".parse-class").removeAttr("disabled");
		},
	})
}

var formatterFileName = function(value, row, index) {
	return "<a style='cursor:pointer;' onclick=\"downloadFile(\'" + row.id+'\',\''+row.file_name + '\',\''+row.file_type +"\')\" title='parse'>" + row.file_name + "<a/>";
};

var downloadFile = function(id, name) {
	var fileName = id + '_' + name;
	window.location.href = "/downloadFile?fileName="+fileName;
}
	

var formatterDate = function(value, row, index) {
	if(value === null || value === 'undefine' || value === '') {
		return null;
	}
	var date = new Date(value);
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = (date.getDate()<10?'0'+date.getDate():date.getDate())+' ';
	h = (date.getHours()<10?'0'+ date.getHours():date.getHours())+ ':';
	m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()) + ':';
	s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
	return Y+M+D+' '+h+m+s;
};

var showErrorDetail = function(id) {
	$('#errorDetail').modal({
	    backdrop:true,
	    keyboard:true,
	    show:true,
	    id: id
	});
	$("#errorTableId").bootstrapTable({method: "get",
		contentType: "application/x-www-form-urlencoded",
	    dataType:"json",
		url: "/getErrorDetail?id="+id,
		cache: false,
        striped: true,
        columns: [
        	{field: 'id', title: 'ID'},
        	{field: 'lob', title: 'Lob'},
        	{field: 'site', title: 'Site'},
        	{field: 'error_detail_info', title: 'Detail'},
        	{field: 'code', title: 'Suggestion', formatter: function(value, row, index) {
        		if (value !== null && value != 'undefined') {
        			if (parseInt(value) === 4000) {
        				return 'Please fix the data issue and re-upload the data of the entire site (Incorrect part of the master file).'
        			} else if (parseInt(value)>=5501 && parseInt(value) <= 5600) {
        				return 'Please check and fix the LoB/KPI setting in the tool, and re-upload the data of the entire site (Incorrect part of the master file)';
        			} else {
        				return 'Please contact the product development team to report the issue.';
        			}
        			
        		} else {
        			return 'Please contact the product development team to report the issue.';
        		}
        	}}
        ]
     });
	$("#errorTableId").bootstrapTable("hideColumn", "id");
	$('#errorHint').html('Please <button id="btn_dl" type="button" class="btn btn-default"> <span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span>download</button> and fix the problem. Then upload this file and parse it again.');
	$('#btn_dl').on('click', function() {
		window.location.href = "/downloadErrorFile?id="+id;
	});
	$('#dl_close').on('click', function() {
		$('#btn_dl').unbind();
		$("#errorTableId").bootstrapTable('destroy');
	});
	
};
var showFailedDetail = function(id) {
	$('#failedMsg').modal({
		backdrop:true,
		keyboard:true,
		show:true,
		id: id
	});
	$.ajax({
		type: 'get',
		url: '/getFailedDetail?id='+id,
		success: function(responseStr) { 
			if (responseStr[0]) {
				$('#failedReason').text(responseStr[0].parse_failed_reason);
				$('#failedHint').text('Please solve the problem and re-upload the file.');
			}
		}
	});
};
var initFileInput = function(fileType) {
	if (fileType === 0) {
		$("#siteForm").hide();
		$("#masterForm").show();
		$("#masterFile").fileinput({
			theme: "explorer-fa",                            
			uploadUrl: '/upload?fileType='+ fileType+"&startDate="+new Date().getTime(),         
			minFileCount: 1,                                      
			maxFileCount: 1,    
			autoReplace: true,
			overwriteInitial: false,                        
			showCancel:false,                                       
			showZoom:false,                                         
			showCaption:false,                                  
			dropZoneEnabled:true,  
			showRemove:false,                                       
//			allowedFileExtensions : ['xlsx'],
			hideThumbnailContent:true,                 
			fileActionSettings: {                               
				showRemove: true,                                   
				showUpload: false,                                  
				showDownload: false,                            
				showZoom: false,                                   
				showDrag: false,
				showUploadStats: false
			}
		});
		$("#masterFile").on("fileuploaded", function (event, data, previewId, index) {
			$("#historyTableId").bootstrapTable("refresh");
			if (data.response.success) {
				alertMsg("Upload success!");
			} else {
				alertMsg(data.response.message);
			}
		});
	} else {
		$("#masterForm").hide();
		$("#siteForm").show();
		$("#siteFile").fileinput({
			theme: "explorer-fa",                            
			uploadUrl: '/upload?fileType='+ fileType+"&startDate="+new Date().getTime(),         
			minFileCount: 1,                                      
			maxFileCount: 1,   
			fileType: fileType,
			autoReplace: true,
			overwriteInitial: false,                        
			showCancel:false,                                       
			showZoom:false,  
			showCaption:false,                                  
			dropZoneEnabled:true,                          
			showRemove:false,                                       
//			allowedFileExtensions : ['xlsx'],
			hideThumbnailContent:true,                 
			fileActionSettings: {                               
				showRemove: true,                                   
				showUpload: false,                                  
				showDownload: false,                            
				showZoom: false,                                   
				showDrag: false   
			}
		});
		$("#siteFile").on("fileuploaded", function (event, data, previewId, index) {
			$("#historyTableId").bootstrapTable("refresh");
			if (data.response.success) {
				alertMsg("Upload success!");
			} else {
				alertMsg(data.response.message);
			}
		});
	}
};

var alertMsg = function (msg) {
	$('#alertMsg').modal({
		backdrop:true,
		keyboard:true,
		show:true
	});
	$('#msgContent').text(msg);
	
}

