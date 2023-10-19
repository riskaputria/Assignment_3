const request = require("supertest");
const app = require("../app");
const { Photo, User } = require("../models");
// const { createUser, destroyUser, destroyAllPhotos } = require("../controllers");
// const { generateToken } = require("../utils/jwt");

const dataUser = {
  username: "riska",
  email: "riska@mail.com",
  password: "riska2206",
};

// test untuk API register
describe("POST /users/register", () => {
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });

  it("Should be response 201", (done) => {
    request(app)
      .post("/users/register")
      .send(dataUser)
      .expect(201)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("username");
        expect(res.body).toHaveProperty("email");
        expect(res.body.email).toEqual("riska@mail.com");
        done();
      });
  });
});

describe("POST /photos/login", () => {
  beforeAll(async () => {
    try {
      await User.create(dataUser);
    } catch (error) {
      console.log(error);
    }
  });

  it("Should be response 200", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: dataUser.email,
        password: dataUser.password,
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toEqual("string");
        done();
      });
  });

  it("Should be response 401", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: dataUser.email,
        password: "salahpassword",
      })
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Incorrect password!");
        done();
      });
  });

  afterAll(async () => {
    try {
      await Photo.destroy({ where: {} }), await User.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

//Add Photos
describe("Add Photo", () => {
  let title;
  let caption;
  let image_url;
  let token;

  beforeAll(async () => {
    title = " image1";
    caption = "Caption 1";
    image_url = "http://example.com/image.jpg";

    userData = { id: 10 };

    try {
      await User.create(dataUser);
    } catch (error) {
      console.log(error);
    }
  });

  it("Should be response 200", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: dataUser.email,
        password: dataUser.password,
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toEqual("string");
        token = res.body.token;
        done();
      });
  });

  it("Should be response 200", (done) => {
    request(app)
      .post("/photos")
      .set("Authorization", token)
      .send({
        title,
        caption,
        image_url,
      })
      .expect(201)
      .end((err, res) => {
        done(err ?? undefined);
      });
  });

  it("Should be response 401", (done) => {
    request(app)
      .post("/photos")
      .send({
        title,
        caption,
        image_url,
      })
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Token not provided!");
        done();
      });
  }, 10000);
});

//get All Photos
describe("GET /photos", () => {
  beforeAll(async () => {
    try {
      await User.create(dataUser);
    } catch (err) {
      console.log(err);
    }
  });
  it("Should be response 200", (done) => {
    request(app)
      .post("/users/login")
      .send({
        username: dataUser.username,
        email: dataUser.email,
        password: dataUser.password,
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toEqual("string");
        token = res.body.token;
        done();
      });
  });
  it("Should be response 200", (done) => {
    request(app)
      .get("/photos")
      .set("Authorization", token)
      .expect(200)
      .end((err, res) => {
        done(err);
      });
  });

  it("Should be response 401", (done) => {
    request(app)
      .get("/photos")
      .expect(401)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Token not provided!");
        done();
      });
  });
  afterAll(async () => {
    try {
      await Photo.destroy({ where: {} }), await User.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

//Get Photo By Id
describe("GET /photos/:id", () => {
  beforeAll(async () => {
    title = " image1";
    caption = "Caption 1";
    image_url = "http://example.com/image.jpg";

    try {
      await User.create(dataUser);
    } catch (err) {
      console.log(err);
    }
  });
  it("Should be response 200", (done) => {
    request(app)
      .post("/users/login")
      .send({
        username: dataUser.username,
        email: dataUser.email,
        password: dataUser.password,
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toEqual("string");
        token = res.body.token;
        done();
      });
  });
  it("Should be response 200", (done) => {
    request(app)
      .post("/photos")
      .set("Authorization", token)
      .send({
        title,
        caption,
        image_url,
      })
      .expect(201)
      .end((err, res) => {
        if (err) done(err);
        id = res.body.id;
        done();
      });
  });
  it("Should be response 200", (done) => {
    request(app)
      .get(`/photos/${id}`)
      .set("Authorization", token)
      .expect(200)
      .end((err, res) => {
        done(err);
      });
  });
  it("Should be response 404", (done) => {
    request(app)
      .get("/photos/22")
      .set("Authorization", token)
      .expect(404)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Data not found!");
        done();
      });
  });
  afterAll(async () => {
    try {
      await Photo.destroy({ where: {} }), await User.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});
