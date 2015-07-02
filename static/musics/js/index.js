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
                if (e.keyCode == 13){
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

my_app.controller('MusicController', function($scope, $window, $http, $cookieStore){

    var initVideos = function(videos){
        var video_length = $cookieStore.get('video_length');
        if (video_length != null && parseInt(video_length) > 0){
            for(i = 0 ; i < video_length ; i++){
                var video = JSON.parse($cookieStore.get('video-' + i));
                videos.push(video);
            }
        }
    }

    // init angular datas
    $scope.query = null;
    $scope.videos = [];
    $scope.video_index = 0;
    initVideos($scope.videos);

    // def angular function
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

    // save playlist on cookies
    $scope.$watch('videos', function(){
        angular.forEach($cookies, function (v, k) {
            $cookieStore.remove(k);
        });

        $cookieStore.put('video_length', $scope.videos.length);
        angular.forEach($scope.videos, function(i, val){
            $cookieStore.put('video-' + i, JSON.stringify(val));
        });
    }, true);

    // codes for youtube player
    var player;
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var changeVideo = function() {
        angular.forEach($scope.videos, function(i, val){
            val.playing = false;
        });
        player.loadVideoById($scope.videos[$scope.video_index].videoId, 0 , 'large');
        $scope.videos[$scope.video_index].playing = true;
    }

    $window.onYouTubeIframeAPIReady = function(){
        player = new YT.Player('curr_video', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    $scope.changeVideo = function(video, forced) {
        index = $scope.videos.indexOf(video);
        $scope.video_index = index;
        changeVideo();
    }

    $window.onPlayerReady = function(event) {
        if($scope.videos.length != 0){
            changeVideo();
        }
        event.target.playVideo();
    }

    $window.onPlayerStateChange = function(event) {
        if (event.data == YT.PlayerState.PLAYING) {

        }
        else if(event.data == YT.PlayerState.ENDED){
            if ($scope.videos.length > $scope.video_index + 1){
                $scope.video_index++;
            }
            else{
                $scope.video_index = 0;
            }
            changeVideo();
        }
    }

    $window.stopVideo = function() {
        player.stopVideo();
    }

});
