function bvh() {
    this.Hierarchy = "HIERARCHY";
    this.Root = "ROOT";
    this.Brace_left = "{";
    this.Brace_right = "}";
    this.Offset = "OFFSET";
    this.Channels = "CHANNELS";
    this.Joint = "JOINT";
    this.End_Site = "End"; //BVH może mieć spacje? (bo jest END SITE)
    this.Motion = "MOTION";
}
var bvh = new bvh(); //obiekt przetrzymujące stałe nazwy - kluczowe słowa np. Hierarchy, Root, Joint....

function Joint(name) { //obiekt przetrzymujący wszystkie informacje o Joincie
    this.name = name;
    this.offsetX = 0;
    this.offsetY = 0;
    this.offsetZ = 0;
    this.numberchannel = 0;
    this.channels = {}; //  słownik, kluczem jest nazwa channela np. "Xrotation" a wartością tablica floatów 
}
let Joints = {}; //słownik obiektów Joint  kluczem jest nazwa np. "Hips" a wartością jest obiekt Joint
let hierarchy = 0; //głębokość w drzewie BVH
let jointsNames = []; //pomocnicza tabela do przetrzymywania wszystkich nazw Jointów
let channelNames = []; //pomocnicza tabela do przetrzymywania wszystkich nazw Chaneli


function wczytaj() { // jak se wdusisz przycisk to sie wywoła
    var file = document.getElementById('identyfikator');
    if (file.files.length) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var file = this.result.split('\n');
            startRead(file);
            document.getElementById("Iwona").innerHTML = "Załadowano plik";
            //debugger;
        };
        reader.readAsBinaryString(file.files[0]);
    }
}

function find(key_word, line) {
    //key_word słowo które szukam, line linia w której szukam, zwraca buliona tru jeśli znalazło na pierwszym miejscu
    return line.trim().split(" ")[0] == key_word;
}

function get(line, place) { //funkcja bierze linie i miejsce z lini zwraca SŁOWO z tego miejsca albo null jesli plik jest nie poprawny
    tablica = line.trim().split(" ")
    wynik = null;
    if (tablica.length > place)
        wynik = tablica[place]
    return wynik;
}

function getLine(line) {  // bierze jedną linie, dzieli ją spacjami i wkłada do tabeli
    if (line.length == 0) {
        return null;
    }
    tablica = line.trim().split(" ");
    return tablica;
}

function startRead(file) {
// funkcja rozpoczynająca algorytm  
    let BVHiscorrect = find(bvh.Hierarchy, file[0]);
    line = ReadStructure(file, 1);
    ReadData(file, line);
}

function ReadJoint(file, current_line) {
    // przyjmuje plik i numer lini z tego pliku

    name = null;

    let BVHiscorrect = find(bvh.Joint, file[current_line]) || find(bvh.Root, file[current_line]);
    //tworzy obiekt Joint o znalezionej nazwie
    if (BVHiscorrect) {

        name = get(file[current_line], 1);
        if (name == null) {
            BVHiscorrect = false;
        } else {
            Joints[name] = new Joint(name);
            //ustaw pozycje temu Jointowi na tę kolejność która została odczytana
            jointsNames.push(name)
        }
    }
    return [BVHiscorrect, name];
    //zwraca tablice czy plik poprawny oraz nazwe stworzonego Jointa
}

function ReadBraceLeft(file, current_line) {
    let BVHiscorrect = find(bvh.Brace_left, file[current_line])
    return BVHiscorrect
}

function ReadBraceRight(file, current_line) {
    let BVHiscorrect = find(bvh.Brace_right, file[current_line])
    return BVHiscorrect
}

function ReadOffset(file, current_line, name) {
    //przyjmuje plik, numer lini oraz nazwe Jointa do którego należą te Offsety 
    let BVHiscorrect = find(bvh.Offset, file[current_line])
    //jeżeli jest BVH poprawny to sprawdza czy są poprawne offsety
    if (BVHiscorrect) {
        xoff = get(file[current_line], 1);
        yoff = get(file[current_line], 2);
        zoff = get(file[current_line], 3);
        if (xoff == null || yoff == null || zoff == null) {
            BVHiscorrect = false;
            //podstawia pod offSety przeczytane wartości
        } else {
            parsedXoff = parseFloat(xoff);
            parsedYoff = parseFloat(yoff);
            parsedZoff = parseFloat(zoff);
            if (isNaN(parsedXoff) || isNaN(parsedYoff) || isNaN(parsedZoff)) {
                BVHiscorrect = false;
            } else {
                Joints[name].offsetX = parsedXoff;
                Joints[name].offsetY = parsedYoff;
                Joints[name].offsetZ = parsedZoff;
            }
        }
    }
    return BVHiscorrect
}

function ReadChannels(file, current_line, name) {
    let BVHiscorrect = find(bvh.Channels, file[current_line]);
    if (BVHiscorrect) {
        //podstawiam liczbe która jest stringiem od zmiennej i rzutuje ją na inta
        strchannels = get(file[current_line], 1);
        intchannels = parseInt(strchannels);
        //jeśli nie podano liczby to plik nie poprawny
        if (isNaN(intchannels)) {
            BVHiscorrect = false;

            //w przeciwnym razie, wykonaj pętle tyle razy ile wskazała liczba
        } else {
            Joints[name].numberchannel = intchannels;
            for (i = 0; i < intchannels && BVHiscorrect; i++) {
                namechannel = get(file[current_line], i + 2)
                if (namechannel == null) {
                    BVHiscorrect = false;
                } else {
                    //jeżeli są poprawne to inicjuje do słownika o nazwie name słownik o nazwie namechannel
                    // i ustawia jego wartość na pustą tablicę
                    Joints[name].channels[namechannel] = [];
                    if (!channelNames.includes(namechannel)) {
                        channelNames.push(namechannel);

                    }
                }
            }
        }
    }
    return BVHiscorrect
}

function ReadEnd(file, current_line) {
    let BVHiscorrect = true;
    if (find(bvh.Joint, file[current_line])) {

        //jeśli kolejna linia jest Jointem to wywołaj tę funkcję dla dziecka
        current_line = ReadStructure(file, current_line)

    } else if (find(bvh.End_Site, file[current_line])) {
        //jeśli znaleziono end site to go zignoruj bo CHYBA nie jest istotny dla wykresów (nigdy się nie zmienia)
        //przeczytaj i  linijkę end site
        current_line++;
        if (ReadBraceLeft(file, current_line)) {

            //przeczytaj i zignoruj OFFSET END SITE linijki End Site
            current_line++;
            current_line++;
            BVHiscorrect = ReadBraceRight(file, current_line)
        }
    }
    return [BVHiscorrect, current_line];
}

function ReadStructure(file, current_line) {

    //a[1] to nazwa aktualnego Jointa
    a = ReadJoint(file, current_line)
    let BVHiscorrect = a[0]
    name = a[1]
    if (BVHiscorrect) {
        current_line++
        BVHiscorrect = ReadBraceLeft(file, current_line)
        if (BVHiscorrect) {
            hierarchy++;
            current_line++
            BVHiscorrect = ReadOffset(file, current_line, name)
            if (BVHiscorrect) {
                current_line++
                BVHiscorrect = ReadChannels(file, current_line, name)
                if (BVHiscorrect) {
                    current_line++
                    e = ReadEnd(file, current_line)
                    BVHiscorrect = e[0];
                    current_line = e[1];
                    //jeżeli następna linia będzie zamykająca to kończy się zakres aktualnego Jointa i jego dzieci
                    if (ReadBraceRight(file, current_line + 1)) {

                        current_line++;

                        let hasSister = true;
                        while (hasSister) {
                            //na tym samym poziomie hierarchi wywołuje tą funkcję dla wszystkich Jointów
                            if (!find(bvh.Joint, file[current_line + 1])) {
                                hasSister = false;
                            } else {
                                current_line++;
                                current_line = ReadStructure(file, current_line)
                            }
                        }
                    }
                }
            }
            hierarchy--;
        }
    }
    
    if (!BVHiscorrect) {
        document.getElementById("krzysztof").innerHTML = "Uprzejmie informuję, że plik podany przez Ciebie jest nie poprawny, szukaj błędu w linii " + (current_line + 1);

    }
    //funkcja zwraca mijesce w której kończy się Joint w tym jego dzieci
    return current_line
}

function ReadData(file, current_line) {
    current_line++;
    if (find(bvh.Motion, file[current_line])) {
        current_line += 3;
        endfile = false;
        while (!endfile) {
            if (file[current_line] == null) {
                endfile = true;
                break;
            }
            tablica = getLine(file[current_line])
            if (tablica == null) {
                endfile = true;
                break;
            }
            pointer=0;
            maxi = jointsNames.length;


            for (i = 0; i < maxi; i++) {
                name = jointsNames[i];
                current_joint = Joints[name]
                maxj = current_joint.numberchannel;
                for (j = 0; j < maxj; j++) {
                    strvalue=tablica[pointer];
                    floatvalue=parseFloat(strvalue);
                    allKeyes=Object.keys(current_joint.channels);
                    currentKey=allKeyes[j]
                    current_joint.channels[currentKey].push(floatvalue)
                    pointer++;
                }
            }
            current_line++;
        }
    }
}