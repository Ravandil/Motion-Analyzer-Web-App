const contentElement = document.getElementById('krzysztof');
const processButton = document.getElementById('process');

const interpolatedArray = [];

const proccessData = () => {
    if (typeof znalezioneDane !== 'undefined') {
        const interpolate = Smooth(znalezioneDane); // cubic Hermite spline
        //        const interpolate = Smooth(znalezioneDane, {
        //            method: 'linear'
        //        });
        const length = znalezioneDane.length; // number of frames
        interpolatedArray.length = 0;

        for (let i = 0; i < length; i += 0.1) {
            let interpolatedValue = interpolate(i);
            interpolatedArray.push(interpolatedValue);
        }
    }
}

//processButton.addEventListener('click', proccessData);
