import $ from 'jquery';

$(document).ready(() => {
    console.log('Hello! Testasdf!');
    generatePlayer();
});

function generatePlayer() {
    const d = document.createElement("div");
    $(d).addClass("player");
    $('#container').append(d);
}

export function changeText() {
    $("#potato").text("Hello");
}
