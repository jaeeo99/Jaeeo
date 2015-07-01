/**
 * Created by Jaeeo on 15. 7. 1..
 */

my_app.controller('MusicController', function($scope, $window){
    $scope.query = null;
    $scope.videos = [{
        query : "언제쯤이면",
        title : "[MV] YOON HYUN SANG(윤현상) _ When would it be(언제쯤이면) (Duet. IU(아이유))",
        videoId : "o6HFiVaK15I",
        thumb : "//i.ytimg.com/vi_webp/o6HFiVaK15I/mqdefault.webp",
        played : 0,
        skipped : 0,
        accepted : false,
        edit : false,
        other_videos : []
    },{
        query : "그애 참 싫다",
        title : "IU - 그 애 참 싫다 (Really Hate Her) FarLawmix (Feat. ModernT, uMNew, IU) KPOP Remix FarLaw",
        videoId : "vP4hx43Z5os",
        thumb : "//i.ytimg.com/vi/vP4hx43Z5os/mqdefault.jpg",
        played : 0,
        skipped : 0,
        accepted : false,
        edit : false,
        other_videos : []
    }];
    $scope.curr_video = $scope.videos[0];
    $scope.others = [];

    var player;
    var video_index = 0;
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var changeVideo = function() {
        $scope.curr_video = $scope.videos[video_index];
        player.loadVideoById($scope.curr_video.videoId, 0 , 'large');
    }

    $scope.changeVideo = function(video, forced) {
        index = $scope.videos.indexOf(video);
        video_index = index;
        changeVideo();
    }

    $window.onYouTubeIframeAPIReady = function(){
        player = new YT.Player('curr_video', {
            videoId: $scope.curr_video.videoId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    $window.onPlayerReady = function(event) {
        event.target.playVideo();
    }

    $window.onPlayerStateChange = function(event) {
        if (event.data == YT.PlayerState.PLAYING) {

        }
        else if(event.data == YT.PlayerState.ENDED){
            if ($scope.videos.length > video_index + 1){
                video_index++;
            }
            else{
                video_index = 0;
            }
            changeVideo();
        }
    }

    $window.stopVideo = function() {
        player.stopVideo();
    }
});
