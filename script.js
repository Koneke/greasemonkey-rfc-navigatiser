// ==UserScript==
// @name         rfc navigatiser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make rfs less awful
// @author       github/koneke
// @match        *.ietf.org/rfc/rfc*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

function CreateAnchors()
{
    var content = GetContent();
    var rexp = /\[Page (\d+)\]/g;
    while (true)
    {
        var match = rexp.exec(content);
        if (!match)
        {
            break;
        }
        var matchEnd = match.index + match[0].length;
        var topLink = '<a href="#top">(top)</a>';
        var replacement = topLink + ' <a name="page' + match[1] + '" href="#">(Page ' + match[1] + ')' + '</a>';
        
        content = content.substr(0, match.index - '(top)'.length) +
            replacement +
            content.substr(matchEnd, content.length - matchEnd);
    }
    SetContent(content);
}

function GetContent(to)
{
    return document.getElementsByTagName("pre")[0].innerHTML;
}

function SetContent(to)
{
    document.getElementsByTagName("pre")[0].innerHTML = to;
}

function HackToC()
{
    var content = '<span>' + GetContent() + '</span>';
    SetContent(content);
    var rexp = /[0-9.]+\s[^.]+\s\.+\s+(\d+)\s*[\r|\n]/g;
    while (true)
    {
        var match = rexp.exec(content);
        if (!match)
        {
            console.log("nah");
            break;
        }
        var pageNum = match[1];
        var subexp = /(\d+)\s*[\r|\n]/;
        var submatch = subexp.exec(match[0]);
        var matchEnd = match.index + submatch.index + submatch[0].length;
        var replacement = '<a href="#page' + pageNum + '" href="#">p' + submatch[0] + '</a>';
        
        content = content.substr(0, match.index + submatch.index) +
            replacement +
            content.substr(matchEnd, content.length - matchEnd);
    }
    SetContent(content);
}

function HackToCTop()
{
    var content = GetContent();
    var rexp = /Table of Contents/g;
    var match = rexp.exec(content);
    if (match)
    {
        console.log("hi!");
        var matchEnd = match.index + match[0].length;
        var replacement = '<a name="top" href="#">' + match[0] + '</a>';
        
        content = content.substr(0, match.index) +
            replacement +
            content.substr(matchEnd, content.length - matchEnd);
        
        SetContent(content);
    }
}

CreateAnchors();
HackToC();
HackToCTop();
