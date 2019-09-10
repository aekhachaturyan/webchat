const min = 1, max = 6;
const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

let msgStyle = null;
switch (randomNum) {
    case 1:
        msgStyle = 'secondary';
        break;
    case 2:
        msgStyle = 'danger';
        break;
    case 3:
        msgStyle = 'success';
        break;
    case 4:
        msgStyle = 'warning';
        break;
    case 5:
        msgStyle = 'info';
        break;
    case 6:
        msgStyle = 'light';
}