<template>
<div class="wrapper">
    <header class="header ">
        <div id="primary" class="boxed-layout-header page-header header-small">
            <div class="container">
                <div class="row">
                    <div class="col-md-10 col-md-offset-1 text-center">
                        <h1 class="hestia-title">The Team</h1>
                    </div>
                </div>
            </div>

            <div data-parallax="active" class="header-filter"></div>
        </div>
    </header>
    <div class="main main-raised">
        <div class="blog-post ">
            <div class="container">
                <article class="section section-text">
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2 page-content-wrap">

                            <p>
                                <img class="aligncenter" :src="teamImage" alt="" width="710" height="474">
                            </p>
                            <h3>
                                <strong>Meet The Brandollo Team</strong>
                            </h3>

                            <p>Brandollo is lead by Brian McCarthy and Marco Muscat, both of whom are passionate about building simple solutions to traditionally complex problems. Together, Brian and Marco possess a powerful mix of technical and marketing expertise that has enabled them to develop the Brandollo platform.</p>

                            <h3>
                                <strong> Brian McCarthy - Founder & CEO</strong>
                            </h3>
                            <p>Brian is a strategic marketer with over 16 years experience in marketing and technology. Brian decided to create Brandollo when he noticed that small businesses regularly struggled to access the tailored marketing advice that they need. With previous experience building a B2B platform business, Brian set out to develop a new solution that would cut the cost of customised marketing support for small businesses. Brian has worked with over two hundred brands across both Europe and Australia and was previously the Director of a Melbourne marketing agency.
                            </p>


                            <h3>
                                <strong> Marco Muscat - Co-Founder & CTO</strong>
                            </h3>
                            <p>Marco is a full stack engineer specialising in Artificial Intelligence with a passion for employing machine learning to develop better solutions to everyday problems. This passion has been channeled into the development of Brandollo, creating an intelligent marketing solution for small businesses and Startups. Marco possess substantial experience in building and scaling web platforms and manages the Brandollo development team.
                            </p>

                            <p>
                                If you're interested in learning more about Brandollo
                                <router-link title="Beta invite" to="/Enquire?list=beta">click here</router-link> to receive your invitation to try the platform
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import teamImage from "../assets/img/the-team.png";
export default {
  name: "Learn-More",
  metaInfo: {
    title: "Team"
  },
  data() {
    return {
      teamImage: teamImage
    };
  }
};
</script>

<style scoped>
.header-filter {
  background-image: url("../assets/img/create-strategy-background.png");
}
</style>
