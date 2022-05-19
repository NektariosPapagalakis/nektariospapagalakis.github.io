function change_image(element,img1,img2){
  if (element.src.includes(img1)){
    element.src = img2;
  }
  else{
    element.src = img1;
  }
}
window.onscroll = function(ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight-47) {
      document.getElementById("go_to_top_arrow").style.color ="#333";
  }
  else{
    document.getElementById("go_to_top_arrow").style.color ="#3b8cd8";
  }
};

function go_to_top(){
  window.scrollTo({top:0,behavior:'smooth'})
}

function change_active_nav_element(element){
  var active_element = document.getElementsByClassName("active");
  active_element[0].classList.remove("active");
  element.classList.add("active");
}