import{a as u}from"./assets/vendor-9129e3ca.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();const l=document.querySelector("form"),f=document.querySelector(".gallery");document.querySelector(".form-input");l.addEventListener("submit",m);let a="",i=1;const d=15;async function m(o){o.preventDefault(),a=o.target.elements.search.value.trim(),i=1,f.innerHTML="";const r=await p();console.log(r)}async function p(){const r=`https://pixabay.com/api/?${new URLSearchParams({key:"42306918-f68a47ae9b20261d6e2f05069",q:`${a}`,image_type:"photo",orientation:"horizontal",safesearch:"true",page:i,per_page:d})}`;return(await u.get(r)).data}
//# sourceMappingURL=commonHelpers.js.map