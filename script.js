var button = null;
var canvas = null;
var context = null;
var card_template_index = null;
var card_template = null;
function init() {
    button = document.getElementById("download_button");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    button.addEventListener('click', function (e) {
        button.href = canvas.toDataURL('image/png');
        button.download = "hunter card.png";
    });
}
function load_card_template(index, callback) {
    if (index !== parseInt(index, 10) || 1 > index || index > 5)
        throw "Invalid card index";
    card_template_index = index;
    card_template = new Image();
    card_template.onload = callback;
    card_template.src = "huntercard_img0" + index + ".jpg";
}
var card_template_drawn = false;
function draw_card_template(index) {
    card_template_drawn = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    load_card_template(index, function () { context.drawImage(card_template, 0, 0, 760, 993); card_template_drawn = true; });
}
function wait(trial, expected_value, check_interval, callback) {
    while (trial() !== expected_value) {
        setTimeout(function () { wait(trial, expected_value, check_interval, callback); }, check_interval);
        return;
    } callback();
}

function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {
    fitWidth = fitWidth || 0;
    if (fitWidth <= 0) {
        context.fillText(text, x, y);
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0, idx).join(' ');
        var w = context.measureText(str).width;
        if (w > fitWidth) {
            if (idx == 1) {
                idx = 2;
            }
            context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
            currentLine++;
            words = words.splice(idx - 1);
            idx = 1;
        }
        else { idx++; }
    }
    if (idx > 0)
        context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
}

function print_info(index, name, gender, weapon_list, play_time_weekday, play_time_weekend, play_style, comment) {
    if (index != card_template_index)
        draw_card_template(index);
    else {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(card_template, 0, 0, 760, 993);
    }
    wait(function () { return card_template_drawn; }, true, 100, function () {
        context.beginPath();
        context.font = "40px Helvetica";
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(name, 250, 220);
        context.fillText(gender, 625, 220);
        context.fillText(play_time_weekday, 285, 615);
        context.fillText(play_time_weekend, 285, 665);
        context.fillText(play_style, 610, 635);
        if (comment.length > 13) {
            if (comment.length / 13 > 4)
                context.fillText("请不要超过52个中文字符。", 292, 852, 550);
            else {
                const upper = 790, lower = 970, line_h = 38;
                var line = Math.ceil(comment.length / 13);
                var margin = ((lower - upper) - line * line_h) / (line + 1);
                for (var i = 0; i < line; i++)
                    context.fillText(comment.substr(i * 13, 13), 292, upper + margin * (i + 1) + i * line_h, 550);
            }
        } else
            context.fillText(comment, 292, 852, 550);
        for (var i = 0; i < 14; i++) {
            if (weapon_list[i]) {
                context.beginPath();
                context.arc(80 + 99 * (i % 7), 370 + 100 * Math.floor(i / 7), 45, 0, 2 * Math.PI, false);
                context.fillStyle = 'transparent';
                context.fill();
                context.lineWidth = 5;
                context.strokeStyle = '#000000';
                context.stroke();
            }
        }
    });
}