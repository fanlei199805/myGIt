const API_BASE_URL = 'http://127.0.0.1:8189'; //java本地测试地址
 
//const API_BASE_URL = 'https://wuqing999.com'; //java本地测试地址
//  const API_BASE_URL = 'http://192.168.0.106:8189'; //java本地测试地址

module.exports = {



  /*************************日志*************************/
  InfoLogAdd: API_BASE_URL + '/infolog/addlog.action', //记录日志接口
 
 

   /*************************主页1*************************/
  OrgList: API_BASE_URL + '/org/list',  //组织列表
  IndexUrlBanner: API_BASE_URL + '/goods/banner.action', //首页banner
  IndexUrlChannel: API_BASE_URL + '/channel/channel.action', //banner下的分类
  IndexUrlNewGoods: API_BASE_URL + '/goods/newGoods.action', //新品首发
  IndexUrlHotGoods: API_BASE_URL + '/goods/hotGoods.action', //人气推荐
  IndexExplain: API_BASE_URL + '/instruction/explain.action', //人气推荐



  /*************************商品页*************************/
    GoodsAgency: API_BASE_URL + '/agency/save',  //商品分销记录保存
    GoodsDetail: API_BASE_URL + '/goods/details.action', //获得商品的详情
    GoodsDetailType: API_BASE_URL + '/channel/classification.action', //商品详情banner下的分类
    GoodsRelated: API_BASE_URL + '/goods/everyoneWatching.action', //商品详情页的关联商品（大家都在看）
    CollectAddOrDelete: API_BASE_URL + '/collect/editCollet', //添加或取消收藏
    CollectAddOrDeletes: API_BASE_URL + '/collect/collectDelete', //取消收藏
    CollectList: API_BASE_URL + '/collect/collectList',  //收藏列表
    CartAdd: API_BASE_URL + '/cart/add', //添加商品到购物车
    CommentList: API_BASE_URL + '/comment/list.action',  //评论列表
    CommentAdd: API_BASE_URL + '/comment/add',  //添加评论
    UploadGetPoster: API_BASE_URL + '/upload/getPoster',  //获取分享海报


  /*************************资讯*************************/
    GetTopicList: API_BASE_URL + '/topic/list.action', //获取资讯列表
    GetTopicDetail: API_BASE_URL + '/topic/info.action', //获取资讯详情
    GetTopicRead: API_BASE_URL + '/topic/read.action', //设置资讯已读.

  /*************************商品分类*************************/
    CatalogList: API_BASE_URL + '/catalog/index',  //分类目录全部分类数据接口
    CatalogCurrent: API_BASE_URL + '/catalog/current',  //分类目录当前分类数据接口
    GoodsCategory: API_BASE_URL + '/catalog/goodCategory',  //商品分类信息接口
    GoodsList: API_BASE_URL + '/goods/categoryGoods.action',  //商品分类信息集合接口

  /*************************购物车*************************/
    CartList: API_BASE_URL + '/cart/cart', //获取购物车的数据
    CartChecked: API_BASE_URL + '/cart/updateCartChecked', //选择或取消选择商品
    CartUpdate: API_BASE_URL + '/cart/updateCartProductInfo', //更新购物车的商品
    CartDelete: API_BASE_URL + '/cart/del.action', //删除购物车的商品


  /*************************我的*************************/
    UploadFileImg: API_BASE_URL + '/upload/fileImg.action',  //上传图片
    VoteList: API_BASE_URL + '/vote/list.action',  //我发起的投票
    VoteDetail: API_BASE_URL + '/vote/detail.action',  //我参与的投票
    VoteSave: API_BASE_URL + '/vote/save.action',  //创建投票信息
    VoteUserVote: API_BASE_URL + '/vote/userVote.action',  //用户投票
    RegionList: API_BASE_URL + '/region/list.action', //获取区域列表
    AddressList: API_BASE_URL + '/address/addressList', //收货地址列表
    AddressDetail: API_BASE_URL + '/address/addressDetails', //收货地址详情
    AddressSave: API_BASE_URL + '/address/save', //保存收货地址
    AddressEdit: API_BASE_URL + '/address/update.action', //修改收货地址
    AddressDelete: API_BASE_URL + '/address/batchLogicalDelete.action', //删除收货地址

  /*************************订单*************************/
    CartCheckout: API_BASE_URL + '/cart/checkout', //下单前信息确认
    OrderSubmit: API_BASE_URL + '/order/submitOrder', //提交订单
    PayPrepayId: API_BASE_URL + '/wechat/orders', //支付下单
    OrderQuery: API_BASE_URL + '/order/query.action', //微信查询订单状态
    OrderList: API_BASE_URL + '/order/orderList', //订单列表
    OrderDetail: API_BASE_URL + '/order/orderDetail', //订单详情
    OrderCancel: API_BASE_URL + '/order/cancelOrder', //取消订单
    OrderDel: API_BASE_URL + '/order/delOrder', //删除订单
    QueryOrderByOrderSN: API_BASE_URL +'/order/queryOrderByOrderSN',//根据orderSN查询订单详情
    UpdateStatusByOrderSN: API_BASE_URL +'/order/updateStatusByOrderSN',//根据orderSN修改订单状态
    OrderEditAddress: API_BASE_URL + '/order/updateOrderAddress', //订单详情修改地址

     /*************************提现*************************/
    WithdrawalList: API_BASE_URL + '/withdrawal/withdrawalList', //获取提现列表

  /*************************其他*************************/
  UserShareSave: API_BASE_URL + '/userShare/save',  //用户分享统计
 
  UserMarkSave: API_BASE_URL + '/userMark/save.action',  //用户足迹
  HelpTypeList: API_BASE_URL + '/helpType/helpTypeList.action', //查看帮助类型列表
  HelpIssueList: API_BASE_URL + '/helpType/helpIssueList.action', //查看问题列表
  FeedbackAdd: API_BASE_URL + '/feedback/addFeedback', //添加反馈


  AuthLoginByWeixin: API_BASE_URL + '/user/login_by_weixin.action', //微信登录
  ExitLogin: API_BASE_URL + '/user/logout.action', //退出登录






};
