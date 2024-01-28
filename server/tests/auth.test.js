const {
    loginUser,
    createUser,
} = require("../controllers/authController");
const database = require("../database");
const User = require("../models/User");

beforeAll(async () => {
    // Connect to the database before running tests
    await database();
});

afterAll(async () => {
    // Delete users after each test
    await User.deleteOne({ email: "saketaryan@gmail.com"});
});

const createTestUser = async () => {
    await User.create({
        name: "Saket Aryan",
        email: "saketaryan@gmail.com",
        password: "123456",
    });
};

test("Create New User", async () => {
    // Arrange
    const req = {
        body: {
            name: "Saket Aryan",
            email: "saketaryan@gmail.com",
            password: "123456",
        },
    };
    const res = { json: jest.fn() };

    // Act
    await createUser(req, res);

    // Assert
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
        success: true,
        info: "Account Created Successfully!!",
    });
});

test("User already exists", async () => {
    // Arrange
    const req = {
        body: {
            name: "Saket Aryan",
            email: "saketaryan@gmail.com",
            password: "123456",
        },
    };
    const res = { json: jest.fn() };

    // Act
    await createUser(req, res);

    // Assert
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Email Address is already registered!"
    });
});

test("Login User", async () => {
    // Arrange
    const req = {
        body: {
            email: "saketaryan@gmail.com",
            password: "123456",
        },
    };
    const res = { json: jest.fn() };

    // Act
    await loginUser(req, res);

    // Assert
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
        success: true,
        info: "Login Success",
        token: expect.any(String),
    });
});

test("Login User with wrong credentials", async () => {
    // Arrange
    const req = {
        body: {
            email: "saketaryan@gmail.com",
            password: "123456123456",
        },
    };
    const res = { json: jest.fn() };

    // Act
    await loginUser(req, res);

    // Assert
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid Credentials!"
    });
});