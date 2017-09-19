;(function($, window, document){
	"use strict";
	var defaults = {
		deVal : "请选择状态",
		search : false,
		riInput : "",
		deSelected : "",
		deSeleId : "",            // 默认选中id
		version : "1.2.1",
		z_index : 15
	};
	function DropDqDefault(obj, optionsArr, options){
		this.obj = obj;
		this.options = $.extend(defaults, options);
		this.optionsArr = optionsArr;
		// 默认下拉
		this.init = function(){
			var that = this;
			$(that.obj).die().live('change', function(){
				try{
					var change = options.change;
					var selectedVal = $(that.obj).val();
					var selectedOption = $(that.obj).find("option:selected");
					var selectedText = selectedOption.text();
					change(selectedVal, selectedText, selectedOption);
				}catch(e){
					console.log(e)
				}
			})
			this.dropDefault();
			this.initLi('default');
			this.baseEvent(obj);
			this.dropEvent();
			// 判断是否带搜索框
			if(this.options.search){
				this.dropSearch();
				this.searchEvent();
			}
			// 默认选中值
			if(that.options.deSeleId){
				that.defaultSelLi(that.options.deSeleId);
			}
		}
		// 树状下拉
		this.treeInit = function(){
			var that = this;
			this.dropDefault();
			this.initLi('tree');
			this.baseEvent();
			this.treeEvent();
			$(that.obj).next().find('.daq-filter').on('change', function(){
				if(that.options.change){
					$(that.obj).next().find('.daq-drop-child-node li>a').each(function(k,v){
						if($(v).hasClass('selected')){
							var childId = $(v).attr('tabindex');
							var childName = $(v).find('.text').html();
							var $pSelector = $(v).parent().parent().siblings('.daq-one-node');
							var pId = $pSelector.attr('tabindex');

							var pName = $pSelector.find('span').html();
							that.options.change(pId, pName, childId, childName);
						}
					})
				}
			})
		},
		this.multiInit = function(){
			//var jsonData = options.data;
			this.dropDefault();
			this.initMulti();
			this.baseEvent();
			this.multiEvent();
		}
	}



	function getJsonLength(json){
	    var len = 0;
	    if(Boolean(json)){
	        for(var i in json)len++;
	    }
	    return len;
	};

	DropDqDefault.prototype = {
		dropDefault : function(){
			var that = this;
			var selectorName = $(that.obj).attr('class') || $(that.obj).attr('id');
			
			// 重复绑定时，移除原来的
			if($(that.obj).next().hasClass('daq-'+ selectorName)){
				this.options.z_index = 15;
				$(that.obj).next().remove();
			}
			var z_index = this.options.z_index--;
			var defaultWrap = '';
			defaultWrap += '<div class="daq-select daq-'+ selectorName +'" style="z-index:'+ that.options.z_index +'"><div class="daq-btn daq-btn-default"><div class="daq-filter fl">'+ that.options.deVal +'</div><span class="daq-select-line fr"></span><span class="daq-caret"></span>';
			if(this.options.riInput != ""){

				defaultWrap += '<input class="daq-riInput" type="text" value="'+ that.options.riInput +'"/>';
			}
			defaultWrap	+= '</div><div class="daq-dropdown-menu"></div></div>';
			
			$(that.obj).after(defaultWrap);
			if(that.options.riInput != ""){
				$(that.obj).next('.daq-'+ selectorName +'').find('.daq-filter').css({'float':'left', 'width' : '95px'});
				$(that.obj).next('.daq-'+ selectorName +'').find('.daq-btn-default').css('width', '230px').addClass('clearfix');
				$(that.obj).next('.daq-'+ selectorName +'').find('.daq-caret').css('left' , '82px');
			}
		},
		dropEvent : function(){
			var that = this;
			var tmpRi = that.options.riInput;
			var $target = $(that.obj).next();
			// hover悬浮加效果
			$target.on('hover', '.daq-drop-ul li a', function(){
				$target.find('.daq-drop-ul li a').each(function(){
					$(this).removeClass('active');
				});
				$(this).addClass('active');
			});
			// 列表点击选中事件
			$target.on('click', '.daq-drop-ul li', function(e){
				e.stopPropagation();
				$(this).addClass('selected').siblings().removeClass("selected");
				var selectedIndex = $(this).find('a').attr('tabindex');
				var selectedVal   = $(this).find('a').find('span').text();
				if(tmpRi != ""){
					$target.find('.daq-riInput').val(selectedVal);
				}else{
					$target.find('.daq-filter').text(selectedVal);
				}
				$target.find('.daq-btn-default').addClass('active');
				$(that.obj).val(selectedIndex);
				$target.find('.daq-dropdown-menu').removeClass('daq-show');
				$(that.obj).trigger('change');
			})
		},
		initLi : function(type){
			var that = this;
			var $targetMenu = $(that.obj).next().find('.daq-dropdown-menu');
			var bindStr = '<ul class="daq-drop-ul">';
			var optionLen = type === "tree" ? getJsonLength(that.options.data) : that.optionsArr.length;
			if(optionLen > 0){
				for(var i = 0; i < optionLen; i++){
					if(type === "default"){
						bindStr += '<li><a tabindex='+  that.optionsArr.eq(i).val() +'><span class="text">'+ that.optionsArr.eq(i).text() +'</span></a></li>';
					}else if(type === "tree"){

						var caret = that.options.data[i].open ? "daq-caret" : "daq-caret-r";
						bindStr += '<li><span id="daq-caret-id" class="'+ caret +' daq-caret-li"></span><a class="daq-one-node" tabindex='+  that.options.data[i].pid +'><span>'+ that.options.data[i].name +'</span></a>';
						var childArrLen = getJsonLength(that.options.data[i].childArr);
						if(childArrLen > 0){
							var isShow = that.options.data[i].open ? "daq-show" : "daq-hidden" || "daq-hidden";
							bindStr += '<ul class="daq-drop-child-node '+ isShow +'">';
							for(var j = 0; j < childArrLen; j++){
								bindStr += '<li><a class="daq-two-node" tabindex='+  that.options.data[i].childArr[j].id +' href="javascript:void(0);"><div class="daq-dot"></div><span class="text">'+ that.options.data[i].childArr[j].name +'</span></a></li>';
							}
							bindStr += "</ul>";
						}
						bindStr += '</li>';
					}
				}
				bindStr += '</ul>';
				$targetMenu.html(bindStr);
			}
			var defaId = $(that.obj).find('option:selected').eq(0).val();
			that.defaultSelLi(defaId);
		},
		initMulti : function(){
			var that = this;
			var $targetMenu = $(that.obj).next().find('.daq-dropdown-menu');
			var bindStr = '<ul class="daq-drop-ul">';
			var optionLen = getJsonLength(that.options.data); 
			if(optionLen > 0){
				for(var i = 0; i < optionLen; i++){
					bindStr += '<li><div class="daq-one-node-wrap daq-drop-hover"><input type="checkbox" class="daq-checkbox daq-checkbox-one" value="" /><a class="daq-one-node" tabindex='+  that.options.data[i].pid +'><span>'+ that.options.data[i].name +'</span></a></div>';
					var childArrLen = getJsonLength(that.options.data[i].childArr);
					if(childArrLen > 0){
						var isShow = that.options.data[i].open ? "daq-show" : "daq-hidden" || "daq-hidden";
						bindStr += '<ul class="daq-drop-child-node '+ isShow +'">';
						for(var j = 0; j < childArrLen; j++){
							bindStr += '<li><input type="checkbox" class="daq-two-checkbox daq-checkbox"/><a class="daq-two-node daq-drop-hover" tabindex='+  that.options.data[i].childArr[j].id +' href="javascript:void(0);"><span class="text">'+ that.options.data[i].childArr[j].name +'</span></a></li>';
						}
						bindStr += "</ul>";
					}
					bindStr += '</li>';
				}
				bindStr += '</ul>';
				$targetMenu.html(bindStr);
			}
		},
		baseEvent : function(){
			var that = this;
			var $target = $(that.obj).next();
			// click事件
			$target.on('click', '.daq-btn-default', function(e){
				e.stopPropagation();
				$('#gri_monthPicker_wrapper').css('display', 'none');      // 月份hide
				var $curTarget = $target.find('.daq-dropdown-menu');
				var $allMenu = $('body').find('.daq-dropdown-menu');

				$allMenu.each(function(k,v){
					if($(v).parent().attr('class') != $curTarget.parent().attr('class')){
						$(v).removeClass('daq-show');
					}
				})
				$curTarget.hasClass('daq-show') ? $curTarget.removeClass('daq-show'): $curTarget.addClass('daq-show');
				var needH = $curTarget.prev().offset().top+$curTarget.height(),
            realH = $(window).height()-$(".header").height()-$(".posi_box").height()-60;
            $curTarget.css("top", ($curTarget.prev().height()-1)+"px");
            var realW = $(window).width()-$curTarget.offset().left;
            if (realW < $curTarget.width()) {
              $curTarget.css({
                "left": "auto",
                "right": 0
              })
            }
			})
			// 鼠标移出菜单区域事件
			$target.on('mouseleave', '.daq-dropdown-menu', function(){
				$target.find('.daq-drop-ul li a').each(function(){
					$(this).removeClass('active');
				});
			})

			// 菜单事件
			$target.on('click', '.daq-dropdown-menu', function(e){
				e.stopPropagation();
			})
			
			// 点击空白隐藏下拉框
			$(document).click( function(e) { 
			  if (typeof e.target.className != "string") {
			    return;
			  }
				var tarClass = e.target.className;
				var reg = /daq-checkbox/;
				if(tarClass.match(reg) == null){
					$target.find('.daq-dropdown-menu').removeClass('daq-show');
				}
			}); 
			// daq-riInput 事件
			$target.on('click', '.daq-riInput', function(e){
				e.stopPropagation();
			})
		},
		dropSearch : function(){
			var that = this;
			var $menu = $(that.obj).next().find('.daq-dropdown-menu').addClass('daq-dropdown-search');
			var searchWrap = '<div class="daq-select-searchbox1"><input type="text" class="daq-inputadd1 daq-search1" placeholder="查找"></div>';
			$menu.prepend(searchWrap);
		},
		searchEvent : function(){
			var that = this;
			var $target = $(that.obj).next();
			var $liArr = $target.find('.daq-drop-ul li');
			$target.on('click', '.daq-search1', function(e){
				e.stopPropagation();
			});
			$target.on('keyup', '.daq-search1', function(e){
				e.stopPropagation();
				var inputText = $(this).val();	
				var counter = 0;
				$liArr.each(function(k,v){
					var reg = new RegExp(inputText);
					var curText = $(v).find('a').find('span').text();
					if(curText.search(reg,'i') != -1){
						counter++;
						$(v).css('display', 'block');
						$liArr.parent().find('.no-results').each(function(k,v){$(v).remove()});
					}else{
						$(v).css('display', 'none');
					}
				})
				if(counter == 0){
					$liArr.parent().find('.no-results').each(function(k,v){$(v).remove()});
					var noResults = '<li class="no-results active">没有搜索到 "'+ inputText +'"</li>';
					$liArr.parent().append(noResults);
				}
			})
		},
		treeEvent : function(){
			var that = this;
			var $target = $(that.obj).next();
			// hover悬浮加效果
			$target.on('hover', '.daq-drop-ul li a', function(){
				$target.find('.daq-drop-ul li a').each(function(){
					$(this).removeClass('active');
				});
				$(this).addClass('active');
			});

			$target.on('click', '.daq-drop-ul>li>a', function(e){
				e.stopPropagation();
				$(this).next().slideToggle("slow");
				var tarCaret = $(this).siblings('#daq-caret-id');
				tarCaret.hasClass('daq-caret') ? tarCaret.removeClass('daq-caret').addClass('daq-caret-r') : tarCaret.removeClass('daq-caret-r').addClass('daq-caret')
			});

			$target.on('click', '.daq-two-node', function(e){
				e.stopPropagation();
				$target.find('.daq-filter').html($(this).find('.text').html());
				$target.find('.daq-dropdown-menu').removeClass('daq-show');
				// 添加选中状态
				$target.find('.daq-drop-child-node li>a').each(function(){
					$(this).removeClass('selected');
				});
				$(this).addClass('selected');
				$target.find('.daq-filter').trigger('change');
			})
		},
		multiEvent : function(){
			var that1 = this;
			var $target = $(that1.obj).next();
			// hover悬浮加效果
			$target.on('hover', '.daq-drop-hover', function(){
				$target.find('.daq-drop-hover').each(function(){
					$(this).removeClass('active');
				});
				$(this).addClass('active');
				
			});

			
			// 
			$target.on('click', '.daq-one-node', function(e){
				e.stopPropagation();
				var $curCheckBox = $(this).prev();
				$(this).parent().next().slideToggle('slow');
			})
			// 一级节点 change事件
			$target.on('change', '.daq-checkbox-one', function(e){
				var that = this;
				$(that).parent().next().find('.daq-checkbox').each(function(k,v){
					$(that).is(':checked') ? $(v).attr("checked","checked") : $(v).removeAttr('checked');
				})
				$(that).is(':checked') ? $(that).parent().addClass('halfsel') : $(that).parent().removeClass('halfsel');
				return function(){
					that1.callback();
				}()
			});

			// 二级节点 change事件
			$target.on('change', '.daq-two-checkbox', function(e){
				var that = this;
				var checkArr = $(that).parent().parent().find('.daq-two-checkbox');
				var count = 0;
				// 统计选中checkbox的个数
				checkArr.each(function(k,v){
					if(v){
						if($(v).attr('checked')){
							count++;
						}
					}
				})
				var $cur = $(that).parent().parent().prev();
				if(count === 0){
					$cur.removeClass('halfsel');
					$cur.find('.daq-checkbox-one').removeAttr('checked');
				}
				if(count === checkArr.length){
					$cur.find('.daq-checkbox-one').attr("checked","checked");
				}
				if(count > 0){
					$cur.addClass('halfsel');
				}
				return function(){
					that1.callback(that);
				}();
			});
			

			$target.on('click', '.daq-two-node', function(e){
				e.stopPropagation();
				var $curCheckBox = $(this).prev();

				$curCheckBox.trigger('click');
			})
		},
		callback : function(cur){
			var that = this;
			var change = this.options.change;
			if(change){
				// 当前点击数据
				var clickNode = {};
				var curId = $(cur).next().attr('tabindex');
				var curName = $(cur).next().find("span").text();
				clickNode.curId = curId;
				clickNode.curName = curName;
				if($(cur).hasClass('daq-two-checkbox')){
					var $parentTarget = $(cur).parent().parent().prev().find('.daq-one-node');
					var curPId = $parentTarget.attr('tabindex');
					var curPName = $parentTarget.text();
					clickNode.curPId = curPId;
					clickNode.curPName = curPName;
				}
				// 选中数据
				var checkedNode = {};
				var m = 0;
				var checkedAll = $(that.obj).next().find('.daq-checkbox').each(function(k,v){

					var is_checked = $(v).eq(0).attr('checked');
					if(is_checked === "checked"){
						// 当父节点选中，子节点必选中
						var tempObj = {};
						if($(v).hasClass('daq-checkbox-one')){
							var tempId = $(v).next().attr('tabindex');
							var tempName = $(v).next().text();
							tempObj.pId = "";
							tempObj.pName = "";
							tempObj.id = tempId;
							tempObj.name = tempName;
						}

						if($(v).hasClass('daq-two-checkbox')){
							var tmpChildId = $(v).next().attr('tabindex');
							var tmpChildName = $(v).next().text();
							var $parentTar = $(v).parent().parent().prev().find('.daq-one-node');
							var tmpPId = $parentTar.eq(0).attr('tabindex');
							var tmpPName = $parentTar.text();
							tempObj.pId = tmpPId;
							tempObj.pName = tmpPName;
							tempObj.id = tmpChildId;
							tempObj.name = tmpChildName;
						}
						checkedNode[m] = tempObj;
						m++;
					}
				});
				change(clickNode, checkedNode);
			}
		},
		defaultSelLi : function(id){
			var that = this;
			var $target = $(that.obj).next();
			$target.find('.daq-drop-ul li>a').each(function(k,v){
				var curText;
				if($(v).attr('tabindex') == id){
					$(v).parent().addClass('selected');
					curText = $(v).find('.text').text();
					$target.find('.daq-filter').html(curText);
				}
			});
			$(that.obj).val(id);
			$(that.obj).trigger('change');
		}
	}

	/** 扩展jQuery方法 - 默认下拉框*/
	$.fn.dropDqDefault = function(options){
		var that = this;
		//var options = $.extend(defaults, options);
		$(that).css('display', 'none');
		var $options = $(that).find('option');
		var daqDqObj = new DropDqDefault(that, $options, options);
		daqDqObj.init();
		
	};
	/** 扩展jQuery方法 - 带菜单的下拉框*/
	$.fn.dropDqTree = function(options){
		var that = this;
		//var options = $.extend(defaults, options);
		$(that).css('display', 'none');
		var daqDqObj = new DropDqDefault(that, '', options);
		daqDqObj.treeInit();
		
	};



	/** 扩展jQuery方法 - 多选下拉框*/
	$.fn.dropDqMulti = function(options){
		var that = this;
		$(that).css('display', 'none');
		var daqDqObj = new DropDqDefault(that, '', options);
		daqDqObj.multiInit();
		
	};

})(jQuery, window, document);