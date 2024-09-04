<script lang="ts">
    import '@material/web/iconbutton/icon-button.js';
    import '@material/web/fab/fab.js';


    export let isSettingsOpen;
    export let isDarkModeEnabled;
</script>

<div
        class="settings-container"
        class:dark-mode={isDarkModeEnabled}
>

    <div class="heading">
        <i class='bx bx-cog'></i>
        <h2>Nastavenia</h2>
    </div>

    <div class="settings">
        <div class="setting">
            <div class="setting-title">
                <label>Tmavý režim</label>
            </div>
            <div class="setting-option"></div>
        </div>

        <div class="setting">
            <div class="setting-title">
                <label>Jazyk</label>
            </div>
            <div class="setting-option"></div>
        </div>

        <div class="setting">
            <div class="setting-title">
                <label>Profilová fotka</label>
            </div>
            <div class="setting-option"></div>
        </div>

        <div class="setting">
            <div class="setting-title">
                <label>Informácie</label>
            </div>
            <div class="setting-option"></div>
        </div>

        <div class="close-settings"> <!-- TODO lepsie buttony, na ulozenie a vratenie sa
            TODO doriesit pozadie, ktore prekryva Nastavenia label
            TODO porobit options, ukladanie do databazy pre jednotlivych userov
        -->
            <md-icon-button
                    on:click={() => {
                isSettingsOpen = false;
            }}
            >
                <i class='bx bx-x'></i>
            </md-icon-button>
        </div>
    </div>
</div>

<style lang="scss">

    .settings-container{
      background: var(--welcome-section-background);
      padding: 55px 9%;
      height: 100vh;
      position: relative;
    }

    .settings-container .heading {
      display: flex;
      gap: 20px;
      position: absolute;
      text-align: left;
      color: var(--navbar-icon-color);
      font-size: 20px;
      margin-top: 100px;
      margin-left: 6.5rem;
    }

    .settings-container .heading i{
      position: absolute;
      font-size: 25px;
      top: 7px;
      left: -30px;
    }

    .close-settings{
      position: absolute;
      top: 55px;
      right: 30px;
    }

    .settings-container .settings{
      background: var(--dotted-background-with-opacity);
      background-size: 10px 10px;
      height: 100%;
      border-radius: 50px;
      border: 3px solid rgba(0, 0, 0, 0.2);
      margin-top: 40px;

      position: relative;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .settings-container .settings .setting{
      display: flex;
      flex-direction: row;
      align-items: center;

      width: 100%;
      height: 60px;
      border: var(--setting-border);
      border-radius: 2px;

      &:nth-child(1){
        margin-top: 100px;
      }
    }

    .settings-container .settings .setting .setting-title{
      width: 50%;
      height: 30px;

      text-align: center;

      background: rgba(0, 0, 255, 0.2);
    }

    .settings-container .settings .setting .setting-title label{
      color: var(--navbar-icon-color);
      font-size: 18px;
    }

    .settings-container .settings .setting .setting-option{
      width: 50%;
      height: 30px;

      background: rgba(0, 128, 0, 0.2);
    }
</style>