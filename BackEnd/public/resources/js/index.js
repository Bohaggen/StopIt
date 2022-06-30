/* eslint-disable */
import '@babel/polyfill';
import {login} from './login';

document.querySelector('.loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
  });