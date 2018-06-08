const dropdownForm = document.getElementById('dropdownForm');
const prepareButton = document.getElementById('prepare');
const jointsDropdown = $('#joints');
const channelsDropdown = $('#channels');

dropdownForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    szukanyJoint = jointsDropdown.val();
    szukanyChannel = channelsDropdown.val();
    znalezioneDane = getFrames(szukanyJoint, szukanyChannel);
    proccessData();
    plotData();
});

const prepareDropdowns = () => {
    if (typeof znalezioneDane !== 'undefined') {
        $('#dropdownForm').slideDown('fast');

        jointsNames.forEach(val => jointsDropdown.append(`<option value='${val}'>${val}</option>`));
        channelNames.forEach(val => channelsDropdown.append(`<option value='${val}'>${val}</option>`));
    }
};


prepareButton.addEventListener('click', prepareDropdowns);
