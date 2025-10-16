
<template>
    <div class="block404">
        <div class="txt"><div class="number">404</div><div class="error sbf">error</div><div class="please bf">извините, нам не удалось найти эту страницу</div></div>
        <router-link to="/" class="btn"><div class="btnText sbf">перейти на главную</div></router-link>
    </div>
</template>

<style scoped>
@media (min-width: 1100px) {
  .block404 {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    background: var(--txtDark) ;
    color: var(--milkyBG);
    display: flex;
    padding-top: 13px;
    align-items: center;
    flex-direction: column;
    gap: 100px;
    text-transform: uppercase; }
    .block404 .txt {
      position: inherit;
      height: 660px;
      display: flex;
      justify-content: center; }
      .block404 .txt .number {
        font-family: Jost;
        font-size: 550px;
        font-style: normal;
        font-weight: 200;
        line-height: 120%;
        text-transform: uppercase; }
      .block404 .txt .error {
        position: absolute;
        color: var(--milkyBG);
        top: 330px; }
      .block404 .txt .please {
        position: absolute;
        bottom: 29px;
        color: var(--milkyBG); }
    .block404 .btn {
      position: relative;
      padding: 26px 40px;
      border: 1px solid var(--milkyBG);
      text-decoration: none;
      animation: btnNotHover 300ms ease-in-out;
      background: var(--txtDark) url("../assets/noise.png"); }
      .block404 .btn .btnText {
        color: var(--milkyBG); }
    .block404 .btn:hover {
      animation: btnHover 300ms ease-in-out;
      background: var(--accentBlue) url("../assets/noise.png"); }
  @keyframes btnHover {
    0% {
      background: var(--txtDark) url("../assets/noise.png"); }
    100% {
      background: var(--accentBlue) url("../assets/noise.png"); } }
  @keyframes btnNotHover {
    0% {
      background: var(--accentBlue) url("../assets/noise.png"); }
    100% {
      background: var(--txtDark) url("../assets/noise.png"); } } }

@media (max-width: 1100px) {
  .block404 {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    background: var(--txtDark) url("../assets/noise.png");
    color: var(--milkyBG);
    display: flex;
    padding-top: 203px;
    align-items: center;
    flex-direction: column;
    gap: 121px;
    text-transform: uppercase; }
    .block404 .txt {
      position: inherit;
      display: flex;
      flex-direction: column;
      align-items: center; }
      .block404 .txt .number {
        position: relative;
        color: var(--backroundMilky, #E7E9E8);
        font-family: Jost;
        font-size: 180px;
        font-style: normal;
        font-weight: 200;
        line-height: 120%; }
      .block404 .txt .error {
        position: absolute;
        color: var(--milkyBG);
        top: 98px;
        font-size: 16px;
        font-weight: 500; }
      .block404 .txt .please {
        position: relative;
        color: var(--milkyBG);
        max-width: 253px;
        font-size: 16px;
        font-style: normal;
        font-weight: 300;
        line-height: 120%; }
    .block404 .btn {
      position: relative;
      text-decoration: none;
      padding: 17px 22px;
      border: 1px solid var(--milkyBG); }
      .block404 .btn .btnText {
        color: var(--milkyBG);
        text-decoration: none; } }


</style>

