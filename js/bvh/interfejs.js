//getFrames przyjmuje nazwę joint_name i channel_name, zwraca wszystkie wartości channel_name Jointa
//wszystkie możliwe nazwy channel_name są w tablicy channelNames
//wszystkie możliwe nazwy joint_name są w tablicy jointNames
//przykładowe wywołanie: getFrames("Hips", "Xrotation") lub getFrames(jointNames[0], channelNames[2])
function getFrames(joint_name, channel_name) {
    if (Joints[joint_name] == null) {
        console.log("Nie ma Jointa o takiej nazwie ");
        return null;
    } else if (Joints[joint_name].channels[channel_name] == null) {
        console.log("Nie ma Channela o takiej nazwie dla Jointa o podanej nazwie: ");
        return null;
    } else {
        return Joints[joint_name].channels[channel_name]
    }
}



function wyswietl() {
    if (Object.keys(Joints).length == 0) {
        document.getElementById("krzysztof").innerHTML = "Jeszcze nie wczytano pliku"
    } else {
        szukanyJoint = jointsNames[0];
        szukanyChannel = channelNames[0];
        znalezioneDane = getFrames(szukanyJoint, szukanyChannel);

        document.getElementById("krzysztof").innerHTML =
            szukanyJoint + ", " +
            szukanyChannel + ", " +
            (znalezioneDane == null ? "" : "Znaleziono tablicę o długości " + znalezioneDane.length) +
            "<br/>"
    }
}
