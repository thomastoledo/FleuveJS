import { http, map, switchMap } from "../../bundle/observable.bundle.js";

const obs$ = http
  .get("https://my-json-server.typicode.com/nugetchar/fleuvejsDb/users");

  obs$.subscribe((res) => {
    users = res;
    resetDOMUserList(document.getElementById("results"));
    buildDOMUserList(document.getElementById("results"), users);
  });

const users = [];

const generateBtn = document.getElementById("generateBtn");
generateBtn.addEventListener("click", generateNewUser);


function resetDOMUserList(list) {
  list.innerHTML = "";
}

function buildDOMUserList(parent, users) {
  const userList = document.createElement("div");
  userList.classList.add("user-list");
  parent.appendChild(userList);

  users.forEach((user) => {
    buildDOMUser(userList, user);
  });
}

function buildDOMUser(parent, user) {
  const userDOM = document.createElement("div");
  userDOM.classList.add("user");
  userDOM.innerText = user.username;
  parent.appendChild(userDOM);
}

function generateNewUser() {
  const username = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);

  const post$ = http.post(
    "https://my-json-server.typicode.com/nugetchar/fleuvejsDb/users",
    "json",
    {
      body: {
        username,
      },
    }
  );

  const sub = post$.pipe(map(({id}) => [...users, {id, username}])).subscribe({
    next: (res) => {
        users = res;
        resetDOMUserList(document.getElementById("results"));
        buildDOMUserList(document.getElementById("results"), users);
    },
    error: (err) => console.error(err),
  });
  sub.unsubscribe();
}
