
const generateQuizID = () => {
    let quizID = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
        quizID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return quizID;
}

module.exports = generateQuizID;