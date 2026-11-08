"use strict";
const STORAGE = {clients:"socialdesk-clients",posts:"socialdesk-posts"};
function read(type){try{const value=JSON.parse(localStorage.getItem(STORAGE[type]));return Array.isArray(value)?value:[]}catch{return []}}
let clients=read("clients"), posts=read("posts"), editingId=null, editingType="post";
const $=id=>document.getElementById(id);
function persist(type){try{localStorage.setItem(STORAGE[type],JSON.stringify(type==="clients"?clients:posts))}catch{alert("Could not save to browser storage.")}}
function el(tag,text,className){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node}
function page(){const key=["home","clients","posts"].includes(location.hash.slice(1))?location.hash.slice(1):"home";document.querySelectorAll("[data-page]").forEach(node=>node.hidden=node.dataset.page!==key);document.querySelectorAll("[data-nav]").forEach(node=>{const active=node.dataset.nav===key;node.classList.toggle("active",active);if(active)node.setAttribute("aria-current","page");else node.removeAttribute("aria-current")});document.title=(key==="home"?"Create and Manage Posts":key==="clients"?"Clients":"Posts")+" — SocialDesk";window.scrollTo(0,0)}
function explanatory(container,lines){lines.forEach(([heading,body])=>{const p=el("p");p.append(el("strong",heading+" "),document.createTextNode(body));container.append(p)})}
function actionButton(label,onClick,kind){const button=el("button",label,kind||"");button.type="button";button.addEventListener("click",onClick);return button}
function render(){
  const c=$("clients-list"),p=$("posts-list");c.replaceChildren();p.replaceChildren();
  if(!clients.length)explanatory(c,[["Keep everything in one place.","Add your clients and organize their information with ease."],["Build better connections.","Give every client the attention their brand deserves."],["Stay organized.","Your client details are ready whenever you need them."]]);
  clients.forEach(item=>renderEntry(c,item,"client"));
  if(!posts.length)explanatory(p,[["Plan your next idea.","Turn your thoughts into meaningful social media content."],["Grow your brand online.","Keep your message clear and consistent across your accounts."],["Stay consistent.","Save your drafts and keep track of what comes next."]]);
  posts.forEach(item=>renderEntry(p,item,"post"));
}
function renderEntry(container,item,type){
 const row=el("div",undefined,"entry"),body=el("div",undefined,"entry-content"),actions=el("div",undefined,"entry-actions");
 body.append(el("strong",type==="client"?item.name:item.title));
 if(item.description)body.append(document.createTextNode(" — "+item.description));
 if(type==="post"){const owner=clients.find(x=>x.id===item.clientId);body.append(el("small",item.status+(owner?" · "+owner.name:"")))}
 actions.append(actionButton("Edit",()=>openDialog(type,item)),actionButton("Delete",()=>removeEntry(type,item.id),"delete"));row.append(body,actions);container.append(row)
}
function openDialog(type,item=null){
 editingType=type;editingId=item?.id??null;
 $("form-title").textContent=(item?"Edit ":"Create ")+(type==="client"?"Client":"Post");
 $("name-label").textContent=type==="client"?"Client name":"Post title";
 $("description-label").textContent=type==="client"?"Client details":"Post content";
 $("entry-name").value=item?.name??item?.title??"";
 $("entry-description").value=item?.description??"";
 $("post-fields").hidden=type==="client";
 const select=$("entry-client");select.replaceChildren(new Option("No client",""));
 clients.forEach(x=>select.add(new Option(x.name,x.id)));
 select.value=item?.clientId??"";
 $("entry-status").value=item?.status??"Draft";
 $("modal").hidden=false;document.body.style.overflow="hidden";$("entry-name").focus()
}
function closeDialog(){$("modal").hidden=true;document.body.style.overflow=""}
function removeEntry(type,id){if(!confirm("Delete this "+type+"?"))return;if(type==="client"){clients=clients.filter(x=>x.id!==id);posts=posts.map(x=>x.clientId===id?{...x,clientId:""}:x);persist("clients");persist("posts")}else{posts=posts.filter(x=>x.id!==id);persist("posts")}render()}
$("edit-form").addEventListener("submit",event=>{event.preventDefault();const text=$("entry-name").value.trim();if(!text)return;const entry=editingType==="client"?{id:editingId??crypto.randomUUID(),name:text,description:$("entry-description").value.trim()}:{id:editingId??crypto.randomUUID(),title:text,description:$("entry-description").value.trim(),clientId:$("entry-client").value,status:$("entry-status").value};if(editingType==="client"){clients=editingId?clients.map(x=>x.id===editingId?entry:x):[...clients,entry];persist("clients")}else{posts=editingId?posts.map(x=>x.id===editingId?entry:x):[...posts,entry];persist("posts")}render();closeDialog()});
document.querySelectorAll('[data-action="new-post"]').forEach(b=>b.addEventListener("click",()=>openDialog("post")));
document.querySelectorAll('[data-action="new-client"]').forEach(b=>b.addEventListener("click",()=>openDialog("client")));
$("close").addEventListener("click",closeDialog);$("modal").addEventListener("mousedown",e=>{if(e.target===$("modal"))closeDialog()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("modal").hidden)closeDialog()});window.addEventListener("hashchange",page);render();page();