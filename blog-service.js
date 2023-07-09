const fs = require('fs');
const path = require('path');

let posts = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'data', 'posts.json'), 'utf8', (err, postData) => {
      if (err) {
        reject('Unable to read posts file');
        return;
      }

      posts = JSON.parse(postData);

      fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, categoryData) => {
        if (err) {
          reject('Unable to read categories file');
          return;
        }

        categories = JSON.parse(categoryData);
        resolve();
      });
    });
  });
}

function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject('No posts found');
    } else {
      resolve(posts);
    }
  });
}

function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter(post => post.published === true);

    if (publishedPosts.length > 0) {
      resolve(publishedPosts);
    } else {
      reject('No published posts found');
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject('No categories found');
    } else {
      resolve(categories);
    }
  });
}

function getPostById(id) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter(post => post.id === id);
    const uniquePost = filteredPosts[0];

    if (uniquePost) {
      resolve(uniquePost);
    } else {
      reject('No post found with the specified ID');
    }
  });
}

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter(post => post.category === category);

    if (filteredPosts.length > 0) {
      resolve(filteredPosts);
    } else {
      reject('No posts found in the specified category');
    }
  });
}

function getPostsByMinDate(minDate) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter(post => new Date(post.postDate) >= new Date(minDate));

    if (filteredPosts.length > 0) {
      resolve(filteredPosts);
    } else {
      reject('No posts found after the specified date');
    }
  });
}

function addPost(postData) {
  return new Promise((resolve, reject) => {
    const newPost = {
      ...postData,
      published: postData.published === undefined ? false : true,
      id: posts.length + 1
    };

    posts.push(newPost);
    resolve(newPost);
  });
}

function getPublishedPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter(post => post.category === category && post.published === true);

    if (filteredPosts.length > 0) {
      resolve(filteredPosts);
    } else {
      reject('No published posts found in the specified category');
    }
  });
}

module.exports = { 
  initialize, 
  getAllPosts, 
  getPublishedPosts, 
  getCategories, 
  addPost, 
  getPostById,
  getPostsByCategory,
  getPostsByMinDate,
  getPublishedPostsByCategory
};
