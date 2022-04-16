import {http, map} from '../../bundle/observable.bundle.js';

const obs$ = http.get('./test.json').pipe(map(({users}) => users));
obs$.subscribe((res) => {
    buildDOMUserList(document.getElementById('results'), res)
});

function buildDOMUserList(parent, users) {
    const userList = document.createElement('div');
    userList.classList.add('user-list');
    parent.appendChild(userList);

    users.forEach((user) => {
        buildDOMUser(userList, user);
    });
}

function buildDOMUser(parent, user) {
    const userDOM = document.createElement('div');
    userDOM.classList.add('user');
    userDOM.innerText = user.username;
    parent.appendChild(userDOM);
}