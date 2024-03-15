<script lang="ts">

</script>

<div class="widgets-container">
    <!--
    <h1 class="heading">Zoznam aplikácií</h1>
    -->

    <div class="box-container">
        <div class="box">
            <i class='bx bxs-school'></i>
            <h3>STUDENT PORTAL</h3>
            <p>Prehľad známok, účasť na cvičeniach, miesta odovzdania, termíny skúšok. Všetko dôležité na jednom mieste.</p>
            <a href="#" class="btn">SPUSTIŤ</a>
        </div>

        <div class="box">
            <i class='bx bxs-network-chart'></i>
            <h3>CONNECTIONS</h3>
            <p>Vyhľadajte kohokoľvek na FEIke. Súkromné správy, hromadné informácie v skupinových chatoch.</p>
            <a href="#" class="btn">SPUSTIŤ</a>
        </div>

        <div class="box">
            <i class='bx bxs-chess'></i>
            <h3>CHESS</h3>
            <p>Chceš si zahrať šach so spolužiakmi alebo prednášajúcimi? Na tomto mieste, iba proti FEIkárom. </p>
            <a href="#" class="btn">SPUSTIŤ</a>
        </div>
    </div>
</div>


<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap');


    *{
        outline: none;
        border: none;
        text-decoration: none;
        transition: .2s linear;
    }

    .widgets-container {
        background: white;
        padding: 15px 9%;
        padding-bottom: 100px;
    }

    .widgets-container .heading {
        text-align: center;
        padding-bottom: 15px;
        color: #000;
        font-size: 25px;
    }

    .widgets-container .box-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        gap: 15px;
        margin-top: 150px;
    }

    .widgets-container .box-container .box {
        box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
        border-radius: 8px;
        background: #fff;
        text-align: center;
        padding: 30px 20px;
    }

    .widgets-container .box-container .box i{
        font-size: 50px;
    }

    .widgets-container .box-container .box h3 {
        color: #0039A6;
        font-size: 22px;
        padding: 10px 0;
    }

    .widgets-container .box-container .box p {
        color: #777;
        font-size: 15px;
        line-height: 1.8;
    }

    .widgets-container .box-container .box .btn {
        margin-top: 10px;
        display: inline-block;
        background: #0039A6;
        color: #fff;
        font-size: 17px;
        border-radius: 8px;
        padding: 8px 25px;
    }


    .widgets-container .box-container .box:hover {
        box-shadow: 0 10px 15px rgba(0, 0, 0, .3);
        transform: scale(1.05);
        background: radial-gradient(circle, rgba(237, 237, 237, 0.7) 2px, #fafafa 0px);
        background-size: 10px 10px;
    }

    .widgets-container .box-container .box .btn:hover {
        letter-spacing: 1px;
        background: #3160b8;
    }
</style>