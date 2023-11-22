// 단어 데이터 (100개)
const words = [
    { word: "dog", meaning: "개" },
    { word: "cat", meaning: "고양이" },
    { word: "sun", meaning: "태양" },
    { word: "moon", meaning: "달" },
    { word: "tree", meaning: "나무" },
    { word: "book", meaning: "책" },
    { word: "ball", meaning: "공" },
    { word: "rain", meaning: "비" },
    { word: "fire", meaning: "불" },
    { word: "wind", meaning: "바람" },
    { word: "fish", meaning: "물고기" },
    { word: "love", meaning: "사랑" },
    { word: "home", meaning: "집" },
    { word: "time", meaning: "시간" },
    { word: "song", meaning: "노래" },
    { word: "baby", meaning: "아기" },
    { word: "star", meaning: "별" },
    { word: "work", meaning: "일" },
    { word: "rainbow", meaning: "무지개" },
    { word: "light", meaning: "빛" },
    { word: "smile", meaning: "미소" },
    { word: "color", meaning: "색" },
    { word: "money", meaning: "돈" },
    { word: "happy", meaning: "행복" },
    { word: "child", meaning: "어린이" },
    { word: "glass", meaning: "유리" },
    { word: "cloud", meaning: "구름" },
    { word: "peace", meaning: "평화" },
    { word: "heart", meaning: "마음" },
    { word: "ocean", meaning: "바다" },
    { word: "night", meaning: "밤" },
    { word: "apple", meaning: "사과" },
    { word: "water", meaning: "물" },
    { word: "phone", meaning: "전화기" },
    { word: "music", meaning: "음악" },
    { word: "flower", meaning: "꽃" },
    { word: "earth", meaning: "지구" },
    { word: "bread", meaning: "빵" },
    { word: "sleep", meaning: "잠" },
    { word: "house", meaning: "집" },
    { word: "watch", meaning: "시계" },
    { word: "fruit", meaning: "과일" },
    { word: "cloudy", meaning: "흐린" },
    { word: "chair", meaning: "의자" },
    { word: "peaceful", meaning: "평화로운" },
    { word: "pencil", meaning: "연필" },
    { word: "happy", meaning: "행복한" },
    { word: "quick", meaning: "빠른" },
    { word: "study", meaning: "공부" },
    { word: "strong", meaning: "강한" },
    { word: "candy", meaning: "사탕" },
    { word: "mountain", meaning: "산" },
    { word: "computer", meaning: "컴퓨터" },
    { word: "sunny", meaning: "맑은" },
    { word: "travel", meaning: "여행" },
    { word: "friend", meaning: "친구" },
    { word: "cool", meaning: "시원한" },
    { word: "jungle", meaning: "정글" },
    { word: "morning", meaning: "아침" },
    { word: "mirror", meaning: "거울" },
    { word: "movie", meaning: "영화" },
    { word: "cookie", meaning: "쿠키" },
    { word: "laughter", meaning: "웃음" },
    { word: "dream", meaning: "꿈" },
    { word: "holiday", meaning: "휴일" },
    { word: "family", meaning: "가족" },
    { word: "garden", meaning: "정원" },
    { word: "hobby", meaning: "취미" },
    { word: "magic", meaning: "마법" },
    { word: "season", meaning: "계절" },
    { word: "thunder", meaning: "천둥" },
    { word: "spring", meaning: "봄" },
    { word: "summer", meaning: "여름" },
    { word: "autumn", meaning: "가을" },
    { word: "winter", meaning: "겨울" },
    { word: "juice", meaning: "주스" },
    { word: "dance", meaning: "춤" },
    { word: "famous", meaning: "유명한" },
    { word: "happy", meaning: "행복한" },
    { word: "surprise", meaning: "놀람" },
    { word: "cake", meaning: "케이크" },
    { word: "guitar", meaning: "기타" },
    { word: "game", meaning: "게임" },
    { word: "picture", meaning: "사진" },
    { word: "visit", meaning: "방문" },
    { word: "beach", meaning: "해변" },
    { word: "map", meaning: "지도" },
    { word: "forest", meaning: "숲" },
    { word: "planet", meaning: "행성" },
    { word: "raincoat", meaning: "비옷" },
    { word: "train", meaning: "기차" },
    { word: "camping", meaning: "캠핑" },
    { word: "keyboard", meaning: "키보드" },
    { word: "piano", meaning: "피아노" },
    { word: "robot", meaning: "로봇" },
    { word: "glasses", meaning: "안경" },
    { word: "science", meaning: "과학" },
    { word: "history", meaning: "역사" },
    { word: "telephone", meaning: "전화" },
    { word: "camera", meaning: "카메라" },
    { word: "sweater", meaning: "스웨터" },
    { word: "holiday", meaning: "휴일" },
    { word: "basket", meaning: "바구니" },
    { word: "balloon", meaning: "풍선" },
    { word: "mountain", meaning: "산" },
    { word: "lake", meaning: "호수" },
    { word: "umbrella", meaning: "우산" },
    { word: "jacket", meaning: "자켓" },
    { word: "bicycle", meaning: "자전거" },
    { word: "tiger", meaning: "호랑이" },
    { word: "zoo", meaning: "동물원" },
    { word: "garden", meaning: "정원" },
    { word: "ghost", meaning: "유령" },
    { word: "spider", meaning: "거미" },
    { word: "candle", meaning: "초" },
    { word: "mirror", meaning: "거울" },
    { word: "sunglasses", meaning: "선글라스" },
    { word: "clown", meaning: "광대" },
    { word: "popcorn", meaning: "팝콘" },
    { word: "magic", meaning: "마법" },
    { word: "circus", meaning: "서커스" },
    { word: "dragon", meaning: "용" },
    { word: "robot", meaning: "로봇" },
    { word: "alien", meaning: "외계인" },
    { word: "planet", meaning: "행성" },
    { word: "astronaut", meaning: "우주비행사" },
    { word: "rocket", meaning: "로켓" },
    { word: "universe", meaning: "우주" },
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
    document.getElementById("koreanMeaning").innerText = `뜻: ${currentWord.meaning}`;
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
