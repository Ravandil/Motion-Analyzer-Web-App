const contentElement = document.getElementById('krzysztof');
const displayButton = document.getElementById('display');
let isFirst = true;

const proccessData = () => {
    if (isFirst) {
        isFirst = false;
        wyswietl();
    }
    if (znalezioneDane) {
        contentElement.textContent = znalezioneDane;
    }
}

displayButton.addEventListener('click', proccessData);
