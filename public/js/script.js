const socket = io();
let username='user';
const botName='bender';
const stickToEnd = function () {
    document.getElementById('dialog').scrollTop = document.getElementById('dialog').scrollHeight
};
jQuery(document).ready($ => {
    socket.on('holdOn', () => {
        $('#dialog').append(`<div id="botIsThinking" class="col-8 bot">...</div>`);
        stickToEnd();
    });
    socket.on('holdOff', () => {
        $('#botIsThinking').remove();
        stickToEnd();

    });
    $('#dialogForm').on('submit', (e) => {
        e.preventDefault();
        let $message = $('#message');
        const message = $message.val();
        if (message) {
            sendToBot(message);
            appendToChatDialog(message, 'human', username);
            $message.val('');
        }
        stickToEnd();
    });

    const sendToBot = (message) => {
        socket.emit('chat message', message);
    };

    const appendToChatDialog = (msg, from, name, isError) => {
        if (msg.constructor === Array) {
            msg = mapToResponse(msg)
        }
        $('#dialog').append(`<div class="col-12 ${from}">${name}</div>`);
        $('#dialog').append(`<div class="col-8 ${from}-border ${isError ? `alert-danger` : ''}">${msg}</div>`);
        stickToEnd();
    };

    const mapToResponse = (responses) => {
        return responses.map(response => {
            let title, link, author, picture;
            if (response.title) {title = response.title;}
            if (response.link) {link = response.link;}
            if (response.author_name) {author = response.author_name;}
            if (response.author_icon) {picture = response.author_icon;}

            return '<div><p><a href="'+link+'">'+title+'</a></p><p>'+author+'</p></div>'
        })
    };

    socket.on('answer message', message => {
        appendToChatDialog(message, 'bot', botName);
    });

    socket.on('answer error', message => {
        appendToChatDialog(message, 'bot', botName, true);
    });

});
