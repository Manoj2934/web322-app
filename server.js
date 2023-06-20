const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const path = require("path");
const {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostById,
  getPostsByCategory,
  getPostsByMinDate
} = require("./blog-service.js");

const app = express();

app.use(express.static("public"));

cloudinary.config({ 
  cloud_name: 'dyee1c4hb', 
  api_key: '413588338766645', 
  api_secret: 'dyXIekZDmtq-e8gP7qOCr2BceKg' 
});

const upload = multer();

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/blog", (req, res) => {
  getPublishedPosts()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/posts", (req, res) => {
  if (req.query.category) {
    getPostsByCategory(req.query.category)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
  }

  else if (req.query.minDate) {
    getPostsByMinDate(req.query.minDate)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
  }

  else {
    getAllPosts()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
  }
});

app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addPost.html"));
})

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    return result;
  }

  upload(req)
  .then((uploaded) => {
    req.body.featureImage = uploaded.url;
    let postObject = {};

    postObject.body = req.body.body;
    postObject.title = req.body.title;
    postObject.postDate = Date.now();
    postObject.category = req.body.category;
    postObject.featureImage = req.body.featureImage;
    postObject.published = req.body.published;
    
    if (postObject.title) {
      addPost(postObject);
    }
    res.redirect("/posts");
  })
  .catch((err) => {
    res.send(err);
  });
});

app.get("/post/:value", (req, res) => {
  getPostById(req.params.value)
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.send(err);
  });
})

app.get("/categories", (req, res) => {
  getCategories()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "notFoundPage.html"));
});

initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: http://localhost:" + HTTP_PORT);
  });
});