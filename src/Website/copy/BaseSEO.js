
// These are defaults for the website, you can override these by adding the same property in the page specific counterparts. 


import logoImg from "@/Website/assets/img/Brandollo-logo.png";

//Title used by facebook and twitter
const metaTitle = "Brandollo - The Growth Platform For Startups";

// Default Description 
const metaDescription =
  "Base-The growth platform for Startups. Get powerful growth software and marketing plans, learn Startup fundraising strategies, Startup sales skills and much more";

const metaImage = logoImg;

export default {
  title: "Home",
  titleTemplate: "%s | Brandollo, Startup Growth Software",
  meta: [
    {
      vmid: "description",
      name: "description",
      content: metaDescription
    },
    // ------------ Facebook ------------
    {
      vmid: "og:description",
      property: "og:description",
      content: metaDescription
    },
    {
      vmid: "og:locale",
      property: "og:locale",
      content: "en_US"
    },
    {
      vmid: "og:type",
      property: "og:type",
      content: "website"
    },
    {
      vmid: "og:title",
      property: "og:title",
      content: metaTitle
    },
    {
      vmid: "og:site_name",
      property: "og:site_name",
      content: "Brandollo"
    },
    {
      vmid: "og:image",
      property: "og:image",
      content: metaImage
    },
    {
      vmid: "og:image:alt",
      property: "og:image:alt",
      content: ""
    },
    {
      vmid: "fb:app_id",
      property: "fb:app_id",
      content: "275176163252348"
    },
    // ------------ Twitter ------------
    {
      vmid: "twitter:description",
      name: "twitter:description",
      content: metaDescription
    },
    {
      vmid: "twitter:title",
      name: "twitter:title",
      content: metaTitle
    },
    {
      vmid: "twitter:image",
      name: "twitter:image",
      content: metaImage
    },
    {
      vmid: "twitter:card",
      name: "twitter:card",
      content: "summary"
    },
    {
      vmid: "twitter:site",
      name: "twitter:site",
      content: "@BrandolloDotCom"
    },
    {
      vmid: "twitter:creator",
      name: "twitter:creator",
      content: "@BrandolloDotCom"
    }
  ]
}