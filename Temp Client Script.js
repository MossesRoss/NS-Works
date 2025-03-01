/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

/*
Name          : Car Crashing Game Client Script
Author        : Mosses - Mosses@cloudiotech.com
Description   : Manages the car crashing/plating game logic, updating player turns, scores, and car availability.
Dependencies  : N/currentRecord, N/record, N/ui/dialog  
Release Date  : 2025-01-09
Last Updated  : 2025-01-16
Version       : 1.0.1
*/

var currentRecord, url, https, dialog;
var realCarData = {};
var carData = {};
var carsOwned = [];
var playersNameArray = [];
var currentPlayingCar = '';
var playerPointer = 0;
var crashCash = 0;
var playerName = playersNameArray[playerPointer];
var playerProfilePhotoUrl = '';
var lastCar = false;

define(['N/currentRecord', 'N/url', 'N/https', 'N/ui/dialog'], main);

function main(currentRecordModule, urlModule, httpsModule, dialogModule) {
    currentRecord = currentRecordModule;
    url = urlModule;
    https = httpsModule;
    dialog = dialogModule;
    return {
        pageInit: pageInit,
        crashingCar: crashingCar,
        platingCar: platingCar,
        driftingCar: driftingCar,
        justRiding: justRiding,
        plateRounding: plateRounding,
        loadNextPlayer: loadNextPlayer,
        addCustomCC: addCustomCC,
        saveRecord: saveRecord,
        removeCustomCC: removeCustomCC
    }
}

function pageInit(context) {
    var curRecord = context.currentRecord;
    var playersDataJSONString = curRecord.getValue('custpage_fld_player_data_json');
    if (!playersDataJSONString) {
        dialog.alert({
            title: 'Access Denied',
            message: 'You are not allowed to open this Suitelet directly. Please contact Mosses for guidance on using this application.'
        }).then(function (result) {
            window.location.href = 'https://tstdrv1887008.app.netsuite.com/app/center/card.nl?sc=-29&whence=';
        });
        return;
    }
    var playersNameArrayString = curRecord.getValue('custpage_fld_players_array');
    playersDataJSON = JSON.parse(playersDataJSONString);
    playersNameArray = playersNameArrayString.split(', ');
    realCarData = playersDataJSON;
    carData = deepCopy(realCarData);
    playerName = playersNameArray[playerPointer];
    carsOwned = carData[playerName].car;
    currentPlayingCar = carsOwned.shift();
    crashCash = carData[playerName].CrashCash;
    playerProfilePhotoUrl = carData[playerName.profilePhotoUrl];

    curRecord.setValue({
        fieldId: 'custpage_fld_player_name',
        value: playerName
    })
    curRecord.setValue({
        fieldId: 'custpage_fld_profile_picture',
        value: '<img src =' + playerProfilePhotoUrl + 'width="150" height="150">'
    });
    curRecord.setValue({
        fieldId: 'custpage_fld_remaining_cars_name',
        value: carsOwned.join(', ')
    });
    curRecord.setValue({
        fieldId: 'custpage_fld_current_playing_car',
        value: currentPlayingCar
    });
    curRecord.setValue({
        fieldId: 'custpage_fld_cars_owned',
        value: carsOwned.join(', ')
    });
    curRecord.setValue({
        fieldId: 'custpage_fld_crash_cash',
        value: crashCash
    });
    if (carsOwned.length === 0) {
        lastCar = true;
    };
}

function platingCar() {
    realCarData[playerName].CrashCash += 5000;
    crashingCar();
}

function crashingCar() {
    var curRecord = currentRecord.get();
    if (lastCar === true || currentPlayingCar === null) {
        playerCarsFinished(curRecord);
    } else {
        currentPlayingCar = carsOwned[0];
        if (carsOwned.length === 0) {
            lastCar = true;
        }
        carsOwned?.shift();

        curRecord.setValue({
            fieldId: 'custpage_fld_crash_cash',
            value: realCarData[playerName].CrashCash
        });
        curRecord.setValue({
            fieldId: 'custpage_fld_remaining_cars_name',
            value: carsOwned.join(', ')
        });
        curRecord.setValue({
            fieldId: 'custpage_fld_current_playing_car',
            value: currentPlayingCar
        });
    }
}

function justRiding() {
    var curRecord = currentRecord.get();
    if (lastCar === true || currentPlayingCar === null) {
        playerCarsFinished(curRecord);
        return;
    }
    realCarData[playerName].CrashCash -= 50;
    curRecord.setValue({
        fieldId: 'custpage_fld_crash_cash',
        value: realCarData[playerName].CrashCash
    });
};

function driftingCar() {
    var curRecord = currentRecord.get();
    if (lastCar === true || currentPlayingCar === null) {
        playerCarsFinished(curRecord);
        return;
    }
    realCarData[playerName].CrashCash += 2500;
    curRecord.setValue({
        fieldId: 'custpage_fld_crash_cash',
        value: realCarData[playerName].CrashCash
    });
}

function plateRounding() {
    var curRecord = currentRecord.get();
    if (lastCar === true || currentPlayingCar === null) {
        playerCarsFinished();
        return;
    }
    realCarData[playerName].CrashCash += userInput('PLATE');
    curRecord.setValue({
        fieldId: 'custpage_fld_crash_cash',
        value: realCarData[playerName].CrashCash
    });
}

function addCustomCC() {
    var curRecord = currentRecord.get();
    realCarData[playerName].CrashCash += userInput('+');
    curRecord.setValue({
        fieldId: 'custpage_fld_crash_cash',
        value: realCarData[playerName].CrashCash
    });
}

function removeCustomCC() {
    var curRecord = currentRecord.get();
    realCarData[playerName].CrashCash -= userInput('-');
    curRecord.setValue({
        fieldId: 'custpage_fld_crash_cash',
        value: realCarData[playerName].CrashCash
    });
}

function deepCopy(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }

    const copy = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key]);
        }
    }
    return copy;
}

function saveToRecord() {
    var suiteletURL = url.resolveScript({
        scriptId: 'customscript_xcd_mv_sl',
        deploymentId: 'customdeploy_xcd_mv_sl'
    });
    jQuery.ajax({
        url: suiteletURL,
        type: 'POST',
        data: {
            crashCash: realCarData[playerName].CrashCash,
            playerId: realCarData[playerName].id
        },
        success: function (response) {
            console.log('CrashCash updated successfully:', response);
        },
        error: function (error) {
            console.error('Error updating CrashCash:', error);
        }
    });
}

function playerCarsFinished(curRecord) {
    dialog.alert({ title: "Cars Finished", message: "Player's cars are finished, Load the next Player" });
    currentPlayingCar = null;
    curRecord.setValue({
        fieldId: 'custpage_fld_current_playing_car',
        value: currentPlayingCar
    });
    lastCar = false;
    return;
}

function loadNextPlayer() {
    saveToRecord();
    var curRecord = currentRecord.get();
    if (playersNameArray.length === playerPointer + 1) {
        playerPointer = -1;
        carData = deepCopy(realCarData);
    }
    playerPointer++;
    playerName = playersNameArray[playerPointer];
    carsOwned = carData[playerName].car;
    currentPlayingCar = carsOwned.shift();
    crashCash = carData[playerName].CrashCash;

    curRecord.setValue({
        fieldId: 'custpage_fld_player_name',
        value: playerName
    });
    curRecord.setValue({
        fieldId: 'custpage_fld_remaining_cars_name',
        value: carsOwned.join(', ')
    });
    curRecord.setValue({
        fieldId: 'custpage_fld_current_playing_car',
        value: currentPlayingCar
    });
    curRecord.setValue({
        fieldId: 'custpage_fld_crash_cash',
        value: crashCash
    });
};

function saveRecord() {
    saveToRecord();
    return true;
}

function userInput(Operation) {
    try {
        const operationTextMap = {
            '+': `that you want to add to ${playerName}`,
            '-': `that you want to remove from ${playerName}`,
            'PLATE': `based on the circle size and the stunt style of ${currentPlayingCar}`
        };
        const textToShow = operationTextMap[Operation] || '';

        let value = Number(window.prompt(`Enter CC ${textToShow}: `));
        if (isNaN(value)) return 'This is not a numerical int';
        if (value <= 49999) return value;

        const testValue = window.prompt(`You entered ${value}, Do you want to proceed? [Type YES]`);
        return testValue === 'YES' ? value : 0;
    } catch (error) {
        dialog.alert(error);
    }
}
