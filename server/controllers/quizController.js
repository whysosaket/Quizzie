const dotenv = require("dotenv");
dotenv.config();

const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const User = require("../models/User");
const QuizResult = require("../models/QuizResult");

const convertToTitleCase = require("../utils/makeTitleCase");
const generateQuizID = require("../utils/generateQuizID");
const isValidEmail = require("../utils/isValidEmail");

const delimeter = "@1&2^";

const createQuiz = async (req, res) => {
  let success = false;

  let user = req.user;

  let { name, type, questions } = req.body;
  name = name.toString().toLowerCase();
  type = type.toString().toLowerCase();

  try {
    user = await User.findOne({ _id: user.id });
    if (!user) {
      return res.json({ success, error: "User Not Found!" });
    }

    // get user quiz with same name
    let testquiz = await Quiz.findOne({
      name: convertToTitleCase(name),
      user: user._id,
    });
    if (testquiz) {
      return res.json({
        success,
        error: "You already have a Quiz with this name!",
      });
    }

    // if (questions.length > 5) {
    //   return res.json({
    //     success,
    //     error: "Quiz can have at most 5 questions!",
    //   });
    // }

    if (name.length < 3) {
      return res.json({
        success,
        error: "Quiz Name must be at least 3 characters long!",
      });
    }

    name = convertToTitleCase(name);

    if (type !== "qna" && type !== "poll") {
      return res.json({
        success,
        error: "Quiz Type can only be QnA or Poll!",
      });
    }

    if (questions.length < 1) {
      return res.json({
        success,
        error: "Quiz must have at least 1 question!",
      });
    }

    // generating Quiz ID
    let quizID = generateQuizID();
    // checking if Quiz ID already exists
    let quizidtest = await Quiz.findOne({ quizID: quizID });
    while (quizidtest) {
      quizID = generateQuizID();
      quizidtest = await Quiz.findOne({ quizID: quizID });
    }

    // Validating each Question
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let {
        question: questionText,
        optionType,
        correctAnswer,
        options,
        imageOptions,
      } = question;
      if (questionText.length < 4) {
        return res.json({
          success,
          error: `Question ${i + 1} must be at least 4 characters long!`,
        });
      }

      // timer validation
      if (question.timer) {
        if (
          question.timer !== 30 &&
          question.timer !== 90 &&
          question.timer !== 60
        ) {
          return res.json({
            success,
            error: `Question ${i + 1} Timer can only be 30, 90 or 60!`,
          });
        }
      }

      if (
        optionType !== "text" &&
        optionType !== "img" &&
        optionType !== "both"
      ) {
        return res.json({
          success,
          error: `Question ${i + 1} Option Type can only be Text, Image, Both!`,
        });
      }
      if (options.length < 2) {
        return res.json({
          success,
          error: `Question ${i + 1} must have at least 2 options!`,
        });
      }

      // Validating each Option

      for (let j = 0; j < options.length; j++) {
        let option = options[j];
        if (option === null) continue;
        if (option.length < 1) {
          return res.json({
            success,
            error: `Question ${i + 1} Option ${
              j + 1
            } must be at least 1 character long!`,
          });
        }
      }

      // Validating each Image Option

      for (let j = 0; j < imageOptions.length; j++) {
        let option = imageOptions[j];
        if (option === null) continue;
        if (option.length < 1) {
          return res.json({
            success,
            error: `Question ${i + 1} Option ${
              j + 1
            } must be at least 1 character long!`,
          });
        }
      }

      // Validating correct Answer
      if (optionType === "text" || optionType === "both") {
        if (type === "poll") {
          correctAnswer = "NA";
        } else if (correctAnswer.length < 1) {
          return res.json({
            success,
            error: `Question ${
              i + 1
            } Correct Answer must be at least 1 character long!`,
          });
        }
      }

      if (optionType === "img" || optionType === "both") {
        if (type === "poll") {
          correctAnswer = "NA";
        } else if (correctAnswer.length < 1) {
          return res.json({
            success,
            error: `Question ${
              i + 1
            } Correct Answer must be at least 1 character long!`,
          });
        }
      }
    }

    let finalQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let {
        question: questionText,
        optionType,
        correctAnswer,
        options,
        imageOptions,
        timer,
      } = question;

      if (type === "poll") {
        correctAnswer = "NA";
      }

      let newQuestion = await Question.create({
        question: questionText,
        optionType,
        quiz: quizID,
        correctAnswer,
        options,
        imageOptions,
        type,
        timer,
      });

      finalQuestions.push(newQuestion._id);
    }

    const newQuiz = await Quiz.create({
      name,
      type,
      questions: finalQuestions,
      quizID,
      user: user._id,
    });

    user.quizCreated = user.quizCreated + 1;
    user.questionsCreated = user.questionsCreated + questions.length;
    await user.save();

    success = true;
    return res.json({
      success,
      info: "Quiz Created Successfully!!",
      quizID: newQuiz.quizID,
    });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const check_attempt = async (req, res) => {
  const { email, regNo } = req.query;
  if (regNo == "") {
    return res.json({
      success: true,
      message: "Enter a valid registration number.",
    });
  }
  const emailSet1 = new Set([
    "abhishekbehera4146@gmail.com",
    "armandwibedy2005@gmail.com",
    "bhabani.sankar2004.m@gmail.com",
    "kuldipshondik@gmail.com",
    "shoaibkhankps007@gmail.com",
    "ranjanghadia6@gmail.com",
    "sahooamitesh3@gmail.com",
    "127.aayushi@gmail.com",
    "ashikakumari1401jsr@gmail.com",
    "tusharkumar4070@gmail.com",
    "rohangawn2005@gmail.com",
    "prachujya8800@gmail.com",
    "adityadhal3@gmail.com",
    "umangourav@gmail.com",
    "yasrajpanda@gmail.com",
    "dibyajyotid153@gmail.com",
    "pranoydeb99@gmail.com",
    "sauravchoudhary8789@gmail.com",
    "ayushmanpalei01@gmail.com",
    "arupb4531@gmail.com",
    "kusumgorain41@gmail.com",
    "vishalmain1714@gmail.com",
    "adityaojha020@gmail.com",
    "divyanshurnc19@gmail.com",
    "ranjankumarravi216@gmail.com",
    "anushkabera93@gmail.com",
    "ajayghos111@gmail.com",
    "satyajit6825@gmail.com",
    "ayeshazareen2405@gmail.com",
    "shrivastavsahil274@gmail.com",
    "swastikmohapatra2005@gmail.com",
    "sandeeppanigrahi730@gmail.com",
    "zayed.khan0205@gmail.com",
    "arpitamishra30062005@gmail.com",
    "pandeygomal139@gmail.com",
    "someeranmahata@gmail.com",
    "azizjalaluddin786@gmail.com",
    "soumyaranjansahoo94383@gmail.com",
    "priyadarshinia25@gmail.com",
    "omkar.sarangi@yahoo.in",
    "adweta.acharya1544@gmail.com",
    "ankankumarpanja42@gmail.com",
    "sriyabose2006@gmail.com",
    "sechandra23@gmail.com",
    "snehasamal2004@gmail.com",
    "sakshipriya806@gmail.com",
    "aditipriya2525@gmail.com",
    "saswatbarai611@gmail.com",
    "sandeepcvraman418@gmail.com",
    "saummyaswaroop@gmail.com",
    "saibackupid33@gmail.com",
    "jyotiranjanbehera778@gmail.com",
    "adityakumarshyam23092006@gmail.com",
    "hideshjha308@gmail.com",
    "vaastav.04@gmail.com",
    "dasjsr2005ankit@gmail.com",
    "dibyadishadwibedi@gmail.com",
    "aumaarnabh@gmail.com",
    "shubhamswaroopbarik@gmail.com",
    "subhamjenaofficial19@gmail.com",
    "adyashamohanty2014@gmail.com",
    "amlanamrutansu@gmail.com",
    "riteshsahoo2005@gmail.com",
    "abhishek9852815692@gmail.com",
    "chsiddharthrao@gmail.com",
    "pattanaiksmrutiranjan1@gmail.com",
    "nandiniburnwal9a20@gmail.com",
    "abhisekroutray50@gmail.com",
    "gauravchaturvedi727@gmail.com",
    "satyajitdas56802@gmail.com",
    "soumyadilla@gmail.com",
    "soumyaparida006@gmail.com",
    "eshaneshan.159@gmail.com",
    "priyanshrout106@gmail.com",
    "SHIKHARSANAT@GMAIL.COM",
    "hotayash102904@gmail.com",
    "deeppaira45@gmail.com",
    "dhananjaypattnaik@gmail.com",
    "patroamit8@gmail.com",
    "uditranjankumar11705@gmail.com",
    "prasoonsinghrajput2004@gmail.com",
    "akashck904@gmail.com",
    "sdashsuva@gmail.com",
    "somyaranjansahoo0008@gmail.com",
    "singh.sarthaka2006@gmail.com",
    "adityaprasadpatra020@gmail.com",
    "rishabh24273239pandey@gmail.com",
    "abhilashpadhan2005@gmail.com",
    "vantecupcakes@gmail.com",
    "mitalipanda406@gmail.com",
    "piyushranjanpanda42@gmail.com",
    "Sharma.shreyansh82929@gmail.com",
    "anubhavnayakrocky05@gmail.com",
    "sahoosubrat034@gmail.com",
    "satyamvatsa4470@gmail.com",
    "subhasreepadhy2007@gmail.com",
    "swagatranjansahu88@gmail.com",
    "adityakumarora2005@gmail.com",
    "mukteswargochhayat3119@gmail.com",
    "yoanimesh35@gmail.com",
    "shivam47454745@gmail.com",
    "ayeshaavipsa2005@gmail.com",
    "soniharshit0031@gmail.com",
    "ashribadsingh31@gmail.com",
    "anshumanbarik13@gmail.com",
    "naikharshita70@gmail.com",
    "tapantarun6@gmail.com",
    "ommy200522@gmail.com",
    "deepakdevanand2006@gmail.com",
    "amitbabulart1636@gmail.com",
    "pandajagatjit2003@gmail.com",
    "ranjankumarkhatua2006@gmail.com",
    "adityagunni1008@gmail.com",
    "ankitamohapatra2006@gmail.com",
    "vedant4sh@gmail.com",
    "anubhavdixit7034@gmail.com",
    "harshitshahdeo99@gmail.com",
    "soumyaranjan1607@gmail.com",
    "anuradhagajendra84@gmail.com",
    "debarajdutta36@gmail.com",
    "seronsenapati@gmail.com",
    "soumik4as@gmail.com",
    "ashirwadguru20@gmail.com",
    "adyashar.305@gmail.com",
    "chandashruti76@gmail.com",
    "snehasahu9937@gmail.com",
    "subham68549@gmail.com",
    "rm002327@gmail.com",
    "adityapruseth1719@gmail.com",
    "chandanparida3005@gmail.com",
    "satyasarthak123@gmail.com",
    "shiprapriyadarshini1@gmail.com",
    "subham120306@gmail.com",
    "ragibwaquarkhan@gmail.com",
    "apispam9@gmail.com",
    "tanzeelataskeen22@gmail.com",
    "sumitswain97296@gmail.com",
    "harsh.singh5722@gmail.com",
    "dibyasasahoo80@gmail.com",
    "anuragsenapati47@gmail.com",
    "shubhoshreemukherjee98@gmail.com",
    "pratabidya04@gmail.com",
    "shivam1149og@gmail.com",
    "kiranmaymandal7@gmail.com",
    "monishkaag2801@gmail.com",
    "aditiagarwal380@gmail.com",
    "anupamparida48@gmail.com",
    "joy.bhadra1234@gmail.com",
    "arpitapadhy06@gmail.com",
    "dgpbrishti@gmail.com",
    "tejaswinib398@gmail.com",
    "shubhrangi15@gmail.com",
    "jaydevdas110@gmail.com",
    "barunkumarmandal4662@gmail.com",
    "nikhilnkj27@gmail.com",
    "priyapatrar15@gmail.com",
    "sovanrout66@gmail.com",
    "rudrasahoo33142@gmail.com",
    "anjalikumari09092005@gmail.com",
    "mridhul.anj005@gmail.com",
    "beherasanchita628@gmail.com",
    "nihitaburnwal02@gmail.com",
    "sk4903105@gmail.com",
    "nandaharssita@gmail.com",
    "ishamohini05@gmail.com",
    "roshan95084@gmail.com",
    "jayitamandal1245@gmail.com",
    "mohanty.punya07@gmail.com",
    "theganesh2006@gmail.com",
    "prarthanaparida.1211@gmail.com",
    "edworked2005@gmail.com",
    "anweshadutta9876@gmail.com",
    "divyadarshanbarika7@gmail.com",
    "utkarsh.raj.singh.10@gmail.com",
    "princepatra9951@gmail.com",
    "nilayaraj05@gmail.com",
    "jenaaryan918@gmail.com",
    "sandipmandal7138@gmail.com",
    "arpitapadhi003@gmail.com",
    "theharshkaushal021@gmail.com",
    "riteshnayak040@gmail.com",
    "saitpuspakbiswal@gmail.com",
    "jyotibehera430@gmail.com",
    "biswalsubhransu56@gmail.com",
    "nayak.subham2426@gmail.com",
    "sovam539@gmail.com",
    "mmanhar10@gmail.com",
    "himadrisekhardas1234@gmail.com",
    "myselfadisingh0511@gmail.com",
    "shaswatsubudhi322@gmail.com",
    "mohapatrasahil32@gmail.com",
    "paramanandam282@gmail.com",
    "adarshlenka80@gmail.com",
    "riyasinghjsr2410@gmail.com",
    "ronitadhikary14@gmail.com",
    "dibyajyotipal21@gmail.com",
    "soumyaranjan654m@gmail.com",
    "deepkumar84921@gmail.com",
    "adityaisvirat18@gmail.com",
    "subhsubham05@gmail.com",
    "gopigorain2018@gmail.com",
    "dhananjaykrdas123@gmail.com",
    "tejaswarlenka@gmail.com",
    "simransubhadarsini63@gmail.com",
    "ojharanjeet444@gmail.com",
    "priyanshupriyadarshi55@gmail.com",
    "aaradhyaprasad7@gmail.com",
    "sangyashivranjani@gmail.com",
    "gsourangshu05@gmail.com",
    "sampadkumarmohanty301@gmail.com",
    "harshvardhantilakchandi@gmail.com",
    "mohitmohanta1144@gmail.com",
    "ojaswisingh00@gmail.com",
    "codingforme.prodigy@gmail.com",
    "chikunsahoo1980@gmail.com",
    "omjena57@gmail.com",
    "sanyachauhan453@gmail.com",
    "shrutishreyapatra646@gmail.com",
    "devpriyostudent@gmail.com",
    "nancygupta524@gmail.com",
    "sampadabiswal029@gmail.com",
    "atharvpatole04@gmail.com",
    "pratyashasahoo02@gmail.com",
    "siddhantagrawal678@gmail.com",
    "satyakam26@gmail.com",
    "jenapratyush572@gmail.com",
    "hardikshekhawat658@gmail.com",
    "bhoomi1818@gmail.com",
    "mastershivraj05@gmail.com",
    "02vivekkumar2005@gmail.com",
    "hiiguys2222@gmail.com",
    "pousalidolai59@gmail.com",
    "1009rohitkumar@gmail.com",
    "shitalanshun@gmail.com",
    "tushardavnit@gmail.com",
    "rasmiranjan9675@gmail.com",
    "jhakumarrahul452@gmail.com",
    "nirfaaabut@gmail.com",
    "ayushraj2132006@gmail.com",
    "somayaranjanr86@gmail.com",
    "itsaditi0907@gmail.com",
    "devpriyadash@gmail.com",
    "mustafap9950@gmail.com",
    "harishchandramohapatra1@gmail.com",
    "ajshc01@gmail.com",
    "ashribadj0037@gmail.com",
    "mohapatragourav010@gmail.com",
    "dikhyantsatpathy@gmail.com",
    "pradhanrudramadhab8@gmail.com",
    "khwahish030405@gmail.com",
    "energeticjeetu143@gmail.com",
    "rishu271raj@gmail.com",
    "prakhardwivedi090@gmail.com",
    "sauravsharmabwn10@gmail.com",
    "prathamchatterjee2020@gmail.com",
    "heyitspratikshya@gmail.com",
    "dasrudrajit6@gmail.com",
    "abhinashsahoo6370@gmail.com",
    "manibhushan47075@gmail.com",
    "riteshkhandait1986@gmail.com",
    "shivamshuklaa2200@gmail.com",
    "dibyasahoo3535@gmail.com",
    "skandway127@gmail.com",
    "shreyashsivaditya2018@gmail.com",
    "acharyrohan901@gmail.com",
    "singh.ritika2111@gmail.com",
    "piyushbehera2006@gmail.com",
    "dibyaranjanpattanayak3@gmail.com",
    "rakshit200686@gmail.com",
    "kumarianushkarim777@gmail.com",
    "vikashkmrsaha24@gmail.com",
    "padmajapattanaik21@gmail.com",
    "aniketkr.official9@gmail.com",
    "riyamahatokatrs@gmail.com",
    "aditirj005@gmail.com",
    "hardikpanda2020@gmail.com",
    "nitishkumr4812@gmail.com",
    "sonakhipadhy123@gmail.com",
    "krutika6010@gmail.com",
    "susrisangita208@gmail.com",
    "sjagat222@gmail.com",
    "sahooshradha2007@gmail.com",
    "suryamohanty112@gmail.com",
    "priyankapriyadarshini091@gmail.com",
    "subhasmita.samal29@gmail.com",
    "anuragdash195@gmail.com",
    "niladrizxc890@gmail.com",
    "babita.bp.0@gmail.com",
    "subadeep.c@gmail.com",
    "sharmasonali1916@gmail.com",
    "niharikabehera2006@gmail.com",
    "dasanushka272006@gmail.com",
    "srijonisonu@gmail.com",
    "sahilsingh34567z@gmail.com",
    "alokgupta192837@gmail.com",
    "aditisingh6841@gmail.com",
    "ankitapatra1025@gmail.com",
    "sahilgagrai2803@gmail.com",
    "snehalomas@gmail.com",
    "singh9rinku@gmail.com",
    "suvromohanta10@gmail.com",
    "aniket110319@gmail.com",
    "kumarsujal1340@gmail.com",
    "gargimohapatra123@gmail.com",
    "semabmahboob123@gmail.com",
    "amitkumarmaity78738@gmail.com",
    "pritamprayasbehera@gmail.com",
    "deepdutta9234@gmail.com",
    "mithileshdas61@gmail.com",
    "faizanfayaz2902@gmail.com",
    "danianafis123@gmail.com",
    "sanutata382@gmail.com",
    "ranachaitanya556@gmail.com",
    "roshannn0620@gmail.com",
    "suvampradhan933@gmail.com",
    "adityanarayanmishra2005@gmail.com",
    "ronitrishi05@gmail.com",
    "sandeepraj30037@gmail.com",
    "kavyasmita.mishra@gmail.com",
    "sinhaankita579@gmail.com",
    "ommprasadsiku@gmail.com",
    "anweshabarik2021@gmail.com",
    "subhrajyotimoharana12@gmail.com",
    "rawanisachin0@gmail.com",
    "tanyasinha8574@gmail.com",
    "lipshapriya@gmail.com",
    "lipsasatpathy217@gmail.com",
    "ks9019928@gmail.com",
    "ishikasheet11@gmail.com",
    "amitkumarjena8482@gmail.com",
    "anindyamaji26@gmail.com",
  ]);

  const emailSet2 = new Set([
    "tapas.cbsa1234@gmail.com",
    "shaswatiswain05@gmail.com",
    "suryanarayanbarad780@gmail.com",
    "saikhistiaquealli@gmal.com",
    "amrendrakr754410@gmail.com",
    "shauryasalona23@gmail.com",
    "akashkumarjmd1@gmail.com",
    "siddharthkj55@gmail.com",
    "csrkl9cnikita26mohanta@gmail.com",
    "akumar2005.us@gmail.com",
    "iemssarbajeetsahoo10b32@gmail.com",
    "uf76127@gmail.com",
    "biswaprakashnayak48@gmail.com",
    "swayam.yash2006@gmail.com",
    "supriyas.ldas13012005@gmail.com",
    "jaydeepprasad2020@gmail.com",
    "somalinsamal27@gmail.com",
    "ritikajsr2005@gmail.com",
    "abhijitbag31@gmail.com",
    "numan8696@gmail.com",
    "pandasomnath885@gmail.com",
    "kushumitamahato5464@gmail.com",
    "adityamallick002@gmail.com",
    "priteshsahoo2006@gmail.com",
    "odisambit4021@gmail.com",
    "mrenuka950@gmail.com",
    "raymeera13@gmail.com",
    "biswajit2004senapati@gmail.com",
    "premjitsaha2006@gmail.com",
    "ananyasrivastava3377@gmail.com",
    "riturajpawan755@gmail.com",
    "Anushka2020135@gmail.com",
    "nayakritika2635@gmail.com",
    "futuretarun2@gmail.com",
    "gyanaranjansahoo174@gmail.com",
    "satviknarayan3377@gmail.com",
    "9d74swayamshaw2@gmail.com",
    "sareenastrina@gmail.com",
    "pandasushree2005@gmail.com",
    "aayushsharma.lucky97@gmail.com",
    "sayakmondal211@gmail.com",
    "adyashapanda05@gmail.com",
    "rajdarshnisingh@gmail.com",
    "ayushmohan2909@gmail.com",
    "sahithi1722@gmail.com",
    "supriyamahapatra2006@gmail.com",
    "pratikparida747@gmail.com",
    "yasheswani111@gmail.com",
    "lksahu120206@gmail.com",
    "rohitkumarsahoo1606@gmail.com",
    "niharikaa073@gmail.com",
    "prasanjitpanda06@gmail.com",
    "mayankpriyadarshi15@gmail.com",
    "prateekkumarmishra786@gmail.com",
    "mohantyashutosh360@gmail.com",
    "ashupatro005@gmail.com",
    "ashk59993@gmail.com",
    "sritampattanaik699@gmail.com",
    "abhijnv152006@gmail.com",
    "Rajdeepjmp07@gmail.com",
    "shubhasishmohanty83@gmail.com",
    "kushagrsingh2005@gmail.com",
    "ayushi270105@gmail.com",
    "mayankbhushan1305@gmail.com",
    "prabhask405@gmail.com",
    "rahulprajapati1418@gmail.com",
    "ssswain2004@gmail.com",
    "neelanjansarkar78@gmail.com",
    "leepshasamal@gmail.com",
    "dishamishra0830@gmail.com",
    "piyushrajanand03@gmail.com",
    "jibiteshkumarmishra8027@gmail.com",
    "ankitasinghofficial9652@gmail.com",
    "sinhakumaraditya123@gmail.com",
    "rk0612302@gmail.com",
    "rishikaranjan2786@gmail.com",
    "soumikdutta2632005@gmail.com",
    "drnayak2611@gmail.com",
    "debanshnayak6@gmail.com",
    "swatisbhuyan@gmail.com",
    "priyaranjandash987@gmail.com",
    "theremixerm@gmail.com",
    "jimmyfrxd@gmail.com",
    "daspiyush022006@gmail.com",
    "sehanakhtar@gmail.com",
    "saumyakofficial05@gmail.com",
    "saiasishsahu@gmail.com",
    "harapriyaparhi1@gmail.com",
    "ipshitkumardubey@gmail.com",
    "sriya.sahoo26@gmail.com",
    "kaushikanand2524@gmail.com",
    "anikaitmishra07@gmail.com",
    "thorvivek700@gmail.com",
    "jenabiswajit437@gmail.com",
    "d0itcae@gmail.com",
    "rajharshitraj54@gmail.com",
    "satyanarayanmohanty177@gmail.com",
    "hayatulislam481@gmail.com",
    "sanyuktkumarrai2@gmail.com",
    "subhasismohanty098@gmail.com",
    "prachimohapatra2005@gmail.com",
    "ksambit812@gmail.com",
    "amitkpradhan02@gmail.com",
    "subratkumarsahoo616@gmail.com",
    "pratikhyadash1412@gmail.com",
    "satyamkrop123ok@gmail.com",
    "shreyasngh455@gmail.com",
    "hetalkatkar025@gmail.com",
    "kardebayan3@gmail.com",
    "ghoshsayan5104@gmail.com",
    "hemanthpatnana3@gmail.com",
    "anujghadia57@gmail.com",
    "aryankumarnayak574@gmail.com",
    "aki1234raj@gmail.com",
    "saniazoha535@gmail.com",
    "bidyamona@gmail.com",
    "omprakash140906@gmail.com",
    "mohulrc@gmail.com",
    "pattnaik.harshita2005@gmail.com",
    "kpritish15@gmail.com",
    "jayantkumargodda1234@gmail.com",
    "bosesainandan06@gmail.com",
    "akash.arjun12@gmail.com",
    "naushaba.nasir00@gmail.com",
    "junaidrkhan07@gmail.com",
    "amankumarrrr999@gmail.com",
    "shoyelsk30@gmail.com",
    "harshkumar1212hks@gmail.com",
    "shashwat.sharma.008@gmail.com",
    "mohammadfaiz0645@gmail.com",
    "tejashwinisinha0510@gmail.com",
    "archikumarisah@gmail.com",
    "shreyanandani2005@gmail.com",
    "ritikranjansahu90@gmail.com",
    "sujalkumar6870@gmail.com",
    "ayushff1515@gmail.com",
    "manishpasayat951@gmail.com",
    "omkarmohanty655@gmail.com",
    "fardinkhan39608@gmail.com",
    "aleenarose645@gmail.com",
    "barikkrishna197@gmail.com",
    "riyachandra700@gmail.com",
    "aashu.22331122@gmail.com",
    "baishnabidas5209@gmail.com",
    "asmitgupta1206@gamil.com",
    "smrutiknk2006@gmail.com",
    "nikhilaryan0928@gmail.com",
    "omkarsarkar24@gmail.com",
    "rahulbiswal0000@gmail.com",
    "priiyashii@gmail.com",
    "budhadevsahoo678@gmail.com",
    "kohligargee@gmail.com",
    "mailshubhamsingh8210@gmail.com",
    "dprakriti2004@gmail.com",
    "aryandps06@gmail.com",
    "kashyapaman4851@gmail.com",
    "yashwantkankarwal5@gmail.com",
    "biswalsubhradeep@gmail.com",
    "dasdev4044@gmail.com",
    "gyanp1365@gmail.com",
    "nikitaswain1322b@gmail.com",
    "routsoumyajit345@gmail.com",
    "omshreedash.2024@gmail.com",
    "gunraiwal9c15@gmail.com",
    "shreya.gupta040605@gmail.com",
    "rupsapatra65@gmail.com",
    "swayamsiddhisamal@gmail.com",
    "smrutiranjanb03@gmail.com",
    "akankshasinha079@gmail.com",
    "geetanjalisingh1476@gmail.com",
    "ashfaque172khan@gmail.com",
    "prabhanjansabata67@gmail.com",
    "bharatbhushanb31@gmail.com",
    "ankitpanda406@gmail.com",
    "amansunny2014@gmail.com",
    "debjitpraharaj@gmail.com",
    "durgaprasad2005sahoo@gmail.com",
    "janmejaysahoo100@gmail.com",
    "alokumar346@gmail.com",
    "banditaswain09@gmail.com",
    "mdrazique31@gmail.com",
    "anuragpanda2005@gmail.com",
    "shreeman926@gmail.com",
    "maitisaikat805@gmail.com",
    "subhajitdandapat1111@gmail.com",
    "sahapriyam0707@gmail.com",
    "vis200426@gmail.com",
    "singhrishita63@gmail.com",
    "dikshashukla831004@gmail.com",
    "ppanigrahy098@gmail.com",
    "d.arpita419@gmail.com",
    "rasmitapati2005@gmail.com",
    "mishrayashaswee6@gmail.com",
    "aastha28212@gmail.com",
    "dibyajyotictc3@gmail.com",
    "ajitsahu.0611@gmail.com",
    "theaditisingh05@gmail.com",
    "shubhamprusty566@gmail.com",
    "ipsitaghosh622@gmail.com",
    "palaisrikanta13@gmail.com",
    "sujalmohanty06@gmail.com",
    "karlosharma69@gmail.com",
    "srijitachowdhury05@gmail.com",
    "saswatbiswalwork@gmail.com",
    "shoumik706@gmail.com",
    "aditikri543@gmail.com",
    "khush93481@gmail.com",
    "diptimayee.sahu006@gmail.com",
    "priyanshumayank251@gmail.com",
    "niyati.tamanna@gmail.com",
    "shandilyasatya2@gmail.com",
    "rojalipradhan14@gmail.com",
    "koushikdasmagnate2005@gmail.com",
    "abhav14family@gmail.com",
    "suhanianand2005@gmail.com",
    "riyaatwork246@gmail.com",
    "shrisgupta17@gmail.com",
    "pratiktripathy55@gmail.com",
    "vivekranjansahoo7@gmail.com",
    "aaryanraj2359@gmail.com",
    "sallounim@gmail.com",
    "nishhu24@gmail.com",
    "kspchimun@gmail.com",
    "siddhantjena2007@gmail.com",
    "omskl6835@gmail.com",
    "soumyajitkuila27@gmail.com",
    "16mansa05@gmail.com",
    "anuska.basantia15@gmail.com",
    "dasabinash.omm@gmail.com",
    "hkp12345h@gmail.com",
    "atulyamishra2020@gmail.com",
    "pabitramahakur3@gmail.com",
    "kumsr16aryan@gmail.com",
    "swastikapatra006@gmail.com",
    "omsoumyadarshan@gmail.com",
    "techjourney1234@gmail.com",
    "gsmrutishriya12@gmail.com",
    "shradhasangitadash@gmail.com",
    "sambitkusahoo089@gmail.com",
    "jargopal60@gmail.com",
    "prijena15@gmail.com",
    "sarthaklenka04@gmail.com",
    "anmolprajapati50@gmail.com",
    "priyanshupatra7580@gmail.com",
    "ramshyam.200517@gmail.com",
    "yuvrajrnc@gmail.com",
    "satyaswaroop797@gmail.com",
    "biraja.2005bs@gmail.com",
    "anjan7045@gmail.com",
    "abhipsa699@gmail.com",
    "paramsprabhu@gmail.com",
    "mmd59336@gmail.com",
    "shrabankumarsahoo48@gmail.com",
    "priyanshatripathy2004@gmail.com",
    "tusharkantagrawala@gmail.com",
    "rj9040807711@gmail.com",
    "ayushpradhan207@gmail.com",
    "purusottamdash730@gmail.com",
    "pradyushkumarroul45@gmail.com",
    "mdyasirarfat6207@gmail.com",
    "kumarprabeen98@gmail.com",
    "tapaskumarsahoo8584@gmail.com",
    "swayamsubudhiixa2004@gmail.com",
    "subhamisnotop@gmail.com",
    "dhanraj.feb@gmail.com",
    "jyotiprakashpadhi30@gmail.com",
    "sahutanisha19@gmail.com",
    "riteshkubehera.2006@gmail.com",
    "golu993857@gmail.com",
    "neharisita@gmail.com",
    "madhusikta05@gmail.com",
    "adidash149@gmail.com",
    "Webosingh93@gmail.com",
    "dassarthaksuman17@gmail.com",
    "sahoodebjit660@gmail.com",
    "i.am.the.abhijeetdash@gmail.com",
    "bhumika.dash10c@gmail.com",
    "ashishmishra32005@gmail.com",
    "barshapradhan1106@gmail.com",
    "sumitsidharth30@gmail.com",
    "surajnh8a46@gmail.com",
    "ahinsamohanty12@gmail.com",
    "adityadwivedi432@gmail.com",
    "noblepaul995@gmail.com",
    "ankitraj3736@gmail.com",
    "rajashreeswain471@gmail.com",
    "sumedhasengupta37@gmail.com",
    "ritzraven1234@gmail.com",
    "pandapriyanshrip@gmail.com",
    "ayaz.sami1801@gmail.com",
    "sapnapradhan104@gmail.com",
    "ajanil9938@gmail.com",
    "sushobhanpratihari004@gmail.com",
    "abhisiktsingh459@gmail.com",
    "harshbardhanak4071@gmail.com",
    "aritraind06@gmail.com",
    "itsomm1808@gmail.com",
    "adarshkumarsahoo87@gmail.com",
    "ujjwayiniroy03@gmail.com",
    "priyansidas44@gmail.com",
    "mohitkumargupta154@gmail.com",
    "suryanarayanaofficial13@gmail.com",
    "deepakmoharana38@gmail.com",
    "dashashu7@gmail.com",
    "harshitgupta2245@gmail.com",
    "sohangsamal183@gmail.com",
    "himanshudikhit763@gmail.com",
    "mudulipratikshya6@gmail.com",
    "gourabbarik26@gmail.com",
    "jiteshraj2007@gmail.com",
    "palaip27@gmail.com",
    "anweshsamal1028@gmail.com",
  ]);

  // Adding new emails to the Set
  const emailSet3 = [
    "harshitghosh4957@gmail.com",
    "ayushsharma2004aks@gmail.com",
    "kpratyush82@gmail.com",
    "sp8464322@gmail.com",
    "swayamtripathy40@gmail.com",
    "shwetanshusahu@gmail.com",
    "abeerburman2005@gmail.com",
    "amar.insta436@gmail.com",
    "abinashbahinipati2000@gmail.com",
    "rishi.chou100505@gmail.com",
    "snehasrita2004@gmail.com",
    "preeyampadhy@gmail.com",
    "sujansahoo27@gmail.com",
    "arbindmugri045@gmail.com",
    "thescintillate11@gmail.com",
    "raosailaja23@gmail.com",
    "satyajitsethy475@gmail.com",
    "kaushalrnc0@gmail.com",
    "owaisalam887@gmail.com",
    "apadhi6638@gmail.com",
    "saivarshitkm@gmail.com",
    "snehapika77@gmail.com",
    "aribashakil20@gmail.com",
    "ashishba33@gmail.com",
    "pritammohapatra829@gmail.com",
    "suvammohapatra8745@gmail.com",
    "amankumarchoudhary913@gmail.com",
    "sahueshwar28@gmail.com",
    "piyushranjansahoo31@gmail.com",
    "burmasneha2@gmail.com",
    "vaibhavkrishnan22@gmail.com",
    "pradhanprithivi700@gmail.com",
    "janiankit17@gmail.com",
    "pareshsahoo528@gmail.com",
    "suryanarayandebata8@gmail.com",
    "anahita.singh.31@gmail.com",
    "beheradigambar563@gmail.com",
    "karamanashutosh@gmail.com",
    "chabriayushman@gmail.com",
    "srichandanprakruti@gmail.com",
    "shreyakumari.7102005@gmail.com",
    "sushreeispresent@gmail.com",
    "pratikbhatta07@gmail.com",
    "hellonabi76@gmail.com",
    "aryanswain0007@gmail.com",
    "ava.acharya3@gmail.com",
    "akshatojha178@gmail.com",
    "dmohanta674@gmail.com",
    "yashkumar5872@gmail.com",
    "mayukhsahu2006@gmail.com",
    "ayush16r@gmail.com",
    "suryakantalenka107@gmail.com",
    "manishbaitharu05@gmail.com",
    "sohamb316@gmail.com",
    "kaushikib835@gmail.com",
    "aaravkumargupta0@gmail.com",
    "sahud812003@gmail.com",
    "rb5592678@gmail.com",
    "rudraprasadsamal2006@gmail.com",
    "smarikasahoo26@gmail.com",
    "riyapatnaik07@gmail.com",
    "Nirajchauhan.2005123@gmail.com",
    "pihukumari2710@gmail.com",
    "shrutimohanty911@gmail.com",
    "kumarsourav7634980406@gmail.com",
    "ayusmandas4@gmail.com",
    "Priyankapriyadarshinimohantyri@gmail.com",
    "aishwaraytiwary@gmail.com",
    "nayaksoumya072005@gmail.com",
    "vatsalanand2800@gmail.com",
    "has161978@gmail.com",
    "spshyamaprasad1234@gmail.com",
    "ayushkumarparida631@gmail.com",
    "satyaswarup@gmail.com",
    "amrita14643@gmail.com",
    "pratikgoel8725@gmail.com",
    "shivangipathak777@gmail.com",
    "rahul87971444@gmail.com",
    "rajnayan2092004@gmail.com",
    "naiknabnit@gmail.com",
    "sinhaayush7500@gmail.com",
    "stuti.gupta.2721@gmail.com",
    "sarmaamar2426@gmail.com",
    "shradha224shrivastava@gmail.com",
    "ranjeetrajeshkumar12@gmail.com",
    "jenaakankshya2004@gmail.com",
    "ananyapadhi3211@gmail.com",
    "roniitpodder@gmail.com",
    "kaushikkaran4545@gmail.com",
    "govind31.12gupta@gmail.com",
    "nupurdey0606@gmail.com",
    "brajakishoresahoose2006p@gmail.com",
    "monishamht05@gmail.com",
    "arishashabi156@gmail.com",
    "basuanurag449@gmail.com",
    "tanushreesahoo2005@gmail.com",
    "ananyajena292@gmail.com",
    "rajlakshmibhal824@gmail.com",
    "kumarnaggaurav@gmail.com",
    "nayanika.agartala2005@gmail.com",
    "snehasahoo2006@gmail.com",
    "nabihazn2004@gmail.com",
    "runjhunpradhan@gmail.com",
    "princesahoo571@gmail.com",
    "kiranbehera694@gmail.com",
    "supriyasamal675@gmail.com",
    "amanbaral1230@gmail.com",
    "sameerkumarpanda2047@gmail.com",
    "jyotiranjan1324@gmail.com",
    "pesiniravali@gmail.com",
    "sranjita1974@gmail.com",
    "subhsoa@gmail.com",
    "kumarankit11458@gmail.com",
    "nishita1357sahoo@gmail.com",
    "prasannapatnaik4@gmail.com",
    "rounakmahato039@gmail.com",
    "Rekhasmruti1608@gmail.com",
    "dasjayashree8260@gmail.com",
    "aryanabhinav77@gmail.com",
    "vikashvaibhav66@gmail.com",
    "priyanshusingh2102@gmail.com",
    "calvin20pro20@gmail.com",
    "12ananyamoharana34@gmail.com",
    "prakritiraj2005@gmail.com",
    "saishrutibarik@gmail.com",
    "khushichowdhary18@gmail.com",
    "sampritibiswas8@gmail.com",
    "shrijan525@gamil.com",
    "ayush210505bksc@gmail.com",
    "ansumanghosh18@gmail.com",
    "sahooswarup60@gmail.com",
    "ahankashyap2005@gmail.com",
    "satyabratnayakofficial@gmail.com",
    "skkaifaiyaz@gmail.com",
    "nandininayak454@gmail.com",
    "offayushraj1006@gmail.com",
    "sarbasidhpanigrahi@gmail.com",
    "lambodardey37@gmail.com",
    "manishonquest@gmail.com",
    "Killerking15556@gmail.com",
    "amlananshumann@gmail.com",
    "debabratakatha063@gmail.com",
    "smrutipragyanrath5@gmail.com",
    "prayashchandrapradhan@gmail.com",
    "ahanapallabi1911@gmail.com",
    "pramathesh18@gmail.com",
    "poojapuspitad2003@gmail.com",
    "namansinha90@gmail.com",
    "ayushjmp99@gmail.com",
    "sjeet.satapathy@gmail.com",
    "sidhiprada795@gmail.com",
    "prtkur44@gmail.com",
    "vishnujha1001@gmail.com",
    "akankshakumariii02@gmail.com",
    "biswaprakashnayak48@gmail.com",
    "dasashutosh606@gmail.com",
    "mehul0316kumar@gmail.com",
    "snehshishd@gmail.com",
    "heroshivek@gmail.com",
    "rishav1306singh@gmail.com",
    "punyapradayinisahoo@gmail.com",
    "bineetbhadani@gmail.com",
    "yugankkumar936@gmail.com",
    "preetamjena2908@gmail.com",
    "abhipsamohapatra270805@gmail.com",
    "ayusmitadash5@gmail.com",
    "debu10panda@gmail.com",
    "smritiranjanbal@gmail.com",
    "kshitijprasad3021@gmail.com",
    "karaditya392@gmail.com",
    "jagatkumargiri2005@gmail.com",
    "upadhyayshobhini@gmail.com",
    "chandrapoddarrohit@gmail.com",
    "sambhav180821@gmail.com",
    "ashritnayak16@gmail.com",
    "bandhu140@gmail.com",
    "anuskash25@gmail.com",
    "ujjwal2282@gmail.com",
    "almazsheikh1234@gmail.com",
    "amarpatro08@gmail.com",
    "pratikpandit.2410@gmail.com",
    "raghuvanshikishan1177@gmail.com",
    "patnaikarnav2233j@gmail.com",
    "hussaintinwala2006@gmail.com",
    "mayankkanti2325@gmail.com",
    "aaryan1275@gmail.com",
    "muktachoirasia2006@gmail.com",
    "kunalmehta692@gmail.com",
    "ayushsingh94861@gmail.com",
    "himanshuraj9july@gmail.com",
    "masuqg1234@gmail.com",
    "matruprasadbehera15@gmail.com",
    "abhishekraj605912@gmail.com",
    "Krishnashubham09@gmail.com",
    "workamit101@gmail.com",
    "sitanshusekharprusti6@gmail.com",
    "sauravkumarpanda7@gmail.com",
    "swarupsahoo.9437com@gmail.com",
    "patraanuj1234@gmail.com",
    "mahijsr2005@gmail.com",
    "p.rudra0136@gmail.com",
    "aakifmojib.edu@gmail.com",
    "skmdshoaib11@gmail.com",
    "sukanyaojha8@gmail.com",
    "sunupanda04@gmail.com",
    "pothaljagruti@gmail.com",
    "99sahuaryan@gmail.com",
    "dashtanisha2004@gmail.com",
    "kunalkishoresahu319@gmail.com",
    "rashmiranjan1079v@gmail.com",
    "adi2005anj@gmail.com",
    "surajitsutapa76@gmail.com",
    "pritammalla427@gmail.com",
    "subhakantadas11@gmail.com",
    "duttamanik47@gmail.com",
    "singhdepesh912@gmail.com",
    "gatikrushnabhuyan51@gmail.com",
    "ditikrishnapradhan48@gmail.com",
    "ishayadav273@gmail.com",
    "sabats407@gmail.com",
    "runnysatapathy@gmail.com",
    "ankit.dash.2002@gmail.com",
    "soumyaranjansutar738@gmail.com",
    "sumerrath@gmail.com",
    "akashbhujabal63@gmail.com",
    "muskanshruti32@gmail.com",
    "beherasubhrajitbehera143@gmail.com",
    "adityaranjan4626@gmail.com",
    "dasmohapatrapiyush@gmail.com",
    "satwikmishra074@gmail.com",
    "gpratyush1402@gmail.com",
    "rajbabi0909@gmail.com",
    "saispandandas@gmail.com",
    "architanand481@gmail.com",
    "bpatnaik0912@gmail.com",
    "routrudra95@gmail.com",
    "ssbsingh06@gmail.com",
    "samalmrinall9@gmail.com",
    "ansumanreet333@gmail.com",
    "sudiptobhadra9c.jssp@gmail.com",
    "mohitray11b.jssp@gmail.com",
    "guruprasadpanda4646@gmail.com",
    "asmitpattnaik777@gmail.com",
    "ridhinahata12@gmail.com",
    "kumarswastikfatehpur@gmail.com",
    "dineshnandi07@gmail.com",
    "jiteshmohanty00@gmail.com",
    "rinkuprasad8340@gmail.com",
    "sujayshaw23@gmail.com",
    "mohantypratyush2@gmail.com",
    "anishjsr7985@gmail.com",
    "adityamishrastmary395@gmail.com",
    "aakashgupta292006@gmail.com",
    "shreyassrivastava605@gmail.com",
    "adnanali369963@gmail.com",
    "s.shristiiix@gmail.com",
    "himanshu220507@gmail.com",
    "jenajiban365@gmail.com",
    "sdash7774@gmail.com",
    "eshitapanda38@gmail.com",
    "rajshreesingh085@gmail.com",
    "shantilatamahapatra575@gmail.com",
    "bismaykumarbiswal59@gmail.com",
    "ps617694@gmail.com",
    "swapnilmohanty06@gmail.com",
    "sanket45nayak@gmail.com",
    "sayonidey.official@gmail.com",
    "mahaprasad954@gmail.com",
    "pritamkr.sahoo2100@gmail.com",
    "hiteshkumarr356@gmail.com",
    "amitkumargiri2005@gmail.com",
    "pradhansoumyaranjan368@gmail.com",
    "kaushikmohanty2021@gmail.com",
    "smarakjena1@gmail.com",
    "samalpriyamkumar@gmail.com",
    "priyanshusmith123@gmail.com",
    "imsmruti1612@gmail.com",
    "vidishajena24@gmail.com",
  ];
  const emailSet4 = new Set([
    "kalind.hajipur@gmail.com",
    "aman.prasad060106@gmail.com",
    "badalsahu2501@gmail.com",
    "puspal1703@gmail.com",
    "rrjsr04@gmail.com",
    "aditya271204@gmail.com",
    "ayush21.pradhan@gmail.com",
    "amritaryajsr@gmail.com",
    "ankushsaha806@gmail.com",
    "pandapratikhya71@gmail.com",
    "damodarbiswal02@gmail.com",
    "bhoomi1818@gmail.com",
    "bhabeshcse@gmail.com",
    "anandak28404@gmail.com",
    "ayushkumr1991@gmail.com",
    "abhijeetgarai1209@gmail.com",
    "karnaaman28@gmail.com",
    "niruponpal2003@gmail.com",
    "shreyamishra200520@gmail.com",
    "jarpita600@gmail.com",
    "rishikaa174@gmail.com",
    "atulsinha96.alpha@gmail.com",
    "mukherjeeaneek5@gmail.com",
    "rjgupta2116@gmail.com",
    "biswasworup1234@gmail.com",
    "subhashree3390@gmail.com",
    "janmanjai8403@gmail.com",
    "guptapriyanshu4814@gmail.com",
    "jhasuhani057@gmail.com",
    "kanungopratiyusha@gmail.com",
    "zoya.fatmakamal@gmail.com",
    "mansinghvivekkumar@gmail.com",
    "anishmohanty112@gmail.com",
    "anshgupta3221@gmail.com",
    "rohitranjansahoo04@gmail.com",
    "rupashreemazumdar@gmail.com",
    "kashishjuneja902@gmail.com",
    "debadritakonar2005@gmail.com",
    "anannyagenai1912@gmail.com",
    "22032004anjali@gmail.com",
    "devilproart@gmail.com",
    "smriti13ann@gmail.com",
    "ilorapramanik19@gmail.com",
    "arubaariz@gmail.com",
    "ayushsh0311@gmail.com",
    "ashishroy0987654321@gmail.com",
    "akkiakash2301@gmail.com",
    "ayushgourav00@gmail.com",
    "surajitcoc121@gmail.com",
    "mashutosh2005@gmail.com",
    "abhishekray162.08@gmail.com",
    "shreyansh.everywhere@gmail.com",
    "debanjans231@gmail.com",
    "abk700007@gmail.com",
    "arinkumarjoshi2004@gmail.com",
    "rupkatha.maitie@gmail.com",
    "maliksourav3003@gmail.com",
    "priyansunayak108@gmail.com",
    "subhajitrath3@gmail.com",
    "souhardyabanerjee123@gmail.com",
    "deviprasadvarma12@gmail.com",
    "raviraj600700@gmail.com",
    "aadeshsrivastava69@gmail.com",
    "am20.prof@gmail.com",
    "jsdcnbj@bhmcbms.om",
    "rituppradhan2004@gmail.com",
    "singhashishranjan362@gmail.com",
    "aaprateek48@gmail.com",
    "webosingh93@gmail.com",
    "dibyasmitaacharya@gmail.com",
    "swikritimohapatra@gmail.com",
    "college.udbhav227@gmail.com",
    "ankitkumarchoudhary8789823402@gmail.com",
    "kastaishika@gmail.com",
    "satyamkumar72240@gmail.com",
    "subodhkumarpradhan63@gmail.com",
    "arupjyotimohanty7710@gmail.com",
    "chaturvedistuti913@gmail.com",
    "debabratasahoo526@gmail.com",
    "sourav.hkp2005@gmail.com",
    "adityaaryan174@gmail.com",
    "bhavyaarnay@gmail.com",
    "iter.student.alpha@gmail.com",
    "bsnehashis2506@gmail.com",
    "omanand053@gmail.com",
    "hardik437816@gmail.com",
    "ashutoshbaliarsingh789@gmail.com",
    "ayushpaswan6868@gmail.com",
    "arpitkumarjsr1234@gmail.com",
    "sayanmandal5711@gmail.com",
    "amankumardas620@gmail.com",
    "suryakantan431@gmail.com",
    "kumarmayank0412@gmail.com",
    "pradeepdas.raja@gmail.com",
    "vedranjank14@gmail.com",
    "dhurvsinha0905@gmail.com",
    "paridashub9871@gmail.com",
    "satyapritsahoo@gmail.com",
    "surajkushwaha419@gmail.com",
    "ayushanimeshbarik@gmail.com",
    "manishdash16@gmail.com",
    "adarsharpit06@gmail.com",
    "ayushsarangi320@gmail.com",
    "akshatjha3125@gmail.com",
    "dhruv.pandey.rnc4@gmail.com",
    "akr6447@gmail.com",
    "shrutikumari5709@gmail.com",
    "yashrajjaiswal808@gmail.com",
    "mohantypriyansu02@gmail.com",
    "amitsng2005@gmail.com",
    "shreyasm2305@gmail.com",
    "muskangupta250604@gmail.com",
    "viduship006@gmail.com",
    "s.singhayush05@gmail.com",
    "chandrarajprasad261@gmail.com",
    "kumarshivamnag@gmail.com",
    "pratham6306@gmail.com",
    "medecodewidwaiz@gmail.com",
    "ayanali007p@gmail.com",
    "kartikeswarpanda2005@gmail.com",
    "finalstrike7609@gmail.com",
    "advuser262@gmail.com",
    "ksrideep007@gmail.com",
    "amankumar947001334@gmail.com",
    "rahulparida1566@gmail.com",
    "priye1608@gmail.com",
    "aryasinha6408@gmail.com",
    "subhammaharana706@gmail.com",
    "kumaraswini1649@gmail.com",
    "rajo.zxy42@gmail.com",
    "akhil2112005@gmail.com",
    "ommjena77@gmail.com",
    "shubh.sharma6978@gmail.com",
    "akankshyamohapatra.8905@gmail.com",
    "ghoshrayan73@gmail.com",
    "priyushsaha707@gmail.com",
    "kumariprachi2710@gmail.com",
    "pratyusha.pradhan2005@gmail.com",
    "swapneswar804@gmail.com",
    "rohankumar72028@gmail.com",
    "amandevv007@gmail.com",
    "agrawalpratik706@gmail.com",
    "architarout308@gmail.com",
    "adibaarooj@gmail.com",
    "aiswaryanarayanrout@gmail.com",
    "amarjyotisahoo2005@gmail.com",
    "achintamdey9a3@gmail.com",
    "anjalikumariyadav49@gmail.com",
    "laddimehra574@gmail.com",
    "bibeksethy10@gmail.com",
    "shaswatpattnayak62005@gmail.com",
    "chiranjibeepanigrahi@gmail.com",
    "shitakashranjan@gmail.com",
    "vpanigrahi.2005@gmail.com",
    "prateekchhatoi2005@gmail.com",
    "vidhyavijay2600@gmail.com",
    "prinshitbal25@gmail.com",
    "sunanda3045@gmail.com",
    "sinha.nandish@gmail.com",
    "khusheeranjan@gmail.com",
    "pilotpiyush@gmail.com",
    "atd5370@gmail.com",
    "bhattacharjeeayan93@gmail.com",
    "ayushpadhiary1791@gmail.com",
    "saratb137@gmail.com",
    "girijashankarsahoo2006@gmail.com",
    "snehammhcrtz@gmail.com",
    "simran.patra006@gmail.com",
    "shyamaparamanik06@gmail.com",
    "anupamchandra79877@gmail.com",
    "arhanyezdani5114@gmail.com",
    "sayantandutta6722@gmail.com",
    "snehashisdash1862@gmail.com",
    "dhrutikishorepatra@gmail.com",
    "shreyanspatra2005@gmail.com",
    "wrutvee2006@gmail.com",
    "imtiyazallam07@outlook.com",
    "deepakkumarroutray9@gmail.com",
    "ayutayamsutar01@gmail.com",
    "jyotiradityapatra45@gmail.com",
    "ayeshaperveen17@gmail.com",
    "sagnikpratihar02@gmail.com",
    "mishra3shaswat@gmail.com",
    "beherasoumyaranjan518@gmail.com",
    "riteshsahoo.com@gmail.com",
    "ashish.katiyar20012006@gmail.com",
    "nsubhaarchita@gmail.com",
    "pragnyasusethi@gmail.com",
    "devidattamishra2024@gmail.com",
    "riteshritu317@gmail.com",
    "ayushmansahoo648@gmail.com",
    "jaiswalpiyush040@gmail.com",
    "guday6927@gmail.com",
    "paramjyotibehera2005@gmail.com",
    "shaswatibehera1024@gmail.com",
    "kukisubhashree@gmail.com",
    "mohank0823@gmail.com",
    "senapati.pragyan@gmail.com",
    "tanisha.biswal@gmail.com",
    "smsuryamadhab@gmail.com",
    "nchinmay66@gmail.com",
    "tripathypratyush2005@gmail.com",
    "rudranahak310@gmail.com",
    "rdpkumar2308@gmail.com",
    "rathbhagyashree848@gmail.com",
    "swayam.jethi@gmail.com",
    "mohantysarthak89@gmail.com",
    "bhuyanabinash48@gmail.com",
    "abhisekmishra927@gmail.com",
    "divyanshsahu310@gmail.com",
    "souravdalei90@gmail.com",
    "ap1362818@gmail.com",
    "farhadshahidabdul@gmail.com",
    "9827711306.kpswain@gmail.com",
    "ayushronit2006@gmail.com",
    "spandanpattanaik2007@gmail.com",
    "baradpk24@gmail.com",
    "ranjitsenapati566@gmail.com",
    "adarshd614@gmail.com",
    "globinray@gmail.com",
    "adityabeura744@gmail.com",
    "ankitkumar999090@gmail.com",
    "shivambastia47@gmail.com",
    "ayush.samal2001@gmail.com",
    "swapneshbarik247@gmail.com",
    "rishikadas73148@gmail.com",
    "abhaymishra200507@gmail.com",
    "nerihd9876@gmail.com",
    "jagadish2005sahoo185@gmail.com",
    "richakri007@gmail.com",
    "dhanraj.pupu05@gmail.com",
    "purusottammohanta777@gmail.com",
    "akankhyapvt@gmail.com",
    "suryamallick248@gmail.com",
    "trushnatripathy4@gmail.com",
    "sahoobiswajit7062@gmail.com",
    "riteshlenka2005@gmail.com",
    "amankumarsahu223@gmail.com",
    "adityaohdar24@gmail.com",
    "swagatsourav10241@gmail.com",
    "dtripathy739@gmail.com",
    "sampreetimohapatra@gmail.com",
    "k0259.mpsbls@gmail.com",
    "milanswarup99@gmail.com",
    "beheraranjan200706@gmail.com",
    "riddhimasingh0303@gmail.com",
    "sangamgupta21637112@gmail.com",
    "mrangadsingh772@gmail.com",
    "sp4730060@gmail.com",
    "pratyushprakashsahoo28@gmail.com",
    "jagmanpreetkaur16@gmail.com",
    "piyushgupta2.jh@gmail.com",
    "bhabikabhadra2006@gmail.com",
    "priyanshub1407@gmail.com",
    "psamheetamohapatra17@gmail.com",
    "shubhamparida23@gmail.com",
    "lalatendubal5@gmail.com",
    "suprava644@gmail.com",
    "anurag.theofficial@gmail.com",
    "dasbandhan21@gmail.com",
    "anuvabghosh32@gmail.com",
    "adityarswain04@gmail.com",
    "shubhamdipakrathor@gmail.com",
    "mritunjoyr838@gmail.com",
    "rtuyuyuy@gmail.com",
  ]);

  let emailSet = new Set([
    ...emailSet1,
    ...emailSet2,
    ...emailSet3,
    ...emailSet4,
  ]);

  //console.log(emailSet.size);
  //HASHMAP FOR EMAIL AND REGNO...
  if (!emailSet.has(email)) {
    return res.json({
      success: true,
      message: "You have not registered for this event with the given email.",
    });
  }
  console.log(email);
  try {
    const attempt = await QuizResult.findOne({
      $or: [{ email: email }, { regNo: regNo }],
    });

    if (attempt) {
      return res.json({
        success: true,
        message: "You already attempted the quiz.",
      });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error("Error checking quiz attempt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getQuiz = async (req, res) => {
  let success = false;
  let quizID = req.params.quizID;
  try {
    let quiz = await Quiz.findOne({ quizID: quizID });
    if (!quiz) {
      return res.json({ success, error: "Quiz Not Found!" });
    }
    quiz.impressions = quiz.impressions + 1;
    await quiz.save();

    let user = await User.findOne({ _id: quiz.user });
    if (!user) {
      return res.json({ success, error: "User Not Found!" });
    }

    user.totalImpressions = user.totalImpressions + 1;
    await user.save();

    success = true;
    return res.json({ success, quiz });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const takeQuiz = async (req, res) => {
  let success = false;
  let quizID = req.params.quizID;

  if (!quizID) {
    return res.json({ success, error: "Quiz ID is required!" });
  }

  //console.log("Quiz ID:gddg", quizID);

  let { answers, email, regNo, takeQuizQuestions } = req.body;

  //console.log(takeQuizQuestions);

  try {
    let quiz = await Quiz.findOne({ quizID });
    if (!quiz) {
      return res.json({ success: false, error: "Quiz Not Found!" + quizID });
    }

    if (quiz.type !== "qna") {
      return res.json({ success: false, error: "This is not a QnA Quiz!" });
    }

    let questions = takeQuizQuestions;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.json({
        success: false,
        error: "No questions found in the quiz!",
      });
    }

    let score = 0;
    let total = questions.length;
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    const questionAnswerPairs = [];
    for (let i = 0; i < total; i++) {
      let question = questions[i];
      let answer = answers[i] || "";
      //console.log(question);
      let ques = await Question.findOne({ _id: question });
      if (!ques) {
        return res.json({
          success: false,
          error: `Question ${i + 1} Not Found!`,
        });
      }

      if (answer !== "") {
        attempted++;
        if (answer === ques.correctAnswer) {
          correct++;
          score++;
          ques.correct = (ques.correct || 0) + 1;
        } else {
          incorrect++;
          ques.incorrect = (ques.incorrect || 0) + 1;
        }
      } else {
        //console.log("MAI HE HU ULTIMATE ");
      }
      questionAnswerPairs.push({ question, answer });
      ques.attempts = (ques.attempts || 0) + 1;
      await ques.save();
    }
    // console.log("START");
    // console.log(questionAnswerPairs);
    // console.log("END");
    let result = {
      score,
      total,
      attempted,
      correct,
      incorrect,
      questionAnswerPairs,
    };
    success = true;
    return res.json({ success, result });
  } catch (error) {
    console.error("Error in takeQuiz:", error);
    return res.json({ success: false, error: "Something Went Wrong!" });
  }
};

const save_score = async (req, res) => {
  const {
    quizID,
    email,
    regNo,
    score,
    total,
    questionTimers,
    questionAnswerPairs,
  } = req.body;
  //console.log(req.body + "iengiueg");
  try {
    const existingResult = await QuizResult.findOne({ email, regNo });
    if (existingResult) {
      return res
        .status(400)
        .json({ success: false, error: "You have already taken this quiz." });
    }

    const formattedQuestionAnswerPairs = questionAnswerPairs.map((pair) => ({
      questionID: pair.question._id,
      answer: pair.answer,
    }));

    //console.log(formattedQuestionAnswerPairs);
    // Save
    const result = new QuizResult({
      quizID,
      email,
      regNo,
      score,
      total,
      questionTimers,
      formattedQuestionAnswerPairs,
    });
    await result.save();
    res.json({ success: true, message: "Score saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to save score." });
  }
};

const takePoll = async (req, res) => {
  let success = false;
  let quizID = req.params.quizID;
  let { answers } = req.body;
  try {
    let quiz = await Quiz.findOne({ quizID: quizID });
    if (!quiz) {
      return res.json({ success, error: "Quiz Not Found!" });
    }

    if (quiz.type !== "poll") {
      return res.json({ success, error: "This is not a Poll!" });
    }

    let questions = quiz.questions;

    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let answer = answers[i];

      let ques = await Question.findOne({ _id: question });
      if (!ques) {
        return res.json({ success, error: "Question Not Found!" });
      }

      if (ques.optionType === "text") {
        answer = answer.split(delimeter)[0];
      } else if (ques.optionType === "img") {
        answer = answer.split(delimeter)[1];
      } else if (ques.optionType === "both") {
        answer = answer.split(delimeter)[0] + answer.split(delimeter)[1];
      }

      if (ques.optionType === "text") {
        if (answer === ques.options[0]) ques.optedOption1 += 1;
        else if (answer === ques.options[1]) ques.optedOption2 += 1;
        else if (answer === ques.options[2]) ques.optedOption3 += 1;
        else if (answer === ques.options[3]) ques.optedOption4 += 1;
      }

      if (ques.optionType === "img") {
        if (answer === ques.imageOptions[0]) ques.optedOption1 += 1;
        else if (answer === ques.imageOptions[1]) ques.optedOption2 += 1;
        else if (answer === ques.imageOptions[2]) ques.optedOption3 += 1;
        else if (answer === ques.imageOptions[3]) ques.optedOption4 += 1;
      }

      if (ques.optionType === "both") {
        if (answer === ques.options[0] + ques.imageOptions[0])
          ques.optedOption1 += 1;
        else if (answer === ques.options[1] + ques.imageOptions[1])
          ques.optedOption2 += 1;
        else if (answer === ques.options[2] + ques.imageOptions[2])
          ques.optedOption3 += 1;
        else if (answer === ques.options[3] + ques.imageOptions[3])
          ques.optedOption4 += 1;
      }

      ques.attempts = ques.attempts + 1;
      await ques.save();
    }

    success = true;
    return res.json({ success, info: "Poll Submitted Successfully!!" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const deleteQuiz = async (req, res) => {
  let success = false;
  let quizID = req.params.quizID;
  let user = req.user;
  try {
    let quiz = await Quiz.findOne({ quizID: quizID });
    if (!quiz) {
      return res.json({ success, error: "Quiz Not Found!" });
    }

    user = await User.findOne({ _id: user.id });
    if (!user) {
      return res.json({ success, error: "User Not Found!" });
    }

    if (quiz.user.toString() !== user.id.toString()) {
      return res.json({
        success,
        error: "You are not authorized to delete this quiz!",
      });
    }

    let questions = quiz.questions;
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let ques = await Question.findOne({ _id: question });
      if (!ques) {
        return res.json({ success, error: "Question Not Found!" });
      }
      await ques.deleteOne();
    }

    await quiz.deleteOne();

    user.quizCreated = user.quizCreated - 1;
    user.questionsCreated = user.questionsCreated - questions.length;
    user.totalImpressions = user.totalImpressions - quiz.impressions;
    await user.save();

    success = true;
    return res.json({ success, info: "Quiz Deleted Successfully!!" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const getTrending = async (req, res) => {
  let success = false;
  let user = req.user;
  try {
    let quizzes = await Quiz.find(
      { user: user.id },
      "impressions createdOn name"
    ).sort({ impressions: -1 });
    quizzes = quizzes.filter((quiz, index) => quiz.impressions > 10);
    success = true;
    return res.json({ success, quizzes });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const getQuestion = async (req, res) => {
  const { questionID } = req.params;
  //console.log(questionID);
  try {
    const question = await Question.findOne({ _id: questionID });
    if (!question) {
      return res.json({ error: "Question Not Found!xyz" });
    }

    return res.json({ success: true, question });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

module.exports = {
  createQuiz,
  getQuiz,
  takeQuiz,
  check_attempt,
  save_score,
  deleteQuiz,
  takePoll,
  getTrending,
  getQuestion,
};
