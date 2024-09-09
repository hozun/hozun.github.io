// 단어 데이터 (100개)
const words = [
    { word: "dig", meaning: "(구멍을)파다" },
    { word: "pig", meaning: "돼지" },
    { word: "wig", meaning: "가발" },
    { word: "zip", meaning: "지퍼를 잠그다" },
    { word: "rip", meaning: "찢다" },
    { word: "fog", meaning: "안개" },
    { word: "jog", meaning: "조깅하다" },
    { word: "mop", meaning: "대걸레" },
];

let currentWordIndex;

// 페이지 로드 시 초기화
window.onload = function () {
    loadRandomWord();
};

// 랜덤 단어 로드
function loadRandomWord() {
    currentWordIndex = getRandomIndex();
    displayWord();
    pronounceCurrentWord();  // 다음 단어 표시 후 발음 재생
}

// 랜덤 인덱스 생성
function getRandomIndex() {
    return Math.floor(Math.random() * words.length);
}

// 단어 표시
function displayWord() {
    const currentWord = words[currentWordIndex];
    document.getElementById("koreanMeaning").innerHTML = `${currentWord.meaning} <span>&#x1F50A;</span>`;
    document.getElementById("result").innerText = "";
    document.getElementById("answer").value = "";

}

// 정답 확인
function checkAnswer() {
    const userAnswer = document.getElementById("answer").value.toLowerCase();
    const currentWord = words[currentWordIndex];

    if (userAnswer === currentWord.word) {
        document.getElementById("result").innerText = "정답입니다!";
        setTimeout(function () {
            loadRandomWord();
        }, 2000);
    } else {
        document.getElementById("result").innerText = `틀렸습니다.`;
    }

    pronounceCurrentWord();  // 정답 여부와 상관없이 발음 재생
}

// Google TTS 함수
function pronounceWord(word) {
    responsiveVoice.speak(word, 'US English Female');
}

// 현재 단어의 발음 자동 재생
function pronounceCurrentWord() {
    const currentWord = words[currentWordIndex];
    pronounceWord(currentWord.word);
}

// 엔터 키로 정답 확인
document.getElementById("answer").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
