$(function(){



    
	let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)


    $.get('./songs.json').then(function(response){   //获取歌词列表
    	let songs = response
    	//console.log(id)
    	//console.log(songs)
    	//debugger
    	let song = songs.filter(s=>s.id === id)[0]
    	//console.log(song)
    	let {url,name,lyric} = song
    	//console.log(url,name,lyric) 




   initPlayer.call(undefined,url)  //初始化播放器
   initText(name,lyric)   //初始化文本
  })




    function initText(name,lyric){    //初始化文本中填充name
    	//console.log(name,lyric)
    	$('.song-description > h1').text(name)
    	//console.log(lyric)
    	parseLyric(lyric)   //解析歌词
    }


function initPlayer(url){
	let audio = document.createElement('audio')
	audio.src = url
	audio.oncanplay = function(){
		audio.play()
		$('.disc-container').addClass('playing')
	}
	$('.icon-pause').on('touchstart',function(){    //当暂停时音乐停止
		audio.pause()
		$('.disc-container').removeClass('playing')
	})
	$('.icon-play').on('touchstart',function(){    //点击播放从新播放
		audio.play()
		$('.disc-container').addClass('playing')
	})
	setInterval(()=>{        //设置歌词同步显示
		//console.log(audio.currentTime)
		let seconds = audio.currentTime
		let munites = ~~(seconds / 60)
		let left = seconds = munites * 60
		let time = '${pad(munites)}:${pad(left)}'
		//console.log(time)
		let $lines = $('.lines> p')

        let $whichLine
		for(let i=0; i<$lines.length; i++){
			//if($lines.eq(i).attr('data-time') < time && $lines.eq(i+1).attr('data-time')> time){
			let currentLineTime = $lines.eq(i).attr('data-time')
			let nextLineTime = $lines.eq(i+1).attr('data-time')
			if($lines.eq(i+1).length !== 0 && currentLineTime < time && nextLineTime > time){
				$whichLine = $lines.eq(i)
				//console.log($lines[i])
				break
			}
		}
		if($whichLine){
			$whichLine.addClass('active').prev().removeClass('active')
			let top = $whichLine.offset().top
			let linesTop = $('.lines').offset().top
			let delta = top - linesTop - $('.lyric').height()/3
			$('.lines').css('transform','translateY(-${delta}px)')
	    }		}
	},500)
}


function pad(number){
	return number>=10 ? number + '' : '0' + number
}


/*
	$.get('/lyric,json').then(function(object){
		//let lyric = object.lyric
		let {lyric} = object
		//console.log(lyric.split('\n'))
		parseLyric.call(undefined, lyric)	
	})
*/


function parseLyric(lyric){
	let array = lyric.split("\n")
		let regex = /^\[(.+)\](.+)$/
		//console.log(array)
		array = array.map(function(string, index){
			let matches = string.match(regex)
			//console.log(matches)
			if(matches){
			return {time: matches[1], words: matches[2]}
		    }
		})
		let $lyric = $('.lyric')
		array.map(function(object){
			if(!object){return}
			let $p = $('<p/>')
			$p.attr('data-time', object.time).text(object.words)
			$p.appendTo($lyric.children('.lines'))

		})

}

})
