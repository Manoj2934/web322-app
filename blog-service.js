const fs = require('fs');
const path = require('path');

let posts = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    const postsFilePath = path.join(__dirname, 'data', 'posts.json');
    const categoriesFilePath = path.join(__dirname, 'data', 'categories.json');

    fs.readFile(postsFilePath, 'utf8', (err, postData) => {
      if (err) {
        reject('Unable to read posts file');
        return;
      }

      posts = JSON.parse(postData);

      fs.readFile(categoriesFilePath, 'utf8', (err, categoriesData) => {
        if (err) {
          reject('Unable to read categories file');
          return;
        }

        categories = JSON.parse(categoriesData);
        resolve();
      });
    });
  });
}

function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject('No posts available');
    } else {
      resolve(posts);
    }
  });
}

function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter(post => post.published);

    if (publishedPosts.length > 0) {
      resolve(publishedPosts);
    } else {
      reject('No published posts available');
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject('No categories available');
    } else {
      resolve(categories);
    }
  });
}

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories };
