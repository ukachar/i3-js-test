let currentSlide = 0;
let checkAnswersButtonExists = 0;
const alertBox = document.querySelector('.alert')
const mainContainer = document.getElementById('main')

const pitanja = [
    { pitanje: "Koja je ekstenzija za JavaScript datoteke?", broj: 1 },
    { pitanje: "Tko je napravio React?", broj: 2 },
    { pitanje: "Za što je kratica 'MERN'?", broj: 3 },
    { pitanje: "Koja je trenutna verzija EcmaScript-a?", broj: 4 }
]
let odgovori = {
    "Question 1": [],
    "Question 2": [],
    "Question 3": [],
    "Question 4": [],
}

const brojOdgovora = () => {
    return (Math.floor(Math.random() * 7) + 2)
}

const kreirajSlide = (pitanje) => {

    let odgovoriArr = [];

    for (let i = 0; i < brojOdgovora(); i++) {
        odgovoriArr.push(i)
    }

    mainContainer.innerHTML += `
    
        <div id="slide${pitanje.broj}" class="slide inactive-slide" data-question='Question ${pitanje.broj}'>
            <h1>${pitanje.pitanje}</h1>
         <div class="odgovori-container" id="odgovori-container${pitanje.broj}"></div>
        </div>
        
        `
    const odgovoriContainer = document.getElementById(`odgovori-container${pitanje.broj}`)
    odgovoriArr.forEach(el => {
        odgovoriContainer.innerHTML += `
        <input name='pitanje${pitanje.broj}' type="checkbox" id='s${pitanje.broj}c${odgovoriArr[el] + 1}' 
        class='check-button' value='${el + 1}'/>
        <label for='s${pitanje.broj}c${odgovoriArr[el] + 1}'>${el + 1} </label>
        
 `
    })

    const slajd = document.getElementById(`slide${pitanje.broj}`)
    slajd.innerHTML += `
    <div class="nav-buttons">
        <button onclick="prosliSlide()" class="previous-slide-button">Previous slide</button>
        <button class="next-slide-button" onclick="sljedeciSlide()">Next slide</button>
    </div>`

}

const prikaziSlide = (slide) => {
    const slides = document.querySelectorAll('.slide')
    const previousSlideButton = document.querySelectorAll('.previous-slide-button');
    const nextSlideButton = document.querySelectorAll('.next-slide-button');
    const lastSlide = slides[slides.length - 1];

    const checkAnswersButton = document.createElement("div");
    checkAnswersButton.classList.add("check-answers-button");
    checkAnswersButton.innerHTML = `<button id="show-answers" disabled onclick="prikaziOdgovore()">Check Answers</button>`


    if (checkAnswersButtonExists === 0) {
        lastSlide.appendChild(checkAnswersButton)
        checkAnswersButtonExists = 1
    } else {
        //ništa
    }

    currentSlide = slide;

    slides.forEach(el => {
        el.classList.remove('current-slide');
        slides[slide].classList.add('current-slide');
        el.classList.add('inactive-slide')
        slides[slide].classList.remove('inactive-slide');
    })


    if (currentSlide === 0) {
        previousSlideButton.forEach(el => {
            el.style.display = 'none';
        });


    }
    else {
        previousSlideButton.forEach(el => {
            el.style.display = 'inline-block';
        })
    }
    if (currentSlide === 3) {
        nextSlideButton.forEach(el => {
            el.style.display = "none"
        });
        checkAnswersButton.style.display = 'inline-block';
    }
    else {
        nextSlideButton.forEach(el => {
            el.style.display = 'inline-block';
        })

    }
}

const tester = (slide) => {
    const checkboxes = document.querySelectorAll(`input[type=checkbox][name=pitanje${slide}]`);
    const showAnswersButton = document.getElementById('show-answers')
    const slideDiv = document.querySelectorAll(".slide")
    let lastChecked;

    checkboxes.forEach(el => {
        el.addEventListener('change', e => {
            let brojCheckova = 0;

            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    brojCheckova = brojCheckova + 1;
                    lastChecked = e.target
                }
            }

            //PROVJERA KOLIKO JE MOGUĆIH ODGOVORA

            if (brojCheckova > 0) {
                document.getElementById(`question-${slide}`).style.background = "green"
                if (brojCheckova > slide + 2) {
                    alertBox.style.display = "flex";
                    setTimeout(() => alertBox.style.display = "none", 3000)
                    for (let x = 0; x < checkboxes.length; x++) {
                        if (checkboxes[x].value === e.target.value) e.target.checked = false
                    }
                }
            } else {
                document.getElementById(`question-${slide}`).style.background = "#3a3a3a"
            }


            //PROVJERA DA LI JE BAREM JEDAN ODGOVOR ODABRAN NA SVAKOM SLAJDU POMOĆU BACKGROUND-A

            let allGroupsChecked = true;

            slideDiv.forEach((group) => {
                const checkboxes = group.querySelectorAll('input[type="checkbox"]');
                let atLeastOneChecked = false;

                checkboxes.forEach((checkbox) => {
                    if (checkbox.checked) {
                        atLeastOneChecked = true;
                    }
                });

                if (!atLeastOneChecked) {
                    allGroupsChecked = false;
                    showAnswersButton.disabled = true;
                }
            });

            if (allGroupsChecked) {
                showAnswersButton.disabled = false;
            }

        });
    })
}

const prosliSlide = () => {
    prikaziSlide(currentSlide - 1)
}

const sljedeciSlide = () => {
    prikaziSlide(currentSlide + 1)
}

const prikaziOdgovore = () => {
    const slideDiv = document.querySelectorAll(".slide")
    const resultsDiv = document.getElementById("results")

    slideDiv.forEach((group) => {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {

            if (checkbox.checked) {
                odgovori[group.dataset.question] += checkbox.value;
            }
        });
        resultsDiv.style.display = "flex";

        resultsDiv.innerHTML = ` 
            <h2>Results<h2>
            Question 1: ${Object.values(odgovori["Question 1"]).join(",")} <br/>
            Question 2: ${Object.values(odgovori["Question 2"]).join(",")}<br/>
            Question 3: ${Object.values(odgovori["Question 3"]).join(",")}<br/>
            Question 4: ${Object.values(odgovori["Question 4"]).join(",")}<br/>
        `

    });



}

const generirajQuiz = () => {
    pitanja.forEach(el => {
        kreirajSlide(el)
    }
    )

    prikaziSlide(0);
    tester(1)
    tester(2)
    tester(3)
    tester(4)
}

generirajQuiz();





