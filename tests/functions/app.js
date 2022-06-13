import { map, mutable, tap } from "../../bundle/observable.bundle.js";

const contactList$ = mutable([
  {
    firstname: "John",
    lastname: "DOE",
    phone: "+33 7 00 00 00 00",
  },
  {
    firstname: "Armand",
    lastname: "LOISELIER",
    phone: "+33 6 00 00 00 00",
  },
]);

contactList$.subscribe(buildContactList);

function buildContactList(contactList) {
    const contactListBody = document.querySelector(".contact-list__body");
    contactListBody.innerHTML = "";
    contactList.forEach((contact) => {
      const contactDivList = buildContactListEntry(contact);
      contactListBody.append(...contactDivList);
    });
}

function buildContactListEntry(contact) {
  // On crée la div pour le prénom
  const firstnameDiv = document.createElement("div");
  const firstnameP = document.createElement("p");
  firstnameDiv.appendChild(firstnameP);
  firstnameP.innerText = contact.firstname;

  // On crée la div pour le lastname
  const lastnameDiv = document.createElement("div");
  const lastnameP = document.createElement("p");
  lastnameDiv.appendChild(lastnameP);
  lastnameP.innerText = contact.lastname;

  // On crée la div pour le numéro de téléphone
  const phoneDiv = document.createElement("div");
  const phoneP = document.createElement("p");
  phoneDiv.appendChild(phoneP);
  phoneP.innerText = contact.phone;
  phoneDiv.classList.add("tel");

  // On crée la div pour l'icône de suppression
  const deleteDiv = document.createElement("div");
  const deleteButton = document.createElement("button");
  const deleteSpan = document.createElement("span");
  deleteDiv.appendChild(deleteButton);
  deleteButton.appendChild(deleteSpan);
  deleteSpan.innerText = "delete";
  deleteDiv.classList.add("delete");
  deleteSpan.classList.add("material-icons");

  deleteButton.addEventListener("click", () => {
    const resultat = window.confirm(
      "Voulez-vous vraiment supprimer ce contact ?"
    );
    if (resultat) {
      firstnameDiv.remove();
      lastnameDiv.remove();
      phoneDiv.remove();
      deleteDiv.remove();
    }
  });

  return [firstnameDiv, lastnameDiv, phoneDiv, deleteDiv];
}

const searchBar = document.getElementById("searchBar");

searchBar.addEventListener("input", () => {

  const term = searchBar.value.toLowerCase();

  contactList$.pipe(
      map((contactList) => contactList.filter((contact) =>  `${contact.firstname}${contact.lastname}${contact.phone}`.toLowerCase().includes(term))),
      tap((filteredList) => {
        filteredList.forEach((contact) => {
              const contactDivList = buildContactListEntry(contact);
              const contactListBody = document.querySelector(".contact-list__body");
              contactListBody.append(...contactDivList);
          })
      }));
});

const addContactBtn = document.getElementById("addContactBtn");
addContactBtn.addEventListener("click", () => {
  const createContact = document.querySelector(".create-contact");
  createContact.classList.toggle("hidden");
});

const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
  const createContact = document.querySelector(".create-contact");
  createContact.classList.toggle("hidden");
});

const addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const firstnameInput = document.getElementById("firstnameInput");
  const lastnameInput = document.getElementById("lastnameInput");
  const phoneInput = document.getElementById("phoneInput");

  const firstname = firstnameInput.value;
  const lastname = lastnameInput.value;
  const phone = phoneInput.value;

  const contact = {
    firstname,
    lastname,
    phone,
  };

  contactList$.compile(map((contactList) => [...contactList, contact]));

  const createContact = document.querySelector(".create-contact");
  createContact.classList.toggle("hidden");
});
