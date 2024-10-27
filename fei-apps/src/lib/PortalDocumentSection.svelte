
<script lang="ts">
    import { onMount } from "svelte";
    import { isDarkModeEnabled } from "../stores";

    onMount(() => {
        console.log("Portal document section loaded.");
    });
</script>

<div
        class="documents-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>
    <div class="heading">
        Nahratie dokumentov
    </div>

    <div class="info"></div>


    <div class="file-upload-wrapper">
        <label
                id="document-file-upload"
                for="document-input"
                class="custom-file-upload"
                tabindex="0"
        >
            <i class='bx bx-upload'></i>
            Nahrajte dokument
        </label>
        <input id="document-input" class="document-input" type="file">

        <!-- Proceed button -->
        <div
                class="my-button proceed"
                data-tooltip="Zmeniť profilovú fotku"
        >
            <md-icon-button>
                <i class='bx bxs-right-arrow-circle'></i>
            </md-icon-button>
        </div>

        <!-- Close button //TODO mozno nebude treba -->
        <div
                class="my-button close"
                data-tooltip="Zavrieť"
        >
            <md-icon-button>
                <i class='bx bxs-x-circle'></i>
            </md-icon-button>
        </div>

    </div>


</div>


<style lang="scss">
  .documents-wrapper{
    position: relative;
    background: var(--color-card-background);
    padding: 15px 9%;
    padding-bottom: 50px;


    width: 100%;
    height: 200px;
    box-shadow: var(--box-shadow);
  }

  .documents-wrapper .heading {
    //position: absolute;
    text-align: left;
    color: var(--navbar-icon-color);
    font-size: 25px;
    margin-top: 50px;
  }

  .file-upload-wrapper{
    position: relative;
    display: flex;
    gap: 10px;

    margin-top: 20px;
  }

  .file-upload-wrapper .custom-file-upload{
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--primary-button);
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: 1px solid var(--primary-button);
    border-radius: 5px;
    text-align: center;
    transition: transform 0.3s ease-in-out;
  }

  .file-upload-wrapper .custom-file-upload:hover{
    background-color: var(--primary-button--hover);
    border-color: var(--primary-button--hover);
  }

  .file-upload-wrapper .custom-file-upload:focus{
    background-color: var(--primary-button--hover);
    border-color: white;
  }

  .file-upload-wrapper .document-input{
    display: none;
  }

  .proceed i{
    color: rgba(43, 98, 9);
  }

  .close i{
    color: indianred;
  }

  .proceed::before{
    left: 80%;
  }

  .close::before{
    left: 94.5%;
  }

  .my-button::before {
    --scale: 0;

    --translate-y: 160%;

    position: absolute;

    transform: translateX(-50%) translateY(var(--translate-y, 0)) scale(var(--scale));
    transition: 300ms transform;
    transform-origin: top center;
    //left: 20%;
    content: attr(data-tooltip);
    color: white;
    padding: .5rem;
    border-radius: 8px;
    text-align: center;
    width: max-content;
    background: var(--tooltip-color);
  }

  .my-button:hover::before {
    --scale: 1;
  }
</style>