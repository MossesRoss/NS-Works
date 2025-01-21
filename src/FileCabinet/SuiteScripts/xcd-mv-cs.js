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

modules = ['N/currentRecord', 'N/record', 'N/query']
define(modules, main);

// Variable Declarations
var newremainingPlayers = []
var currentPlayingCars = []

function main(currentRecord, record) {
    var rec = currentRecord.get();
    var playerRec = record.load({
        type: 'customrecord_xcd_player',
        id: 1
    });
    var tourRec = record.load({
        type: 'customrecord_xcd_tournament',
        id: 1
    });

    currentPlayingCars = playerRec.getValue({fieldId: 'custrecord_xcd_cars_owned'})

    return {
        pageInit: pageInit(rec),
        crashingCar: crashingCar
    }
}

function pageInit(rec) {
    var remainingPlayers = rec.getValue({fieldId: 'remainingPlayersFld'});
    var currentPlayer = remainingPlayers[remainingPlayers.length - 1];
    rec.setValue({
        fieldId: 'custpage_fld_player_name',
        value: currentPlayer
    });

    rec.setValue({
        fieldId: 'custpage_fld_remaining_cars_name',
        value: currentPlayingCars
    });
    
}
function crashingCar() {

    alert("You're car is crashed. You are a fool press any key to continue.")
}











// Code that I might need
// var value = rec.getValue({ fieldId: 'custpage_fld_player_name' });
//     var curPlayerCC = rec.getValue({fieldId: 'custpage_fld_crash_cash'})
//     var updatedValue = value + ' Ross'
//     rec.setValue({
//         fieldId: 'custpage_fld_player_name',
//         value: updatedValue
//     });