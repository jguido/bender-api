const socket = io();
let username='user';
const botName='bender';
jQuery(document).ready($ => {
    $('#sender').on('click', () => {
        let $message = $('#message');
        const message = $message.val();
        if (message) {
            sendToBot(message);
            appendToChatDialog(message, 'human', username);
            $message.val('');
        }
    });

    const sendToBot = (message) => {
        socket.emit('chat message', message);
    };

    const appendToChatDialog = (msg, from, name, isError) => {
        $('#dialog').append(`<div class="col-12 ${from}">${name}</div>`);
        $('#dialog').append(`<div class="col-8 ${from}-border ${isError ? `alert-danger` : ''}">${msg}</div>`)
    };

    socket.on('anwser message', message => {
        console.log(message);
        appendToChatDialog(message, 'bot', botName);
    });

    socket.on('answer error', message => {
        console.log(message);
        appendToChatDialog(message, 'bot', botName, true);
    });

});
