
<script lang="ts">
    import {
        isDarkModeEnabled,
        notificationText,
        isNotificationVisible,
        notificationType
    } from "../stores";


    let visibility = "";
    let progressActivity = "";



    $: if ($isNotificationVisible) {
        requestAnimationFrame(() => {
            visibility = "show";
            progressActivity = "active";
        });
    }
</script>

<div class="notification {visibility} {$notificationType}" id="notification">
    <p>{$notificationText}</p>
    <div class="progress-bar {progressActivity}" id="progress-bar"></div>

    <!-- TODO close notification button -->
</div>


<style lang="scss">
  .notification {
    position: fixed;
    top: -100px; /* Začiatok mimo obrazovky -100px */
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    padding: 20px;
    background-color: #4caf50;
    color: white;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    opacity: 0;
    transition: top 0.5s ease, opacity 0.5s ease;
  }

  .notification.error{
    background-color: indianred;
  }

  .notification.show {
    top: 120px;
    opacity: 1;
  }

  //Progress bar
  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    width: 0;
    background-color: #ffffffa0;
    border-radius: 0 0 8px 8px;
    transition: width 3s linear;
  }

  .progress-bar.active {
    width: 100%;
  }
</style>

