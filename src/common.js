'use strict';

/*!
 * This module helps with common functions through happyguest project
 * 0.2
 */


/* 
* common regular expressions
*/
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const urlReGex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;

/*
    *check if istring is an url
*/
function isURL(string) {
    const res = new RegExp(urlReGex);
    return res.test(string);
}

/*
    *return a lowercase and cleaned string
 */
async function getCleanedString(st) {
    try {
        st = st.toLowerCase();
        st = st.replace(/á/gi, "a");
        st = st.replace(/é/gi, "e");
        st = st.replace(/í/gi, "i");
        st = st.replace(/ó/gi, "o");
        st = st.replace(/ú/gi, "u");
        st = st.replace(/ñ/gi, "n");
        return st;
    } catch (err) {
        throw (err);
    }
}

module.exports = {
    isURL,
    uuidRegex,
    urlReGex,
    getCleanedString
}