var auto, oldauto,  mann=new Date(), oldmann,  autos, manns, x=0, datename = ["年","月","日","時","分","秒"];
var timetoken=1, geotoken=1;
var latitude=24.0, longitude;
$(document).ready(function(){	
	panelinit();
	
});

function panelinit()
{
	$("#panel").one('init',function(){
		/*BUTTONS*/		
		synchandler();
		playbuttonhandler();
		playhandler();

		/*TIME*/
		initauto();
		refreshauto();
		refreshmann();

		/*DIVS*/
		hidepm();
		showinit();

		/*INPUT*/
		showinput();
		timesubmit();

		/*geo*/
		geobutton();
		geodigit();
	});
	$("#panel").trigger('init');
}

function synchandler()
{
	$("[data-status='sync']").live('click',function(){
		$(this).text('自訂');
		showpm();
		showmann(0);
		timestatus="mann";
		$("#timepanel").toggleClass('conf');
		$(this).attr("data-status","conf");
		$("#panel").trigger('pause');	
		$("#panel").trigger('newtime');	
	});
	$("[data-status='conf']").live('click',function(){
		$(this).text('同步');
		hidepm();
		showauto(0);
		timestatus="auto";
		$(this).attr("data-status","sync");
		$("#timepanel").toggleClass('conf');
		$("#panel").trigger('pause');	
		$("#play").text('▮▮').css({"padding":"1.5em 0.5em 1.5em 1.5em"});
		$("#panel").trigger('newtime');
	});
}

function playbuttonhandler()
{
	$("[data-status='play']").live('click',function(){
		$("#panel").trigger('pause');
		if($("#sync").attr("data-status")=="sync")
		{
			x=0;
			mann=auto;
			instancerefreshmann();
			$("#sync").trigger('click');
		}
		$("#panel").trigger('newtime');
	});
	$("[data-status='pause']").live('click',function(){
		$("#panel").trigger('play');
		if($("#sync").attr("data-status")=="sync")
		{
			x=0;
			mann=auto;
			instancerefreshmann();
			$("#sync").trigger('click');
		}
		$("#panel").trigger('newtime');
	});
}

function playhandler()
{
	$("#panel").bind('play',function(){
		$("#play").text('▮▮').css({"padding":"1.5em 0.5em 1.5em 1.5em"});
		$("#play").attr("data-status","play");
	})
	$("#panel").bind('pause',function(){
		$("#play").text('▶').css({"padding":"1.5em 0.25em 1.5em 1.75em"});
		$("#play").attr("data-status","pause");
	})
}



/*AUTO*/

function initauto()
{	
	auto = new Date();
	$("#panel").trigger('newautotime');
	mann=auto;				
	printmann();
}

function refreshauto()
{
	auto = new Date();
	if(oldauto!=auto.getSeconds())
	{		 
		printauto();
		$("#panel").trigger('newautotime');
	}
	oldauto=auto.getSeconds();
	setTimeout("refreshauto();",100);
}

function autoarray()
{
	autos = 
	{
		0:auto.getFullYear(),
		1:auto.getMonth()+1,
		2:auto.getDate(),
		3:auto.getHours(),
		4:auto.getMinutes(),
		5:auto.getSeconds(),
		6:auto.getDay(),
	}
}

function printauto()
{	
	autoarray();
	for(var i=0;i<6;i++)
		$(".digit div[id^='a']").eq(i).text(autos[i]+datename[i]);
}
/*MANN*/

function refreshmann()
{
	$("#panel").bind('newautotime',function(){
		if($("#play").attr("data-status")=='play')
		{
			mann.setTime(auto.getTime()+x*1000);
			if(oldmann!=mann.getSeconds())
				printmann();
			oldmann=mann.getSeconds();	
			$("#panel").trigger('newtime');
		}
		else
			x--;
	});
}

function instancerefreshmann()
{
	mann.setTime(auto.getTime()+x*1000);
	printmann();
}


function mannarray()
{
	manns = 
	{
		0:mann.getFullYear(),
		1:mann.getMonth()+1,
		2:mann.getDate(),
		3:mann.getHours(),
		4:mann.getMinutes(),
		5:mann.getSeconds(),
		6:mann.getDay(),
	}
}

function printmann()
{	
	mannarray();
	for(var i=0;i<6;i++)
		$(".digit div[id^='m']").eq(i).text(manns[i]+datename[i]);
}

/*PLUS%MINUS*/

function showpm()
{
	$(".plus, .minus").fadeTo(500,1);
}

function hidepm()
{
	$(".plus, .minus").fadeTo(500,0);
}

/*digit*/
function showinit()
{
	$(".digit div[id^='a']").css("marginTop","-0.5em");
	$(".digit div[id^='m']").css("marginTop","-4em");
}

function showauto(i)
{
	if(i<6)
	{
		$(".digit div[id^='a']").eq(i).animate({
			marginTop:"-0.5em"
	 	}, 250, function(){
			$(this).siblings("div[id^='m']").css("marginTop","-4em");
		});
		i++;
		setTimeout("showauto('"+i+"')",100);	
	}	
}

function showmann(i)
{
	if(i<6)
	{
		$(".digit div[id^='a']").eq(i).animate({
			marginTop:"1.5em"
	 	}, 250, function(){
			$(this).css("marginTop","-2.5em");
			$(this).siblings("div[id^='m']").css("marginTop","0em");
		});
		i++;
		setTimeout("showmann('"+i+"')",100);	
	}	
}

function showinput()
{
	$(".conf div.digit").live("click",function(){
		$("div[id^='m']", this).hide();
		timetoken=1;
		$("input", this).show().val(manns[$(this).parents("li").index("#timepanel li")]).select();
	});
}

function timesubmit()
{
	$("#timepanel input[id^='i']").bind("blur",function(){
		$(this).hide();
		$(this).parents(".digit").find("div[id^='m']").show();
		if(timetoken==1)
			$(this).parent().trigger("submit");
	});

	$("form").bind("submit",function(){
		var value = $(this).children().val();
		var index = $(this).parents('li').index('#timepanel li');
		var before=mann.getTime();
		switch(index)
		{	
			case 0:
				mann.setFullYear(value);
				break;
			case 1:
				mann.setMonth(value-1);
				break;
			case 2:
				mann.setDate(value);
				break;
			case 3:
				mann.setHours(value);
				break;
			case 4:
				mann.setMinutes(value);
				break;
			case 5:
				mann.setSeconds(value);
				break;
		}
		x+=(mann.getTime()-before)/1000;
		instancerefreshmann();
		$("#panel").trigger('newtime');
		
		timetoken=0;
		$("#timepanel input[id^='i']").trigger('blur');
		return false;
	});

	$(".plus").bind("click",function(){
		$(this).parent().find("input").val(manns[$(this).parents('li').index('#timepanel li')]+1).parent().trigger('submit');
	});
	$(".minus").bind("click",function(){
		$(this).parent().find("input").val(manns[$(this).parents('li').index('#timepanel li')]-1).parent().trigger('submit');
	});
}

/*geo*/

function geobutton()
{
	$("#latbutton").toggle(function(){
		$(this).text("南緯");	
		$("input#ilat").val(parseInt($("div#lat").text()));
		$("li#coordigit form").eq(0).trigger("submit");
	},function(){		
		$(this).text("北緯");	
		$("input#ilat").val(parseInt($("div#lat").text()));
		$("li#coordigit form").eq(0).trigger("submit");
	});


	$("#lonbutton").toggle(function(){
		$(this).text("西經");
		$("input#ilon").val(parseInt($("div#lon").text()));
		$("li#coordigit form").eq(1).trigger("submit");
	},function(){		
		$(this).text("東經");	
		$("input#ilon").val(parseInt($("div#lon").text()));
		$("li#coordigit form").eq(1).trigger("submit");	
	});
}

function geodigit()
{
	var initlon = auto.getTimezoneOffset()/-4;
	if(initlon<0)
	{
		initlon=-initlon;		
		$("#lonbutton").trigger('click');
	}
	longitude=Math.floor(initlon*10)/10;

	$("li#coordigit div").bind("click",function(){
		$(this).hide();
		$(this).parent().find("input").eq($(this).index('#coordigit div')).show().val($(this).text()).select();
		geotoken=1;
	});
	
	$("li#coordigit input").bind("blur",function(){	
		$(this).hide();
		$(this).parents("#coordigit").find("div").show();
		if(geotoken==1)
			$(this).parent().trigger("submit");
	});

	$("li#coordigit form").bind("submit", function(){	
		var value = $(this).children().val();
		var index = $(this).index('li#coordigit  form');
		switch(index)
		{	
			case 0:
				if(value<0)
				{
					$("div#lat").text(-value);
					$("#latbutton").trigger("click");
					break;
				}
				else if(value>90)
				{			
					value=90;		
					latitude=value;
					if($("#latbutton").text()=="南緯")
						latitude*=-1;					
					$("div#lat").text(value);
					break;	
				}
				else
				{
					latitude=value;	
					if($("#latbutton").text()=="南緯")
						latitude*=-1;					
					$("div#lat").text(value);
					break;
				}
			case 1:	
				if(value<0)
				{
					$("div#lon").text(-value);
					$("#lonbutton").trigger("click");
					break;
				}	
				else if(value>180)
				{
					if(value%360==0)
						value=360;
					else
						value%=360;
					$("div#lon").text(360-value);
					$("#lonbutton").trigger("click");
					break;
				}
				else
				{
					longitude=value;	
					if($("#lonbutton").text()=="西經")
						longitude*=-1;					
					$("div#lon").text(value);
					break;
				}
		}
		geotoken=0;
		$("#panel").trigger('newgeo');
		$(this).children().trigger('blur');
		return false;
	});

}

