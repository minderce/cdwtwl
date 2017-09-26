// JavaScript Document
$(function(){
	changeWH();/*根据窗口更改内容高度*/
	var pathname = window.location.pathname.split('.');
	pathname = pathname[0].substr(1,pathname[0].length-1).split("-")[0]+"-list";
	$.ajax({
		type: "get",
		url: "/menu.html",
		success: function(data){
			var menu = data.menu;
			var str = '', menus = [],menuId=[];

			menu.forEach(function(item){
				if(item.pid == 0){
					menuId.push(item.id);
					menus.push({
						name:item.name,
						url:item.url,
						icon:item.icon,
						id:item.id,
						childMenus:[]
					});
				}else {
					var isId = $.inArray(item.pid, menuId);
					if(isId >= 0){
						menus[isId].childMenus.push({
							name:item.name,
							url:item.url,
							icon:item.icon,
							id:item.Id
						})
					}

				}
			});

			menus.forEach(function(item){
				var menusClass = item.childMenus.length > 0 ? "has_chil":"";
				if(item.childMenus.length > 0){
					str += ' <li>'
					str +='<a class="menu_one" href="' + (item.url || "javascript:;") + '">' +
						'<img src="images/icon/ico01.png" data-img="images/icon/ico01_h.png"/>' +
						'<span class="'+menusClass+'">' + item.name + '</span></a>' ;
					if(item.childMenus.length >= 0) {
						str +='<ul class="menu_child">'
					}
					item.childMenus.forEach(function(childMenus){
						str += ' <li class="'+childMenus.url+'"><a class="sec_one" href="/'+childMenus.url+'.html">'+childMenus.name+'管理</a></li>'
					});
					if(item.childMenus.length >= 0) {
						str +='</ul>'
					}
					str +='</li>'
				}

			});

			$(".menu_fir").html(str);
			$(".menu_child ." + pathname).parents("li").children(".menu_one").click();
			$(".menu_child ." + pathname + " .sec_one").addClass("curr")
		}
	});
	$('.checkbox_wrap').live('click', function(){

		if($(this).find('.checkbox').hasClass('active')){
			$(this).find('.checkbox').removeClass('active');
			$(this).find('.checkbox').siblings("input[type='checkbox']").removeAttr('checked')
		}
		else{
			$(this).find('.checkbox').addClass('active');
			$(this).find('.checkbox').siblings("input[type='checkbox']").attr('checked','checked')
		}
	})


	$(".menu").nanoScroller();/*初始化滚动条*/
	$(".menu_one").live("click",function(){

		var img_url = $(this).children("img").attr("src");
		var imghov_url = $(this).children("img").attr("data-img");
		$(".menu_child").slideUp(200);
		
		/*将上个选中状态的图标还原*/
		var i=$(".menu_fir>li.curr").index();
		if(i>=0){
			var imghov = $(".menu_fir>li").eq(i).children(".menu_one").children("img").attr("data-img");
			var imgold = $(".menu_fir>li").eq(i).children(".menu_one").children("img").attr("src");
			$(".menu_fir>li").eq(i).children(".menu_one").children("img").attr("src",imghov);
			$(".menu_fir>li").eq(i).children(".menu_one").children("img").attr("data-img",imgold);
			}
		
		if($(this).parent("li").hasClass("curr")){
				$(this).parent("li").removeClass("curr");
				
			}else{
				$(this).parent("li").addClass("curr").siblings("li").removeClass("curr");
				}
		$(this).children("img").attr("src",imghov_url);
		$(this).children("img").attr("data-img",img_url);
		
		
		/*判断是否有二级*/
		if($(this).next(".menu_child").length!=0){
			if($(this).next(".menu_child").css("display")=="none"){
				$(this).next(".menu_child").slideDown(200);
				}else{
					$(this).parent("li").removeClass("curr");
					$(this).next(".menu_child").slideUp(200);
					}
			}
		})	

})
$(window).resize(function(e) {
    changeWH();
});

$(".all_list_box").live("click",function(){
	if($(this).find(".checkbox").hasClass("active")){
		$(".list_ck_box").find('.checkbox').removeClass('active');
		$(".list_ck_box").find('.checkbox').siblings("input[type='checkbox']").removeAttr('checked')
 	}else{
		$(".list_ck_box").find('.checkbox').addClass('active');
		$(".list_ck_box").find('.checkbox').siblings("input[type='checkbox']").attr('checked','checked')
 	}
});
function radio($cur){
	var radioName = $cur.find('.radio').attr('name');
	$('label[name="'+ radioName +'"]').removeClass('active').siblings('input[name="'+ radioName +'"]').removeAttr('checked','checked');
	$cur.find('.radio').addClass('active').siblings('input[name="'+ radioName +'"]').attr('checked', 'checked');
	$cur.parent().addClass('active').siblings().removeClass('active');
}

function changeWH(){
	var ww = $(window).width();
	var hh = $(window).height();
	$(".content").height(hh - $(".header").height());
}

/*删除*/

function delFun(url,name, id){
	var ids = id;
	if(typeof id == "object"){
		  ids = [];
		$('input[name="list_ck"]:checked').each(function(){
			ids.push($(this).val())
		});
		if(ids.length <= 0){
			layer.msg('请选中至少一条数据进行操作!', {
				icon: 6,
				shift: 6,    // 出现的动画效果
				time: 20000 //2秒关闭（如果不配置，默认是3秒）
			}, function(){

			});
			return;
		}else{
			name = '选中项';
		}


	}
    layer.open({
        type: 1,
        title : "提示",
        skin: 'lay_tips', //样式类名
        closeBtn: 1, //不显示关闭按钮
        shift: 0,
        yes: function(index, layero){
            layer.close(index);
            $.ajax({
                type:"post",
                url:url,
                data:{id: ids},
                success: function(data){
                    if(data.status == 1){
                        layer.msg('删除成功!', {
                            icon: 6,
                            shift: 6,    // 出现的动画效果
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        }, function(){
                            window.location.reload();
                        });
                    }else{
                        layer.msg(data.msg, {
                            icon: 6,
                            shift: 6,    // 出现的动画效果
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        }, function(){ });
                    }

                }
            });
        },
        cancel: function(index){
        },
        area: ['300px', '210px'],
        shadeClose: true, //开启遮罩关闭
        content: '<div class="tipcon_wrap"><p style="padding-top:25px;">是否删除'+name+'？</p></div> <div class="layui-layer-btn layui-layer-btn-dq"><a class="layui-layer-btn0">确定</a><a class="layui-layer-btn1">取消</a></div>'
    });
}