<script lang="ts">
    const allLinks = document.querySelectorAll(".tabs a");
    const allTabs = document.querySelectorAll(".tab-content");

    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            const linkId = link.id;

            allLinks.forEach(l => l.classList.toggle("active", l === link));
            allTabs.forEach(tab => tab.classList.toggle("active-tab-content", tab.id === linkId));
        });
    });

    export let isDarkModeEnabled;
    export let loggedUser;
</script>

<div
        class="profile-card-container"
        class:dark-mode={isDarkModeEnabled}
>
    <div class="container">
        <header>
            <div class="info">
                <div class="count">
                    <p>{loggedUser.aisId}</p>
                </div>
                <p>AIS ID</p>
            </div>

            <div class="profile">
                <img src="{loggedUser.photoURL}">
                <button class="status-circle" disabled></button>
            </div>

            <div class="info">
                <div class="count">
                    <p>2. bc</p>
                </div>
                <p>Ročník</p>
            </div>
        </header>

        <div class="about">
            <h2>Ing. {loggedUser.displayName} PhD <i class='bx bxs-badge-check'></i></h2>
            <p>Informačné a komunikačné technológie</p>
        </div>

        <div class="tabs-container">
            <ul class="tabs">
                <li>
                    <a href="#about" id="tab-1">O mne</a>
                </li>
                <li>
                    <a href="#contact" id="tab-2">Kontakt</a>
                </li>
                <li>
                    <a href="#social" id="tab-3">Siete</a>
                </li>
                <!--
                <li>
                    <a href="#comments" id="tab-4">Comments</a>
                </li>
                -->
                <li id="active-tab"></li>
            </ul>
        </div>

        <div class="tab-content" id="tab-1">
            <p>
                Študent, admin pre API. 2 roc bc
            </p>
        </div>

        <div class="tab-content" id="tab-2">

        </div>

        <div class="tab-content active-tab-content" id="tab-3">
            <div class="social-links">
                <a href="#"><i class='bx bxl-youtube'></i></a>
                <a href="#"><i class='bx bxl-linkedin-square' ></i></a>
                <a href="#"><i class='bx bxl-github'></i></a>
                <a href="#"><i class='bx bxl-twitter' ></i></a>
                <a href="#"><i class='bx bxl-instagram-alt'></i></a>
                <a href="#"><i class='bx bxl-facebook-circle'></i></a>
            </div>
        </div>


        <div class="tab-content" id="tab-4">
            <p>
                Here are some of my students comments 👨‍🎓
            </p>
            <div class="comments">
                <div class="comment">
                    <img src="avatar.png">
                    <div>
                        <h4>John D</h4>
                        <p>
                            Incredible instructor! Clear explanations and practical examples.
                        </p>
                    </div>
                </div>
                <div class="comment">
                    <img src="avatar.png">
                    <div>
                        <h4>Alex R</h4>
                        <p>
                            Transformative learning experience, thanks to the insightful guidance.
                        </p>
                    </div>
                </div>
                <div class="comment">
                    <img src="avatar.png">
                    <div>
                        <h4>Sarah K</h4>
                        <p>
                            Engaging content, easy to follow, highly recommended.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <script src="script.js"></script>
</div>



<style>
    a {
        text-decoration: none;
    }

    .profile-card-container {
        background: var(--dotted-background);
        background-size: 10px 10px;
        color: var(--navbar-icon-color);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100vh;
    }

    .container {
        background: var(--color-card-background);
        width: 448px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border-radius: 16px;
        box-shadow: var(--box-shadow);
    }

    .container header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 12px;
    }

    .container header .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        font-size: 15px;
        width: 100%;
        flex-grow: 1;
    }

    .container header .info .count {
        padding: 6px;
        font-weight: 600;
        width: 100%;
        background: var(--color-card-background);
        border: 1px solid #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: 8px;
    }

    .container header .profile {
        position: relative;
        width: 400px;
    }

    .container header .profile img {
        position: relative;
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 50%;
        margin-top: -50%;
        border: 6px solid var(--color-background);
    }


    .status-circle{
        position: absolute;
        background: green;
        bottom: 15px;
        right: 10px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--card-status-border);
    }

    .container .about {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .container .about h2 {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .container .about h2 i {
        color: #3d5afe;
    }

    .container .about p {
        font-size: 16px;
        color: var(--color-info);
    }

    .container .social-links {
        display: flex;
        gap: 16px;
    }

    .container .social-links a {
        background: var(--color-card-background);
        padding: 8px;
        display: flex;
        width: 48px;
        height: 48px;
        align-items: center;
        justify-content: center;
        border: 1px solid #eee;
        color: var(--navbar-icon-color);
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .container .social-links a i {
        font-size: 26px;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .container .social-links a:hover {
        border: 1px solid var(--primary-button--hover);
    }

    .container .social-links a:hover i {
        color: var(--primary-button--hover);
    }

    .container .tabs-container {
        overflow-x: auto;
        margin-bottom: 4px;
        width: 100%;
    }

    .container .tabs-container .tabs {
        position: relative;
        display: flex;
        border: 1px solid #ccc;
        border-radius: 8px;
        list-style: none;
    }

    .container .tabs-container .tabs li {
        z-index: 2;
    }

    .container .tabs-container .tabs li a {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--navbar-icon-color);
        min-width: 112px;
        outline: none;
        padding: 12px 16px;
        white-space: nowrap;
        transition: all 0.3s ease;
    }

    .container .tabs-container .tabs li a:hover,
    .container .tabs-container .tabs li a.active {
        color: var(--tab-link-hover);
    }

    .container .tabs-container #active-tab {
        position: absolute;
        width: 100%;
        width: 112px;
        height: 100%;
        background: var(--tab-active-color);
        z-index: 1;
        border-radius: 8px;
        transition: all 0.5s ease;
    }

    .container .tab-content {
        display: none;
        overflow-y: auto;
    }

    .container .active-tab-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        height: 100px;
        padding: 0 4px;
        font-size: 15px;
        margin-bottom: 16px;
        color: var(--color-info);
    }

    .container .tabs-container .tabs li:nth-child(1):has(.active)~#active-tab {
        transform: translateX(0);
    }

    .container .tabs-container .tabs li:nth-child(2):has(.active)~#active-tab {
        transform: translateX(112px);
    }

    .container .tabs-container .tabs li:nth-child(3):has(.active)~#active-tab {
        transform: translateX(224px);
    }

    .container .tab-content .vote {
        display: flex;
        flex-direction: column;
        margin-top: 1px;
        gap: 12px;
        padding: 8px 0;
    }

    .container .tab-content .vote a {
        display: flex;
        background: #fafafa;
        gap: 8px;
        border-radius: 5px;
        color: #757575;
        padding: 8px;
        border: 1px solid #eee;
        transition: all 0.3s ease;
    }

    .container .tab-content .vote a:hover {
        border: 1px solid #7e57c2;
        color: #7e57c2;
    }

    .container .tab-content .comments {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .container .tab-content .comments .comment {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 8px;
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 8px;
    }

    .container .tab-content .comments .comment h4 {
        margin-bottom: 5px;
    }

    .container .tab-content .comments .comment p {
        font-size: 13px;
    }

    .container .tab-content .comments .comment img {
        width: 48px;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 50%;
    }

    /*
    .container button {
        background-color: #3d5afe;
        color: #fff;
        padding: 10px 16px;
        border-radius: 8px;
        width: 100%;
        border: none;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .container button:hover {
        background-color: #304ffe;
    }*/
</style>