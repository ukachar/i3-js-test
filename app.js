const alertBox = document.querySelector('.alert')
const mainContainer = document.getElementById('main')
const sidebarContainer = document.querySelector('.sidebar')

const config = {
    brojPitanja: 5,
    odgovori: {},
    sidebar: {
        class: "question",
        id(pitanje) {
            return `question-${pitanje}`
        },
        onClick(pitanje) {
            return `prikaziSlide(${pitanje})`
        },
        brojSlide(pitanje) {
            return pitanje + 1
        }
    },
    checkAnswersButtonExists: 0,
    currentSlide: 0
}

const kreirajSlide = (pitanje) => {
    let odgovoriArr = [];
    for (let i = 0; i < (config.brojPitanja + 5); i++) {
        odgovoriArr.push(i)
    }

    mainContainer.innerHTML += `
        <div id="slide${pitanje}" class="slide inactive-slide" data-question='Question ${pitanje}'>
            <h1>Pitanje ${pitanje}</h1>
         <div class="odgovori-container" id="odgovori-container${pitanje}"></div>
        </div>
        `
    const odgovoriContainer = document.getElementById(`odgovori-container${pitanje}`)
    odgovoriArr.forEach(el => {
        odgovoriContainer.innerHTML += `
        <input name='pitanje${pitanje}' type="checkbox" id='s${pitanje}c${odgovoriArr[el] + 1}' 
        class='check-button' value='${el + 1}'/>
        <label for='s${pitanje}c${odgovoriArr[el] + 1}'>${el + 1} </label>   
 `
    })

    const slajd = document.getElementById(`slide${pitanje}`)
    slajd.innerHTML += `
    <div class="nav-buttons">
        <button onclick="prosliSlide()" class="previous-slide-button">Previous slide</button>
        <button class="next-slide-button" onclick="sljedeciSlide()">Next slide</button>
    </div>`

    //Kreiranje slajda na sidebar-u

    const sidebarItem = document.createElement("div");
    sidebarItem.classList.add(config.sidebar.class);
    sidebarItem.setAttribute("id", config.sidebar.id(pitanje));
    sidebarItem.setAttribute("onclick", `prikaziSlide(${pitanje - 1})`)
    sidebarItem.innerText = (pitanje)
    sidebarContainer.appendChild(sidebarItem)
}

const prikaziSlide = (slide) => {
    const slides = document.querySelectorAll('.slide')
    const previousSlideButton = document.querySelectorAll('.previous-slide-button');
    const nextSlideButton = document.querySelectorAll('.next-slide-button');
    const lastSlide = slides[slides.length - 1];

    const checkAnswersButton = document.createElement("div");
    checkAnswersButton.classList.add("check-answers-button");
    checkAnswersButton.innerHTML = `<button id="show-answers" disabled onclick="prikaziOdgovore()">Check Answers</button>`


    if (config.checkAnswersButtonExists === 0) {
        lastSlide.appendChild(checkAnswersButton)
        config.checkAnswersButtonExists = 1
    }

    config.currentSlide = slide;

    slides.forEach(el => {
        el.classList.remove('current-slide');
        slides[slide].classList.add('current-slide');
        el.classList.add('inactive-slide')
        slides[slide].classList.remove('inactive-slide');
    })


    if (config.currentSlide === 0) {
        previousSlideButton.forEach(el => {
            el.style.display = 'none';
        });

    }
    else {
        previousSlideButton.forEach(el => {
            el.style.display = 'inline-block';
        })
    }
    if (config.currentSlide === (config.brojPitanja - 1)) {
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

    checkboxes.forEach(el => {
        el.addEventListener('change', e => {
            let checkboxesCount = 0;

            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    checkboxesCount = checkboxesCount + 1;
                    lastChecked = e.target
                }
            }
            //PROVJERA KOLIKO JE MOGUĆIH ODGOVORA

            if (checkboxesCount > 0) {
                document.getElementById(`question-${slide}`).style.background = "green"
                if (checkboxesCount > slide + 2) {
                    alertBox.style.display = "flex";
                    setTimeout(() => alertBox.style.display = "none", 3000)
                    for (let x = 0; x < checkboxes.length; x++) {
                        if (checkboxes[x].value === e.target.value) e.target.checked = false
                    }
                }
            } else {
                document.getElementById(`question-${slide}`).style.background = "#3a3a3a"
            }


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
    prikaziSlide(config.currentSlide - 1)
}

const sljedeciSlide = () => {
    prikaziSlide(config.currentSlide + 1)
}

const prikaziOdgovore = () => {
    const slideDiv = document.querySelectorAll(".slide")
    const resultsDiv = document.getElementById("results")

    slideDiv.forEach((group) => {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        config.odgovori[group.dataset.question] = []

        checkboxes.forEach((checkbox) => {

            if (checkbox.checked) {
                config.odgovori[group.dataset.question].push(checkbox.value);
            }
        });
        resultsDiv.style.display = "flex";
    });

    Object.entries(config.odgovori).forEach(entry => {
        const [key, value] = entry;
        console.log(key, value);
        resultsDiv.innerHTML += `${key}: ${value.join(",")} <br/>`
    });
}

const generirajQuiz = () => {
    for (let i = 0; i < (config.brojPitanja); i++) {
        kreirajSlide(i + 1)
    }

    prikaziSlide(0);

    for (let i = 0; i < (config.brojPitanja); i++) {
        tester(i + 1)
    }
}

generirajQuiz();





