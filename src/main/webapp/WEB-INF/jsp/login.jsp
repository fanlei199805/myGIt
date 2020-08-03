<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2020/7/31
  Time: 10:50
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="utf-8">
    <script src="js/jquery-3.4.1.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="css/bootstrap.min.css"/>
    <title>USER LOGIN</title>
</head>
<style>
    .d1 {
        width: 100%;
        height: 500px;
        background-color: sandybrown;
        opacity: 0.8;
    }

    .d2 {
        opacity: 1;
        width: 30%;
        height: 300px;
        margin: 0 auto;
        background-color: #9ACFEA;
        border: white solid 3px;
        border-radius: 15px;
    }

    .i1 {
        position: absolute;
        margin: 0 auto;
        top: 20px;
        left: 48%;
        border-radius: 50% 50% 50% 50%;
    }

    .in1 {
        border-color: #C1E2B3;
        border-radius: 6px;
        text-align: center;
    }
</style>
<body>
<div class="d1" align="center">
    <img src="img/2.jpg" style="width: 80px;" class="i1"/>
    <div class="d2" style="margin-top: 70px;"><br><br>
        <h2>用户登录</h2>
        <form action="/login">
            <br>
            <label>登录名：</label>
            <input type="text" name="username" border="3px" class="in1" placeholder="username" id="name"/><br><br>
            <label>密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
            <input type="password" name="password" class="in1" placeholder="password" id="pwd"/><br><br>
            <button type="submit" class="btn-success" id="b1" style="width: 30%; border-radius: 5px;">登录</button>
        </form>
        <button class="btn-default" id="b2" style="width: 30%; border-radius: 5px;" data-toggle="modal"
                data-target="#myModal">注册
        </button>
    </div>
</div>
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel" align="center">员工管理</h4>
            </div>
            <div class="modal-body">
                <label class="col-sm-2">姓名 :</label>
                <input type="text" class="col-sm-10"/><br/>
                <br/>
                <label class="col-sm-2">描叙 :</label>
                <textarea class="col-sm-10"></textarea>
                <br/>
                <br/>
                <br/>
                <label class="col-sm-2">选择岗位 :</label>
                <div id="btns" class="btn-group " style="margin-left: 15%;">
                    <button id="btn1" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
                            style="width: 200px;">
                        程序员 <span class="caret"></span>
                    </button>
                    <ul id='uu' class="dropdown-menu" role="menu" style="margin-left: 5%;">
                        <li><a href="#">程序员</a></li>
                        <li><a href="#">产品经理</a></li>
                        <li><a href="#">销售经理</a></li>
                    </ul>
                </div>
                <br/>
                <br/>
                <label class="col-sm-2">选择权限 :</label>
                <input type="radio" class="col-lg-8"/>编辑权限
                <input type="radio" class="col-lg-2"/>仅预览
                <br/><br/>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary">保存</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                </div>

            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<h5 align="center">@352194871@qq.com版权所有</h5>
</body>
</html>
<script>
    $(function () {
        //login();
        $('.d2').mouseover(function () {
            $('.d2').css('opacity', '1');
        })
        $('#uu>li').click(function () {
            var ind = $(this).index();
            var t = $('#uu>li').eq(ind).text();
            $('#btn1').text(t);
        })
    })

    function login() {
        $('#b1').click(function () {
            var name = $('#name').val();
            var pwd = $('#pwd').val();
            $.post({
                url: "http://localhost:8080/login",
                data: {'username': name, 'password': pwd},
                success: function (data) {

                }
            })
        })
    }
</script>
