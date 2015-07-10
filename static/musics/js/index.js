/**
 * Created by Jaeeo on 15. 7. 1..
 */

// search field link to search function
my_app.directive('search', function($window){
    return {
        restrict: 'A',
        scope: {
            ngModel: "=",
            search: "&callback"
        },
        link: function(scope, elem, attrs){
            elem.bind('keydown', function(e){
                if(e.keyCode == 13){
                    if(isNull(scope.ngModel)){
                        $window.alert("검색어를 입력해 주세요.");
                    }
                    else{
                        scope.search({query : scope.ngModel});
                        scope.ngModel = null;
                    }
                }
            });
        }
    }
});


var SEARCH_URL = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=" + GOOGLE_API_KEY + "&q=";

my_app.controller('MusicController', function($scope, $window, $http, $cookies){

    // init videos from $cookies
    var initVideos = function(videos){
        var video_length = $cookies.get('video_length');
        if(video_length != null && parseInt(video_length) > 0){
            for(i = 0 ; i < video_length ; i++){
                var video = JSON.parse($cookies.get('video-' + i));
                videos.push(video);
            }
        }
    }

    // init angular datas
    $scope.query = null;
    $scope.videos = [];
    $scope.video_index = -1;
    initVideos($scope.videos);


    // def angular function for html attr
    $scope.search = function(query) {
        $http.get(SEARCH_URL + query).
            success(function(data, status, headers, config) {
                var video = {
                    title : data.items[0].snippet.title,
                    videoId : data.items[0].id.videoId,
                    thumb : data.items[0].snippet.thumbnails.default.url,
                    edit : false,
                    playing : false,
                    other_videos : []
                }
                for (i = 1; i < data.items.length; i++) {
                    video.other_videos.push({
                        title : data.items[i].snippet.title,
                        videoId : data.items[i].id.videoId,
                        thumb : data.items[i].snippet.thumbnails.default.url
                    });
                }
                $scope.videos.push(video);
            }).
            error(function(data, status, headers, config) {
                $window.alert('동영상 등록에 실패하였습니다.');
            });
    }

    $scope.modifyVideo = function(video, query){
        $http.get(SEARCH_URL + query).
            success(function(data, status, headers, config) {
                video.title = data.items[0].snippet.title;
                video.videoId = data.items[0].id.videoId;
                video.thumb = data.items[0].snippet.thumbnails.default.url;
                video.edit = false;
                video.playing = false;
                video.other_videos = [];
                for (i = 1; i < data.items.length; i++) {
                    video.other_videos.push({
                        title : data.items[i].snippet.title,
                        videoId : data.items[i].id.videoId,
                        thumb : data.items[i].snippet.thumbnails.default.url
                    });
                }
            }).
            error(function(data, status, headers, config) {
                $window.alert('동영상 등록에 실패하였습니다.');
            });
    }

    $scope.toggleVideo = function(){
        if(player.getPlayerState() == 1){
            player.pauseVideo();
            $scope.videos[$scope.video_index].playing = false;
        }
        else{
            player.playVideo();
            $scope.videos[$scope.video_index].playing = true;
        }
    }

    $scope.addOtherVideo = function(others, index){
        var addVideo = cloneObject(others[index]);
        addVideo.edit = false;
        addVideo.playing = false;
        addVideo.other_videos = cloneObject(others);
        $scope.videos.push(addVideo);
    }

    $scope.removeVideo = function(index){
        $scope.videos.splice(index,1);
    }

    $scope.shuffleVideos = function(index){
        var video = $scope.videos[index];
        $scope.videos = shuffle($scope.videos);
        $scope.video_index = $scope.videos.indexOf(video);
    }

    $scope.openWithYoutube = function(videoId){
        var url = "https://www.youtube.com/watch?v="
        $window.open(url + videoId);
    }

    $scope.changeVideo = function(video, forced) {
        var index = $scope.videos.indexOf(video);
        $scope.video_index = index;
    }

    // save playlist on cookies
    $scope.$watch('videos', function(){
        angular.forEach($cookies, function (v, k) {
            $cookies.remove(k);
        });
        $cookies.put('video_length', $scope.videos.length);
        jQuery.each($scope.videos, function(i, val){
            $cookies.put('video-' + i, JSON.stringify(val));
        });
        if($scope.videos.length > 0 && $scope.video_index == -1){
            $scope.video_index = 0;
        }
    }, true);

    // codes for youtube player
    var player;
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $window.onYouTubeIframeAPIReady = function(){
        player = new YT.Player('curr_video', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });

        // for change Videos
        $scope.$watch('video_index', function(){
            if($scope.videos.length > 0){
                jQuery.each($scope.videos, function(i, val){
                    val.playing = false;
                });
                player.loadVideoById($scope.videos[$scope.video_index].videoId, 0 , 'large');
                $scope.videos[$scope.video_index].playing = true;
            }
        });
    }

    $window.onPlayerReady = function(event) {
        $scope.$apply(function(){
            if($scope.videos.length > 0){
                $scope.video_index = 0;
            }
        });
    }

    $window.onPlayerStateChange = function(event) {
        $scope.$apply(function(){
            if(event.data == YT.PlayerState.PLAYING) {

            }
            else if(event.data == YT.PlayerState.ENDED){
                if ($scope.videos.length > $scope.video_index + 1){
                    $scope.video_index++;
                }
                else{
                    $scope.video_index = 0;
                }
            }
        });
    }

    $window.stopVideo = function() {
        player.stopVideo();
    }

});
