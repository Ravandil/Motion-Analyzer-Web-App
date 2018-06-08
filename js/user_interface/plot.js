const plotData = () => {
    if (typeof znalezioneDane !== 'undefined') {
        const TESTER = document.getElementById('tester');
        const timeArray = [...new Array(interpolatedArray.length).keys()].map(x => (x * 0.1).toFixed(1));
         
        Plotly.plot( TESTER, [{
        x: [...timeArray],
        y: [...interpolatedArray] }], {
        margin: { t: 0 } } ); 
    }
};


//processButton.addEventListener('click', plotData);

