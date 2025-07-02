<script lang="ts">
  import { onMount } from "svelte";

  //Routing
  import { Router, Route, navigate } from "svelte-routing";

  //Import initial komponentov
  import LoginForm from "./lib/LoginForm.svelte";
  import RegistrationForm from "./lib/RegistrationForm.svelte";
  import ResetPasswordForm from "./lib/ResetPasswordForm.svelte";
  import AppFooter from "./lib/AppFooter.svelte";

  //Stores
  import { currentApp , isNotificationVisible , isTutorialActive } from "./stores";

  //Dynamicke nacitanie komponentov po prihlaseni
  let
          // Apps
          Navbar :any,
          WelcomeSection :any,
          AppWidgets :any,
          ProfileInfoCard :any,
          Notes :any,
          Settings :any,
          Notification :any,

          // Portal
          Portal :any,
          PortalTutorial :any,
          PortalDocumentSection :any,

          // Connections
          Connections :any
  ;

  async function loadComponents(){
    navigate("/loading" , { replace: true });
    isLoadingComponents = true;

    const [
            NavbarM,
            WelcomeSectionM,
            AppWidgetsM,
            ProfileInfoCardM,
            NotesM,
            SettingsM,
            NotificationM
    ] = await Promise.all([
      import('./lib/Navbar.svelte'),
      import('./lib/WelcomeSection.svelte'),
      import('./lib/AppWidgets.svelte'),
      import('./lib/ProfileInfoCard.svelte'),
      import('./lib/Notes.svelte'),
      import('./lib/Settings.svelte'),
      import('./lib/Notification.svelte')
    ]);

    isLoadingComponents = false;

    Navbar = NavbarM.default;
    WelcomeSection = WelcomeSectionM.default;
    AppWidgets = AppWidgetsM.default;
    ProfileInfoCard = ProfileInfoCardM.default;
    Notes = NotesM.default;
    Settings = SettingsM.default;
    Notification = NotificationM.default;

    // Po skonceni nacitavania komponentov presmerujeme pouzivatela na dashboard
    navigate("/dashboard" , { replace: true });
  }

  async function loadAppComponents(){

    // Portal components
    if ($currentApp == "portal"){

      const [
        PortalM,
        PortalTutorialM,
        PortalDocumentSectionM
      ] = await Promise.all([
        import('./lib/Portal.svelte'),
        import('./lib/PortalTutorial.svelte'),
        import('./lib/PortalDocumentSection.svelte')
      ]);


      Portal = PortalM.default;
      PortalTutorial = PortalTutorialM.default;
      PortalDocumentSection = PortalDocumentSectionM.default;
    }

    // Connections components
    if ($currentApp == "connections"){
      const [
              ConnectionsM
      ] = await Promise.all([
        import('./lib/Connections.svelte')
      ]);

      Connections = ConnectionsM.default;
    }


    // Po skonceni nacitavania komponentov presmerujeme pouzivatela na prislusnu aplikaciu
    navigate(("/" + $currentApp) , { replace: true });
  }

  // Po prihlaseni sa dynamicky nacitaju komponenty
  $: if ($loggedUser) {
    loadComponents();
  }

  $: if ($currentApp){
    loadAppComponents();
  }
  //----------------------------


  // State control
  import { isDarkModeEnabled, loggedIn, loggedUser } from "./stores";

  let isLoadingComponents = false;
  let isSigningUp = false;
  let isResetingPassword = false;
  let isProfileInfoCardOpen = false;
  let isSettingsOpen = false;


  //----------------------------

  // Functions
  onMount(() => {
    console.log("App loaded.");

    //Nastavenie default Route na /login
    navigate("/login" , { replace : true });
  });

  //----------------------------
</script>

<div class="app-wrapper">
  <div class="app-content">
    <Router>

      <!-- Prihlasovanie -->
      <Route path="/login">
        {#if
                !($loggedIn) &&
                !isSigningUp &&
                !isResetingPassword
        }
          <LoginForm
                  bind:isSigningUp={isSigningUp}
                  bind:isResetingPassword={isResetingPassword}
          ></LoginForm>
        {/if}
      </Route>

      <!-- Registracia -->
      <Route path="/register">
        {#if
                !($loggedIn) &&
                !isResetingPassword &&
                isSigningUp
        }
          <RegistrationForm
                  bind:isSigningUp={isSigningUp}
          ></RegistrationForm>
        {/if}
      </Route>


      <!-- Resetovanie hesla -->
      <Route path="/reset">
        {#if
                !($loggedIn) &&
                !isSigningUp &&
                isResetingPassword
        }
          <ResetPasswordForm
                  bind:isResetingPassword={isResetingPassword}
          ></ResetPasswordForm>
        {/if}
      </Route>

      <!-- Loader po prihlaseni -->
      <Route path="/loading">
        {#if isLoadingComponents}
          <div class="spinner-wrapper">
            <div class="logo">
              <!-- old FEI
              <svg width="91" height="31" viewBox="0 0 91 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                        d="M2.3 17.8385C3.6 17.8385 4.6 16.8352 4.6 15.5309C4.6 14.2265 3.6 13.2231 2.3 13.2231C0.999999 13.2231 0 14.2265 0 15.5309C0 16.7349 0.999999 17.8385 2.3 17.8385Z"
                        fill="#0039A6" />
                <path
                        d="M2.3 30.4807C3.6 30.4807 4.6 29.4774 4.6 28.173C4.6 26.8687 3.6 25.8654 2.3 25.8654C0.999999 25.8654 0 26.8687 0 28.173C0 29.4774 0.999999 30.4807 2.3 30.4807Z"
                        fill="#0039A6" />
                <path
                        d="M14.9 17.8385C16.2 17.8385 17.2 16.8352 17.2 15.5309C17.2 14.2265 16.2 13.2231 14.9 13.2231C13.6 13.2231 12.6 14.2265 12.6 15.5309C12.6 16.7349 13.6 17.8385 14.9 17.8385Z"
                        fill="#0039A6" />
                <path
                        d="M14.9 30.4807C16.2 30.4807 17.2 29.4774 17.2 28.173C17.2 26.8687 16.2 25.8654 14.9 25.8654C13.6 25.8654 12.6 26.8687 12.6 28.173C12.6 29.4774 13.6 30.4807 14.9 30.4807Z"
                        fill="#0039A6" />
                <path
                        d="M27.5 17.8385C28.8 17.8385 29.8 16.8352 29.8 15.5309C29.8 14.2265 28.8 13.2231 27.5 13.2231C26.2 13.2231 25.2 14.2265 25.2 15.5309C25.2 16.7349 26.2 17.8385 27.5 17.8385Z"
                        fill="#0039A6" />
                <path
                        d="M2.3 5.09607C3.6 5.09607 4.6 4.09274 4.6 2.78839C4.6 1.48405 3.6 0.480713 2.3 0.480713C0.999999 0.480713 0 1.48405 0 2.78839C0 4.09274 0.999999 5.09607 2.3 5.09607Z"
                        fill="#0039A6" />
                <path
                        d="M14.9 5.09607C16.2 5.09607 17.2 4.09274 17.2 2.78839C17.2 1.48405 16.2 0.480713 14.9 0.480713C13.6 0.480713 12.6 1.48405 12.6 2.78839C12.6 4.09274 13.6 5.09607 14.9 5.09607Z"
                        fill="#0039A6" />
                <path
                        d="M27.5 5.09607C28.8 5.09607 29.8 4.09274 29.8 2.78839C29.8 1.48405 28.8 0.480713 27.5 0.480713C26.2 0.480713 25.2 1.48405 25.2 2.78839C25.2 4.09274 26.2 5.09607 27.5 5.09607Z"
                        fill="#0039A6" />
                <path
                        d="M27.5 30.4807C28.8 30.4807 29.8 29.4774 29.8 28.173C29.8 26.8687 28.8 25.8654 27.5 25.8654C26.2 25.8654 25.2 26.8687 25.2 28.173C25.2 29.4774 26.2 30.4807 27.5 30.4807Z"
                        fill="#0039A6" />
                <path
                        d="M40.2 17.8385C41.5 17.8385 42.5 16.8352 42.5 15.5309C42.5 14.2265 41.5 13.2231 40.2 13.2231C38.9 13.2231 37.9 14.2265 37.9 15.5309C37.9 16.7349 38.9 17.8385 40.2 17.8385Z"
                        fill="#0039A6" />
                <path
                        d="M40.2 30.4807C41.5 30.4807 42.5 29.4774 42.5 28.173C42.5 26.8687 41.5 25.8654 40.2 25.8654C38.9 25.8654 37.9 26.8687 37.9 28.173C37.9 29.4774 38.9 30.4807 40.2 30.4807Z"
                        fill="#0039A6" />
                <path
                        d="M40.2 5.09607C41.5 5.09607 42.5 4.09274 42.5 2.78839C42.5 1.48405 41.5 0.480713 40.2 0.480713C38.9 0.480713 37.9 1.48405 37.9 2.78839C37.9 4.09274 38.9 5.09607 40.2 5.09607Z"
                        fill="#0039A6" />
                <path
                        d="M79.3 18.0393C79.2 18.0393 79.1 18.1396 79.1 18.24V30.1798C79.1 30.2801 79.2 30.3804 79.3 30.3804H80.7C80.8 30.3804 80.9 30.2801 80.9 30.1798V18.24C80.9 18.1396 80.8 18.0393 80.7 18.0393H79.3ZM67.9 19.6446C67.9 19.5443 67.9 19.5443 68 19.5443H72.9C73 19.5443 73.1 19.444 73.1 19.3436V18.24C73.1 18.1396 73 18.0393 72.9 18.0393H66.3C66.2 18.0393 66.1 18.1396 66.1 18.24V30.1798C66.1 30.2801 66.2 30.3804 66.3 30.3804H72.9C73 30.3804 73.1 30.2801 73.1 30.1798V29.0761C73.1 28.9758 73 28.8754 72.9 28.8754H68C67.9 28.8754 67.9 28.7751 67.9 28.7751V24.862H71.9C72 24.862 72.1 24.7617 72.1 24.6614V23.5577C72.1 23.4574 72 23.357 71.9 23.357H67.9V19.6446ZM55.6 19.6446C55.6 19.5443 55.7 19.5443 55.7 19.5443H60.5C60.6 19.5443 60.7 19.444 60.7 19.3436V18.24C60.7 18.1396 60.6 18.0393 60.5 18.0393H54.1C54 18.0393 53.9 18.1396 53.9 18.24V30.1798C53.9 30.2801 54 30.3804 54.1 30.3804H55.5C55.6 30.3804 55.7 30.2801 55.7 30.1798V24.862H59.5C59.6 24.862 59.7 24.7617 59.7 24.6614V23.5577C59.7 23.4574 59.6 23.357 59.5 23.357H55.7V19.6446H55.6Z"
                        fill="#000" />
                <path
                        d="M90.8 0.882045C90.8 0.681376 90.7 0.681363 90.6 0.681363H88.3C88.2 0.681363 88.1 0.78171 88.1 0.882045V9.10945C88.1 10.3135 87.4 10.9155 86.1 10.9155C84.8 10.9155 84.1 10.3135 84.1 9.10945V0.882045C84.1 0.681376 84 0.681363 83.9 0.681363H81.6C81.4 0.681363 81.4 0.78171 81.4 0.882045V9.20979C81.4 11.6178 82.7 13.1228 86.1 13.1228C89.4 13.1228 90.8 11.6178 90.8 9.20979V0.882045ZM72.3 13.0225C72.5 13.0225 72.5 12.9222 72.5 12.8218V3.08938C72.5 2.98905 72.5 2.98907 72.6 2.98907H75.5C75.6 2.98907 75.7 2.88873 75.7 2.78839V1.0827C75.7 0.882026 75.6 0.882045 75.5 0.882045H66.8C66.6 0.882045 66.6 0.982361 66.6 1.0827V2.78839C66.6 2.98906 66.7 2.98907 66.8 2.98907H69.6C69.7 2.98907 69.7 3.08938 69.7 3.08938V12.8218C69.7 13.0225 69.8 13.0225 69.9 13.0225H72.3ZM53.5 12.4205C54.7 13.0225 55.8 13.1228 57.2 13.1228C59.8 13.1228 61.5 11.8185 61.5 9.41047C61.5 7.70479 60.7 6.6011 58.6 5.69809C56.8 4.99575 56.5 4.59443 56.5 3.99242C56.5 3.29008 57 2.78839 58.1 2.78839C58.9 2.78839 59.6 2.88872 60.2 3.18973C60.4 3.29006 60.5 3.18972 60.5 3.08938L61.3 1.48406C61.4 1.38372 61.4 1.28337 61.2 1.18304C60 0.681363 59.2 0.480713 57.6 0.480713C55.1 0.480713 53.6 1.98573 53.6 3.99242C53.6 5.79844 54.5 6.90211 56.6 7.80512C58.2 8.50746 58.6 8.90878 58.6 9.61112C58.6 10.3135 58 10.8152 57 10.8152C55.8 10.8152 55.2 10.6145 54.5 10.2131C54.4 10.1128 54.3 10.2131 54.2 10.3135L53.4 12.1195C53.4 12.3202 53.4 12.3202 53.5 12.4205Z"
                        fill="#000" />
              </svg> -->

              <!-- UMIKT logo -->
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256.73 71.2"><defs><style>.cls-1{fill:#009edb;}.cls-2{fill:#00549f;}</style></defs><title>UMIKT-colour</title><path class="cls-1" d="M.71,0H14.59a.71.71,0,0,1,.71.71V43.4c0,9.5,5.8,14.9,14.3,14.9s14.3-5.4,14.3-14.9V.71A.71.71,0,0,1,44.61,0H58.39a.71.71,0,0,1,.71.71V43.4c0,18.7-12.3,27.8-29.5,27.8S0,62.1,0,43.4V.71A.71.71,0,0,1,.71,0Z"/><rect class="cls-2" x="127.5" y="22.88" width="14.5" height="47.12" rx="0.71" ry="0.71"/><rect class="cls-2" x="127.5" width="14.5" height="14.5" rx="0.71" ry="0.71"/><rect class="cls-1" x="22.3" width="14.5" height="14.5" rx="0.71" ry="0.71"/><path class="cls-2" d="M175.52,0h15.3a.71.71,0,0,1,.57,1.13L166.55,34.58a.71.71,0,0,0,0,.85l24.85,33.45a.71.71,0,0,1-.57,1.13h-15.3a.71.71,0,0,1-.57-.29L149.48,35.42a.71.71,0,0,1,0-.85L175,.29A.71.71,0,0,1,175.52,0Z"/><path class="cls-2" d="M217.72,13.4H198a.71.71,0,0,1-.71-.71V.71A.71.71,0,0,1,198,0h58a.71.71,0,0,1,.71.71v12a.71.71,0,0,1-.71.71H234.24a.71.71,0,0,0-.71.71V69.3a.71.71,0,0,1-.71.71H219.14a.71.71,0,0,1-.71-.71V14.11A.71.71,0,0,0,217.72,13.4Z"/><path class="cls-1" d="M105.12,29.08,84.81.3a.71.71,0,0,0-.58-.3H70.11a.71.71,0,0,0-.71.71V69.3a.71.71,0,0,0,.71.71h13a.71.71,0,0,0,.71-.71V23.79a.71.71,0,0,1,1.28-.41L105,51a.71.71,0,0,0,1.15,0l13.69-18.88a.71.71,0,0,0,.13-.42V12a.71.71,0,0,0-1.29-.41L106.28,29.08A.71.71,0,0,1,105.12,29.08Z"/></svg>

              <label>APPS</label>
            </div>
          </div>
        {/if}
      </Route>


      <Route path="/dashboard">
        <!-- Hlavny distribucny uzol , zoznam aplikacii -->
        {#if
                $loggedIn &&
                !isSettingsOpen
        }
          <!-- Navbar -->
          {#if Navbar}
            <svelte:component
                    this={Navbar}
                    bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
            />
          {/if}

          <!-- Welcome section -->
          {#if WelcomeSection}
            <svelte:component
                    this={WelcomeSection}
            />
          {/if}

          <!-- App section -->
          {#if AppWidgets}
            <svelte:component
                    this={AppWidgets}
            />
          {/if}


          <!-- Notes section -->
          {#if Notes}
            <svelte:component
                    this={Notes}
            />
          {/if}


          <!-- Profile Info Card -->
          {#if ProfileInfoCard}
            {#if isProfileInfoCardOpen}
              <svelte:component
                      this={ProfileInfoCard}
                      bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
              />
            {/if}
          {/if}

          <!-- Notification -->
          {#if $isNotificationVisible}
            {#if Notification}
              <svelte:component this={Notification}/>
            {/if}
          {/if}

        {/if}
      </Route>

      <Route path="/settings">
        <!-- Nastavenia -->
        {#if Settings}
          {#if Navbar}
            <svelte:component
                    this={Navbar}
                    bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
            />
          {/if}
          <svelte:component
                  this={Settings}
          />
        {/if}

        <!-- Notification -->
        {#if $isNotificationVisible}
          {#if Notification}
            <svelte:component this={Notification}/>
          {/if}
        {/if}
      </Route>



      <!-- Spustena ina aplikacia -->
      <Route path="/portal">
        <!-- Navbar -->
        {#if (Navbar)}
          <svelte:component
                  this={Navbar}
                  bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
          />
        {/if}

        <!-- Profile Info Card -->
        {#if ProfileInfoCard}
          {#if isProfileInfoCardOpen}
            <svelte:component
                    this={ProfileInfoCard}
                    bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
            />
          {/if}
        {/if}

        <!-- Portal Tutorial -->
        {#if $isTutorialActive}
          {#if PortalTutorial}
            <svelte:component
                    this={PortalTutorial}
            />
          {/if}
        {/if}

        <!-- Portal -->
        {#if Portal}
          <svelte:component this={Portal}/>
        {/if}

        <!-- Portal Document Section -->
        {#if PortalDocumentSection}
          <svelte:component this={PortalDocumentSection}/>
        {/if}

        <!-- Notification -->
        {#if $isNotificationVisible}
          {#if Notification}
            <svelte:component this={Notification}/>
          {/if}
        {/if}
      </Route>

      <Route path="/connections">
        <!-- Navbar -->
        {#if (Navbar)}
          <svelte:component
                  this={Navbar}
                  bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
          />
        {/if}

        <!-- Profile Info Card -->
        {#if ProfileInfoCard}
          {#if isProfileInfoCardOpen}
            <svelte:component
                    this={ProfileInfoCard}
                    bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
            />
          {/if}
        {/if}

        <!-- Connections -->
        {#if Connections}
          <svelte:component this={Connections}/>
        {/if}
      </Route>

      <!-- TODO Fun zone -->
      <Route path="/fun">

        <!-- Funzone -->

      </Route>

    </Router>
  </div>


  {#if !isLoadingComponents}  <!-- Zobrazeny len vtedy ak sa dynamicky nenacitavaju komponenty -->
    <div class="app-footer">
      <!-- App Footer -->
      <AppFooter bind:isDarkModeEnabled={$isDarkModeEnabled}></AppFooter>
    </div>
  {/if}
</div>



<style lang="scss">

  //Spinner
  .logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50% , -50%);
    display: flex;
    align-items: center;
    gap: 50px;
  }

  .logo svg {
    width: 300px;
    height: 300px;

    animation: spinnerAnimation 1s infinite;
  }

  .logo label {
    font-size: 80px;
    font-weight: bold;
    text-decoration: none;
    color: #0039A6;

    animation: spinnerAnimation 1s infinite;
  }

  .spinner-wrapper{
    position: relative;

    width: 100vw;
    height: 100vh;

    background: radial-gradient(circle, rgba(210, 210, 210, .5) 2px, #fafafa 0px);
    background-size: 10px 10px;
  }

  @keyframes spinnerAnimation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.55;
    }
    100% {
      opacity: 1;
    }
  }

  //------------------------------------------------------
</style>
