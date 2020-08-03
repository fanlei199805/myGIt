<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2020/7/31
  Time: 10:58
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<style>
    .star {
        margin-top: 45px;
        padding: 40px 10px;
        text-align: center;
        float: left;
    }

    #ym {
        border: #337AB7 solid 1px;
        border-radius: 7px;
    }
</style>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="./css/bootstrap.min.css"/>
    <title>主頁</title>
</head>
<body>
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="nav-header">
            <a class="navbar-brand">你好</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a>Home</a></li>
                <li><a>Help</a></li>
                <li><a>about</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <div id="btns" class="btn-group btn-group-sm" style="padding-top: 8px; padding-right: 30px;">
                    <button id="btn1" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
                            style="width: 100px;">
                        ${USER_SESSION.username} <span class="caret"></span>
                    </button>
                    <ul id='uu' class="dropdown-menu" role="menu" style="padding-left: 30px; border: 0px;">
                        <li><a href="#">个人信息</a></li>
                        <li><a href="#">修改密码</a></li>
                        <li><a href="/logout">注销</a></li>
                    </ul>
                </div>
            </ul>
        </div>
    </div>
</nav>
<div class="container">

    <div class="row">
        <div class="star col-sm-12" style="height: 600px;">
            <div class="col-sm-2">
                <div class="list-group">
                    <a class="list-group-item" href="/queryall" id="a1">123</a>
                    <a class="list-group-item" href="#" id="a2">123</a>
                    <a class="list-group-item" href="#">123</a>
                </div>
            </div>
            <div class="col-sm-10">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>用户名</th>
                        <th>电话</th>
                        <th>用户类别</th>
                        <th>用户权限</th>
                    </tr>
                    </thead>
                    <tbody id="tab" >
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<script>
    $(function () {
        userlist();
    })

    function userlist() {
        $.post({
            url: "queryall",
            data: {},
            success: function (data) {
                var json =JSON.parse(data);
                var html = '';
               $.each(json,function (ind,val) {
                   var user_t = val.user_type;
                   var vip_t = val.vip_type;
                   if (user_t != "1314") {
                       user_t = "普通用户";
                   }else {
                       user_t = "管理员";
                   }
                   if (vip_t != "1000") {
                       vip_t = "无权限";
                   }else {
                       vip_t = "管理员权限";
                   }
                   html += '<tr><td>'+val.username+'</td><td>'+val.phone+'</td>' +
                       '<td>'+user_t+'</td><td>'+vip_t+'</td></tr>';
               });
               $('#tab').html(html);
            }
        },JSON)
    }
</script>
