GEO = {
    
    getGeo: function() {
        if(navigator.geolocation) {
            GEO.message('CurateMe Flickr photos geolocating...');                    
            navigator.geolocation.getCurrentPosition(FLICKR.setup, this.message);
        } else {
            this.message('Geolocation service is unavailable');
        }
    },
    
    message: function(msg) {
        $('#status').html(msg);
    }
};

FLICKR = {
    url: 'https://api.flickr.com/services/rest/?',
    params: {
        method:  'flickr.photos.search',
        api_key: 'ebf0d0344b1f200ad29dc4f473b71308',
        secret: "d54c90fe3d715c4f",
        format:  'json',
        radius:   1,
        has_geo:  1,
        nojsoncallback: 1
    },
    
    setup: function(position) {
        GEO.message('Finding Flickr photos near ' + position.coords.latitude + ', ' + position.coords.longitude);
        FLICKR.search(position.coords.latitude, position.coords.longitude);
    },
    
    search: function(lat, lon) {
        FLICKR.params.lat = lat;
        FLICKR.params.lon = lon;

        $.ajax({
          url: FLICKR.url,
          data: FLICKR.params,
          dataType: 'json',
          
          success: function(data){
            GEO.message('Loading photo...');                        
            FLICKR.display(data);
          },
          
          error: function(request, textStatus, errorThrown) {
            GEO.message(textStatus);
          }
        });

    },
    
    display: function(data) { 
        if(typeof(data.photos) == "undefined") {
            GEO.message('No photos found.');
            return false;
        } else if(data.photos.total <= 0) {
            GEO.message('No photos found.');
            return false;            
        }
         
        var i = Math.floor(Math.random()*data.photos.photo.length);
        var photo = data.photos.photo[i];
                            
        var src = "http://farm"+ 
                    photo.farm +".static.flickr.com/"+ 
                    photo.server +"/"+ 
                    photo.id +"_"+ 
                    photo.secret +"_z.jpg";
        
        var image = new Image();
        image.onload = function(){
            
						$(image).appendTo($('#container'));

            if(photo.title) {
                GEO.message(photo.title);                
            } else {
                GEO.message('Untitled');
            }
        };
        image.src = src;
        return true;
    }
}

window.onload = GEO.getGeo;

