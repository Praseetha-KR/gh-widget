/**
 * gh-widget for rendering github profile
 * v0.0.1
 */

function renderTemplate(prefix, data) {
    var tpl = `<div class="${prefix}">
        <a class="${prefix}__link" href="${data.profile_link}" target="_blank">
            <div class="${prefix}__user">
                <div class="${prefix}__user__pic">
                    <img class="${prefix}__avatar" src="${data.avatar}" alt="github">
                </div>
                <div class="${prefix}__user__info">
                    <div class="${prefix}__name">${data.name}</div>
                    <div class="${prefix}__username">${data.username}</div>
                </div>
            </div>
            <div class="${prefix}__status">
                <div class="${prefix}__status__box">
                    <div class="${prefix}__repos ${prefix}__status__count">${data.repos}</div>
                    <div class="${prefix}__status__label">Repos</div>
                </div>
                <div class="${prefix}__status__box">
                    <div class="${prefix}__followers ${prefix}__status__count">${data.followers}</div>
                    <div class="${prefix}__status__label">Followers</div>
                </div>
                <div class="${prefix}__status__box">
                    <div class="${prefix}__following ${prefix}__status__count">${data.following}</div>
                    <div class="${prefix}__status__label">Following</div>
                </div>
            </div>
        </a>
    </div>`;
    return tpl;
}

function formatData(result) {
    var data = {
        name: result.name,
        username: result.login,
        avatar: result.avatar_url,
        profile_link: result.html_url,
        repos: result.public_repos,
        followers: result.followers,
        following: result.following
    }
    return data;
}

function createWidget(data) {
    var baseNode = '.gh-widget',
        prefix = 'ghw';

    var baseNode = document.querySelector(baseNode);
    var tpl = renderTemplate(prefix, data);
    baseNode.innerHTML = tpl;
}

function listener() {
    var result = JSON.parse(this.response);
    var data = formatData(result);
    createWidget(data);
}

function fetchGithubProfile(username, prefix) {
    var req = new XMLHttpRequest();
    req.addEventListener('load', listener);
    req.open('GET', 'https://api.github.com/users/' + username);
    req.send();
    return;
}

function init() {
    var baseNode = document.querySelector('.gh-widget');
    var username = baseNode.getAttribute('data-username') || 'octocat';

    fetchGithubProfile(username);
}

init();
