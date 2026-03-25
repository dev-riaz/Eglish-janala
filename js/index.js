const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`)
    return (htmlElements.join(" "));

};
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
};

const manegeSpinner = (status) => {
    if (status === true) {
        document.getElementById('spinner').classList.remove('hidden')
        document.getElementById('word-container').classList.add('hidden')
    } else {
        document.getElementById('word-container').classList.remove('hidden')
        document.getElementById('spinner').classList.add('hidden')

    }
}

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLessons(json.data)
        )


};

const removeActive = () => {
    const lessonButton = document.querySelectorAll('.lesson-btn')
    // console.log(lessonButton);
    lessonButton.forEach((btn) => btn.classList.remove('active'));

}
// removeBtn()
const loadLevelWords = (id) => {
    manegeSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive()
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("active")

            displayLevelWords(data.data)
        }
        )

};
const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    console.log(url);
    const res = await fetch(url)
    const details = await res.json();
    displayWordDetails(details.data);

}

// {
//     "word": "Cautious",
//     "meaning": "সতর্ক",
//     "pronunciation": "কশাস",
//     "level": 2,
//     "sentence": "Be cautious while crossing the road.",
//     "points": 2,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "careful",
//         "alert",
//         "watchful"
//     ],
//     "id": 3
// }

const displayWordDetails = (word) => {
    console.log(word);
    const detailsCard = document.getElementById('details-container');
    detailsCard.innerHTML = `
     <div class="">
                        <h2 class="flex items-center text-xl font-bold">${word.word}(<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-bold">Meaning</h4>
                        <p class="font-bangla">${word.meaning}</p>
                    </div>
                    <div class="space-y-2">
                        <h3 class="font-bold">Example</h3>
                        <p>${word.sentence}</p>
                    </div>
                    <div class="space-y-2">
                        <p class="font-semibold font-bangla">সমার্থক শব্দ গুলো</p>
                        <div class="">${createElements(word.synonyms)}</div>
                    </div>
    
    `;
    document.getElementById('my_modal_5').showModal()

}

const displayLevelWords = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';
    if (words.length == 0) {
        wordContainer.innerHTML = `<div class="text-center col-span-full">
                <p>এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2>একটি Lesson Select করুন।</h2>
            </div>`;
        manegeSpinner(false)
        return;
    }
    words.forEach(word => {
        const cardDiv = document.createElement('div');
        cardDiv.innerHTML = `
     <div class="bg-white text-center py-7 px-3 shadow-sm rounded-xl space-y-5">
                    <h2 class="text-2xl font-bold">${word.word}</h2>
                    <p class="text-[16px] font-semibold">Meaning /Pronunciation</p>
                    <p class="font-bangla font-semibold text-[#18181B]">${word.meaning}/${word.pronunciation}</p>
                    <div class="flex justify-between items-center">
                        <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF90]"><i class="fa-solid fa-circle-info"></i></button>
                        <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF90]"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                </div>
    `;
        wordContainer.appendChild(cardDiv)
    });
    manegeSpinner(false)

}


const displayLessons = (lessons) => {
    // 1. get the container & empty
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";

    // 2 . get into every lessons
    for (let lesson of lessons) {
        //  3. create element 
        // console.log(lesson);

        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWords(${lesson.level_no})" class="btn btn-soft btn-primary border border-[#422AD5] lesson-btn"><i
                                    class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}</button>
            `;
        // 4. appendChild into container
        levelContainer.appendChild(btnDiv)
    }

}
loadLessons();

document.getElementById('btn-search').addEventListener('click', () => {
    removeActive()
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);
    fetch('https://openapi.programming-hero.com/api/words/all')
        .then(res => res.json())
        .then(data => {
            const allWords = data.data;
            console.log(allWords);
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue)
            );
            displayLevelWords(filterWords)
        });


})
