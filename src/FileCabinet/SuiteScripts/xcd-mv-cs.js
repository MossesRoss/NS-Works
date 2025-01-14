
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

/*
Name          : Client Script for Button Action
Author        : Mosses
Description   : Handles button click to increment a field and submit the form.
Dependencies  : N/currentRecord
Release Date  : 2025-01-09
Version       : 1.0.0
Changing      : 1.0.0 - Initial release
Website       : www.cloudio.com
*/

define(['N/currentRecord'], main);

function main(currentRecord) {
    var currentRecord = currentRecord.get();
    return { pageInit: pageInit }
}

function pageInit(){
}