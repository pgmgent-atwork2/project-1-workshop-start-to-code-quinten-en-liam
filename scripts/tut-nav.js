function tutNav() {
  const $nav = document.getElementById("nav");
  const $menu = document.getElementById("menu");

  $menu.addEventListener("click", function () {
    $nav.classList.toggle("open");
  });
}

export default tutNav;
