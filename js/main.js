const apiKey = '9f2b25398e2c423e8e3152545232404';
const form = document.querySelector('.form');
const inputCity = document.querySelector('.form__input');
const containerForCards = document.querySelector('.main .container');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let cityName = inputCity.value.trim();

    const data = await getDataWeather(cityName);

    if(data.error) {

        addErrorCard();  

    } else {

        const russianData = await getRussianLanguage();

        const conditionsRus = russianData.find((el) => el.code === data.current.condition.code);
        const conditionRus = data.current.is_day ? conditionsRus.languages[23]['day_text'] : conditionsRus.languages[23]['night_text'];

        const dataForCard = {
            location: data.location.name,
            country: data.location.country,
            degree: Math.round(data.current.temp_c),
            feel: Math.round(data.current.feelslike_c),
            condition: conditionRus,
            icon: data.current.condition.icon,
            wind: data.current.wind_kph,
            pressure: (data.current.pressure_mb * 0.75006156).toFixed(),
        }

        deleteCard();
    
        addCard(dataForCard);
    }
    
})

async function getDataWeather(cityName) {

    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function addCard(dataForCard) {
    const cardTemplate = `<div class="card">
                            <div class="card__city">${dataForCard.location} (${dataForCard.country})</div>
                            <div class="card__weather">
                                <div class="card__icon">
                                    <img src="${dataForCard.icon}" alt="">
                                </div>
                                <div class="card__numbers">
                                    <div class="card__degree">${dataForCard.degree}&deg</div>
                                    <div class="card__feel">Ощущается: ${dataForCard.feel}&deg</div>
                                </div>
                            </div>
                            <div class="card__condition">${dataForCard.condition}</div>
                            <div class="card__options">
                                <div class="card__wind">Ветер: ${dataForCard.wind} км/ч</div>
                                <div class="card__pressure">Давление: ${dataForCard.pressure} мм рт. ст.</div>
                            </div>
                        </div>`
    
    containerForCards.insertAdjacentHTML('afterbegin', cardTemplate);

    inputCity.value = '';
    inputCity.focus();
}

function deleteCard() {
    const card = document.querySelector('.card');

    if(card) {
        card.remove();
    }
}

function addErrorCard() {
    deleteCard();

    const errorCard = `<div class="card"><p>Такого города не существует. Проверьте правильность написания или выберите другой город.</p></div>`;
    containerForCards.insertAdjacentHTML('afterbegin', errorCard);

    inputCity.value = '';
    inputCity.focus();
}

async function getRussianLanguage() {
    const url = 'https://www.weatherapi.com/docs/conditions.json';

    const response = await fetch(url);
    const russianData = await response.json();
    return russianData;
}

