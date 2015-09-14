function toggleMenu(btn, menu){
  $(btn).click(function(){
    $(menu).toggle();
  });
}

$(function(){
  var
    changeLangBtn = $('.btn-lang'),
    openMainMenuBtn = $('.main-nav-open'),
    mainNavMenu = $('.main-nav'),
    langList = $('.lang-list');

  toggleMenu(changeLangBtn, langList);
  toggleMenu(openMainMenuBtn, mainNavMenu);
  toggleMenu(mainNavMenu, mainNavMenu);
  toggleMenu(langList, langList);

});