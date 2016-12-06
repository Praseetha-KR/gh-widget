/**
 * gh-widget for rendering github profile
 * v0.0.1
 */

const GITHUB_LOGO = `<svg aria-hidden="true" class="octicon octicon-mark-github" height="18" version="1.1" viewBox="0 0 16 16" width="18"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>`;


function renderTemplate(prefix, data) {
    var tpl = `<div class="${prefix}">
        <a class="${prefix}__link" href="${data.profile_link}" target="_blank">
            <div class="${prefix}__user">
                <div class="${prefix}__user__pic">
                    <img class="${prefix}__avatar" src="${data.avatar}" alt="github">
                </div>
                <div class="${prefix}__user__info">
                    <div class="${prefix}__name">${data.name}</div>
                    <div class="${prefix}__username">@${data.username}</div>
                    <div class="${prefix}__logo">${GITHUB_LOGO}</div>
                </div>
            </div>
            <div class="${prefix}__status">
                <div class="${prefix}__status__item">
                    <div class="${prefix}__repos ${prefix}__status__count">${data.repos}</div>
                    <div class="${prefix}__status__label">Repos</div>
                </div>
                <div class="${prefix}__status__item">
                    <div class="${prefix}__followers ${prefix}__status__count">${data.followers}</div>
                    <div class="${prefix}__status__label">Followers</div>
                </div>
                <div class="${prefix}__status__item">
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
