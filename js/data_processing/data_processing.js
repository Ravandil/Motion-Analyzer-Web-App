const contentElement = document.getElementById('krzysztof');
const processButton = document.getElementById('process');

const interpolatedArray = [];
let time = 0;
let min = Infinity;
let max = -Infinity;


const proccessData = () => {
    if (typeof znalezioneDane !== 'undefined') {
        const interpolate = Smooth(znalezioneDane);         // cubic Hermite spline
        const length = znalezioneDane.length;               // number of frames
        time = length;

        for (let i = 0; i < length; i += 0.1) {
            let interpolatedValue = interpolate(i);
            interpolatedArray.push(interpolatedValue);

            if (interpolatedValue < min) {
                min = interpolatedValue;
            }
            if (interpolatedValue > max) {
                max = interpolatedValue;
            }
        }
    }
}

processButton.addEventListener('click', proccessData);
