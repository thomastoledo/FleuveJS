import { http, map } from "../../bundle/observable.bundle.js";

const obs$ = http.get(
  "https://my-json-server.typicode.com/nugetchar/fleuvejsDb/users"
);

obs$.subscribe((res) => {
  users = res;
  resetDOMUserList(document.getElementById("results"));
  buildDOMUserList(document.getElementById("results"), users);
});

let users = [];

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
  const container = document.createElement("div");
  container.classList.add("user-container");
  container.setAttribute("id", user.id);

  const userDOM = document.createElement("div");
  userDOM.classList.add("user");
  userDOM.innerText = user.username;

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "X";
  deleteButton.addEventListener("click", () => {
    deleteUser(user);
  });

  container.append(userDOM, deleteButton);
  parent.appendChild(container);
}

function generateNewUser() {
  const username = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);

  const post$ = http.post(
    "https://my-json-server.typicode.com/nugetchar/fleuvejsDb/users",
    {
      type: "json",
      body: {
        username,
      },
    }
  );

  post$.pipe(map(({ id }) => ({ id, username }))).subscribe({
    next: (res) => {
      users.push(res);
      resetDOMUserList(document.getElementById("results"));
      buildDOMUserList(document.getElementById("results"), users);
    },
    error: (err) => console.error(err),
  });
}

function deleteUser(user) {
  const userDOM = document.getElementById(user.id);
  const delete$ = http.delete(
    `https://my-json-server.typicode.com/nugetchar/fleuvejsDb/users/${user.id}`,
  );
  delete$.subscribe({
    next: () => userDOM.remove(),
    error: (err) => console.log(`An error occured`, err) 
  });
}
