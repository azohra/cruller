const { assert } = require('chai');
const get = require('lodash.get');
const { getScope } = require('../../utils');

/**
 * Function to set a cookie on the current page
 * @param {string} name The name of the cookie
 * @param {string|number} value The value of the cookie
 */
const setCookie = async (name, value) => {
    const scope = getScope();
    const { currentPage } = scope.context;
    return await currentPage.setCookie({ name, value });
};

/**
 * Function to get a cookie from the current page
 * @param {string} name The name of the cookie
 * @param {string|number} value The value of the cookie
 */
const getCookie = async (name, value) => {
    const scope = getScope();
    const { currentPage } = scope.context;
    const cookies = await currentPage.cookies();
    const cookie = cookies.filter(c => c.name === name);
    assert.notEqual(cookie.length, 0);
    assert.equal(get(cookie, '[0].value'), value);
    return;
};

/**
 * Function to delete a cookie
 * @param {string} name The name of the cookie
 */
const deleteCookie = async name => {
    const scope = getScope();
    const { currentPage } = scope.context;
    return await currentPage.deleteCookie({
        name,
    });
};

/**
 * Function to set cookies based on a data table input
 * @param {object|Array} data The data table of cookie names and values
 */
const setCookies = async data => {
    const table = data.hashes();
    return await Promise.all(
        table.map(async row => {
            await setCookie(row.name, row.value);
        })
    );
};

/**
 * Function to get cookies based on a data table input
 * @param {object|Array} data The data table of cookie names and values
 */
const getCookies = async data => {
    const table = data.hashes();
    return await Promise.all(
        table.map(async row => {
            await getCookie(row.name, row.value);
        })
    );
};

/**
 * Function to delete cookies based on a data table input
 * @param {object|Array} data The data table of cookie names
 */
const deleteCookies = async data => {
    const table = data.hashes();
    return await Promise.all(
        table.map(async row => {
            await deleteCookie(row.name);
        })
    );
};

module.exports = {
    setCookie,
    setCookies,
    getCookie,
    getCookies,
    deleteCookie,
    deleteCookies,
};
