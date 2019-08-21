import $ from 'jquery';

$(document).ready(() => {
    console.log('Hello! Testasdf!');
});

export function changeText() {
    $("#potato").text("Hello");
}
