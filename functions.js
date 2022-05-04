function change_image(element,img1,img2){
  if (element.src.includes(img1)){
    element.src = img2;
  }
  else{
    element.src = img1;
  }
}
window.onscroll = function(ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      document.getElementById("go_to_top_arrow").style.color ="#333";
  }
  else{
    document.getElementById("go_to_top_arrow").style.color ="#3b8cd8";
  }
};