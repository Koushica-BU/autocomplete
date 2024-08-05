let debounceTimeout;
const debounceDelay = 300;

const debounce = (func, delay) => {
    return function (...args) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
};

const searchUsers = debounce((input) => {
    const searchkey = input.value.trim().toLowerCase();
    clearResults();

    if (searchkey === "") return;

    const { Nstarts, NContains, SContains } = categorizeUsers(searchkey);
    const combinedResults = [...Nstarts, ...NContains, ...SContains];
    publishUsers(combinedResults);
}, debounceDelay);

const categorizeUsers = (searchkey) => {
    const Nstarts = [], NContains = [], SContains = [];

    userData.forEach(user => {
        const secondary = findSecondaryMatch(user, searchkey);
        const IsName = user.displayName.toLowerCase().indexOf(searchkey);

        const userObj = {
            primary: highlightMatched(user.displayName, searchkey),
            secondary: highlightMatched(secondary || user.company, searchkey)
        };

        if (IsName > -1) {
            IsName === 0 ? Nstarts.push(userObj) : NContains.push(userObj);
        } else if (secondary) {
            SContains.push(userObj);
        }
    });

    return { Nstarts, NContains, SContains };
};

const findSecondaryMatch = (user, searchkey) => {
    const { email, company, address, phone } = user;
    const searchFields = [email, company, address, phone].map(field => field.toLowerCase());
    return searchFields.find(field => field.includes(searchkey)) || '';
};

const publishUsers = (users) => {
    const result = document.getElementById("result");
    const html = users.map(user => createUserHtml(user)).join('');
    result.innerHTML = html;
};

const createUserHtml = (user) => {
    return `
        <div class='kbu-user-wrap'>
            <div class='userimg'><img src='http://placehold.it/32x32'></div>
            <div class='user-desc'> 
                <span>${user.primary}</span>
                <p>${user.secondary}</p>
            </div>
        </div>
    `;
};

const highlightMatched = (content, searchkey) => {
    if (!content) return '';
    const regex = new RegExp(`(${searchkey})`, "gi");
    return content.replace(regex, `<em class="highlight">$1</em>`);
};

const clearResults = () => {
    const result = document.getElementById("result");
    result.innerHTML = "";
};
