/*************************************************
            Assessment: JS in the Wild
 *************************************************/

// The FlickrPhotos class represents a photo search
// at the Flickr webpage with a specific location of 
// the browser. It has some properties such as perPage 
//(#of photo per pages) and term: keyword for the search 
// and some methods such as searchFlickr, processImages
class FlickrPhotos {
  constructor(position) {
    this.term = "dog"
    this.page = 1;
    this.perPage = 5;
    this.imageUrls = [];
    this.imgIndex = 0;
    this.position = position;
    this.container = document.getElementById('image_container')
    document.getElementById('button').addEventListener('click', this.displayNextImage.bind(this))
  }

  // The searchFlickr method makes the HTTP request to 
  // the Flickr API for the image data and updates the 
  // property of the imageUrls array.
  searchFlickr() {
    let urlSearch = this.queryUrl(); 
    let fetchPromise = fetch(urlSearch);
    fetchPromise
      .then(response => response.json())
      .then((data) => {
        let imgArr = data.photos.photo
        this.processImages(imgArr)
      })
  }

  // The processImages method converts the imgArr array
  // of the objects to the imageUrls array of the urls
  // per page.
  processImages(imgArr){
  //  setTimeout(() => {return imgArr}, 200)
    for(let i=0; i < imgArr.length; i++){
     let imgUrl = this.constructImageUrl(imgArr[i])
     this.imageUrls.push(imgUrl);
    }
    this.displayImage();
    return this.imageUrls;
  }

  // The displayImage method renders an image with
  // an url in the imagUrls array to the page.
  displayImage(){
    let imgElement = document.createElement("img")
    imgElement.src = this.imageUrls[this.imgIndex];
    imgElement.style.height ="500px"
    imgElement.style.width ="800px"
    this.container.innerHTML ="";
    this.container.append(imgElement);
  }

  // the displayNextImage method renders the next url
  // in the imageUrls array of the property to the page 
  // with a button click.
  displayNextImage(){
    this.imgIndex += 1;
    this.displayImage();

    if(this.imgIndex === this.imageUrls.length-2){
      this.page +=1;
      this.searchFlickr();
    }

    if(this.imgIndex > this.imageUrls.length + 1){
      this.container.innerHTML = `<h2> Sorry, no more photo.</h2>`
    }
  }

  // The queryUrl method returns the query parameters specified by
  // the current values of the class properties.
  queryUrl() {
    return 'https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/' +
      '?api_key=15c93c05fdf0114824be564f6d5cb8a6' +
      '&format=json' +
      '&nojsoncallback=1' +
      '&method=flickr.photos.search' +
      '&safe_search=1' +
      '&per_page=' + this.perPage +
      '&page=' + this.page +
      '&lat=' + this.position.latitude +
      '&lon=' + this.position.longitude +
      '&text=' + this.term;
  }

  // The constructImageUrl method returns a string of an url from an object.
  constructImageUrl(imgObj) {
    return "https://farm" + imgObj.farm + ".staticflickr.com/" + imgObj.server +
      "/" + imgObj.id + "_" + imgObj.secret + ".jpg";
  }

}

// The geoSuccess function is the callback function of the .watchPosition method.
// It takes the geoLocationPosition object as its parameter and that object returns
// the current position of the device, and its coordicates(latitude and longitude) 
// are used to search for the photos.
function geoSuccess(location) {
  let position = location.coords;
  let queryPhotos = new FlickrPhotos(position);
  queryPhotos.searchFlickr();
}

// The geoError function is the optional callback function of the .watchPosition method.
// It takes the parameter of the geolocationPositionError object, which represents the error
// using the geolocating device. If the location of the device is turned off,
// the default position of New York City is used for searching the photos.
function geoError() {
  //New York City
  let defaultPosition = { latitude: 40.7127837, longitude: -74.0059413 }
  let queryPhotos = new FlickrPhotos(defaultPosition);
  queryPhotos.searchFlickr();
}

// The .watchPosition method of the Navigator object is called.
// If the device has a turn-on location, it invokes the geoSuccess callback. 
// Otherwise, the geoError is invoked instead.
navigator.geolocation.watchPosition(geoSuccess, geoError)
