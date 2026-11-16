// Google Analytics 4 (Firebase project qronostasis, web app "QRonostasis Web").
// Loaded from every page by an absolute path, since 404.html is served at any URL.
const GA_ID = "G-MF4L7HVYPQ";
const tag = document.createElement("script");
tag.async = true;
tag.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
document.head.append(tag);
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", GA_ID);
