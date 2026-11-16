const questionSets = {
  quiz: [
    {q:"Вычисли: 3/4 + 1/4.", a:["1","1/2","4/8","3/8"], correct:0, explain:"Знаменатели одинаковые: 3/4 + 1/4 = 4/4 = 1.", hint:"При сложении дробей с одинаковыми знаменателями складывают числители."},
    {q:"Чему равны 25% от числа 80?", a:["15","20","25","40"], correct:1, explain:"25% — это четверть числа. 80 : 4 = 20.", hint:"Вспомни, какая простая дробь соответствует 25%."},
    {q:"Реши уравнение: 5x − 7 = 18.", a:["3","4","5","6"], correct:2, explain:"5x = 18 + 7 = 25, поэтому x = 25 : 5 = 5.", hint:"Сначала перенеси число без x в другую часть равенства."},
    {q:"Какое число делится и на 3, и на 5?", a:["24","30","35","42"], correct:1, explain:"30 делится на 3 (30 : 3 = 10) и на 5 (30 : 5 = 6).", hint:"Число, делящееся на 5, оканчивается на 0 или 5."},
    {q:"Найди значение выражения: 2,4 × 10.", a:["0,24","2,40","24","240"], correct:2, explain:"При умножении десятичной дроби на 10 запятая переносится на один знак вправо: 24.", hint:"При умножении на 10 запятая сдвигается вправо на один разряд."},
    {q:"Периметр квадрата равен 36 см. Чему равна его сторона?", a:["6 см","8 см","9 см","12 см"], correct:2, explain:"У квадрата четыре равные стороны: 36 : 4 = 9 см.", hint:"Периметр квадрата — сумма четырёх одинаковых сторон."}
  ],
  logic: [
    {q:"У Маши было 3 яблока. Она отдала половину своих яблок брату. Как это возможно, если яблоко нельзя разделить?", a:["Отдать одно яблоко и половину другого","Отдать одно яблоко, ведь это половина от трёх с округлением","Отдать одно яблоко брату, а два оставить","Никак, условие невозможно"], correct:3, explain:"Три целых яблока нельзя разделить на две равные целые части, не разрезая яблоки. Поэтому условие невозможно." , hint:"Можно ли разделить 3 целых яблока на две равные целые части?"},
    {q:"Продолжи ряд: 2, 4, 8, 16, … Какое число следующее?", a:["18","24","30","32"], correct:3, explain:"Каждое следующее число в два раза больше предыдущего: 16 × 2 = 32.", hint:"Посмотри, во сколько раз увеличивается каждое число."},
    {q:"У четырёх братьев есть одна сестра. Сколько всего детей в семье?", a:["4","5","8","9"], correct:1, explain:"У всех четырёх братьев одна и та же сестра: 4 брата + 1 сестра = 5 детей.", hint:"Сестра у братьев общая, а не отдельная для каждого."},
    {q:"На столе лежали 5 монет. Две монеты убрали в карман. Сколько монет у тебя в кармане?", a:["0","2","3","5"], correct:1, explain:"В карман убрали две монеты — значит, там 2 монеты.", hint:"Вопрос не о том, сколько осталось на столе."},
    {q:"Улитка ползёт по столбу высотой 10 м. За день поднимается на 3 м, а за ночь сползает на 2 м. За сколько дней она доберётся до вершины?", a:["7 дней","8 дней","9 дней","10 дней"], correct:2, explain:"За полные сутки улитка продвигается на 1 м. После 8 ночей она будет на высоте 8 м, а на 9-й день доползёт до 10 м и уже не сползёт.", hint:"В день, когда улитка достигнет вершины, ночного сползания уже не будет."},
    {q:"Сколько раз цифра 5 встречается в записи чисел от 1 до 15?", a:["1","2","3","4"], correct:1, explain:"Цифра 5 встречается в числах 5 и 15 — всего два раза. Правильный ответ: 2.", hint:"Перечисли числа от 1 до 15, в записи которых есть цифра 5."}
  ]
};

let mode = "quiz";
let index = 0;
let score = 0;
let answered = false;
let currentQuestions = [];

const $ = (id) => document.getElementById(id);
const modeButtons = document.querySelectorAll(".mode-card");

function startMode(nextMode) {
  mode = nextMode;
  index = 0;
  score = 0;
  currentQuestions = questionSets[mode];
  modeButtons.forEach(button => button.classList.toggle("active", button.dataset.mode === mode));
  $("result-panel").hidden = true;
  $("question-panel")?.removeAttribute("hidden");
  document.querySelector(".question-panel").hidden = false;
  $("activity-title").textContent = mode === "quiz" ? "Математический тест" : "Логические задачи";
  $("mode-eyebrow").textContent = mode === "quiz" ? "ПРОВЕРЬ СЕБЯ" : "ВКЛЮЧИ СМЕКАЛКУ";
  $("level-pill").textContent = mode === "quiz" ? "6 КЛАСС" : "ЛОГИКА";
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const item = currentQuestions[index];
  $("question-count").textContent = `Вопрос ${index + 1} из ${currentQuestions.length}`;
  $("score-label").textContent = `Правильных ответов: ${score}`;
  $("question-number").textContent = String(index + 1).padStart(2, "0");
  $("question-text").textContent = item.q;
  $("progress-fill").style.width = `${(index / currentQuestions.length) * 100}%`;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("hint-text").hidden = true;
  $("hint-text").textContent = item.hint;
  $("hint-button").hidden = false;
  $("next-button").disabled = true;
  $("next-button").innerHTML = index === currentQuestions.length - 1 ? "Посмотреть результат <span>→</span>" : "Следующий вопрос <span>→</span>";
  $("options").innerHTML = "";
  item.a.forEach((answer, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(А_CODE + i)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = answer;
    button.addEventListener("click", () => chooseAnswer(i));
    $("options").appendChild(button);
  });
}
const А_CODE = "A".charCodeAt(0);

function chooseAnswer(choice) {
  if (answered) return;
  answered = true;
  const item = currentQuestions[index];
  const buttons = [...$("options").querySelectorAll(".option")];
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.correct) button.classList.add("correct");
    if (i === choice && choice !== item.correct) button.classList.add("wrong");
  });
  const isCorrect = choice === item.correct;
  if (isCorrect) score++;
  $("score-label").textContent = `Правильных ответов: ${score}`;
  $("feedback").textContent = isCorrect ? `Верно! ${item.explain}` : `Пока неверно. ${item.explain}`;
  $("feedback").classList.add(isCorrect ? "good" : "bad");
  $("next-button").disabled = false;
  $("hint-button").hidden = true;
}

function showResult() {
  document.querySelector(".question-panel").hidden = true;
  $("result-panel").hidden = false;
  $("progress-fill").style.width = "100%";
  $("question-count").textContent = "Тест завершён";
  $("score-label").textContent = `Правильных ответов: ${score}`;
  $("result-score").textContent = `${score} из ${currentQuestions.length}`;
  const ratio = score / currentQuestions.length;
  $("result-title").textContent = ratio === 1 ? "Безупречно!" : ratio >= .7 ? "Отличная работа!" : ratio >= .4 ? "Хороший результат!" : "Не сдавайся!";
  $("result-message").textContent = ratio === 1 ? "Ты ответил(а) правильно на все вопросы. Так держать!" : "Разбери объяснения и попробуй ещё раз — с каждой попыткой будет лучше.";
}

$("next-button").addEventListener("click", () => {
  if (!answered) return;
  if (index < currentQuestions.length - 1) {
    index++;
    renderQuestion();
  } else {
    showResult();
  }
});
$("hint-button").addEventListener("click", () => {
  $("hint-text").hidden = !$("hint-text").hidden;
});
$("restart-button").addEventListener("click", () => startMode(mode));
modeButtons.forEach(button => button.addEventListener("click", () => startMode(button.dataset.mode)));
startMode("quiz");
