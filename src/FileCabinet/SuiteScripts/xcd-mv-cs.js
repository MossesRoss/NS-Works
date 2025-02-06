/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

/*
Name          : Car Crashing Game Client Script
Author        : Mosses
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
var currentPlayingCar = '';
var playersNameArray = [];
var playerPointer = 0;
var playerName = playersNameArray[playerPointer];
var crashCash = 0;
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
        loadNextPlayer: loadNextPlayer
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
        return; 1
    }
    var playersNameArrayString = curRecord.getValue('custpage_fld_players_array');
    playersDataJSON = JSON.parse(playersDataJSONString);
    playersNameArray = playersNameArrayString.split(', ');
    realCarData = playersDataJSON;
    carData = deepCopy(realCarData);
    playerName = playersNameArray[playerPointer];

    console.log(playersDataJSONString);

    carsOwned = carData[playerName].car;
    currentPlayingCar = carsOwned.shift();
    crashCash = carData[playerName].CrashCash;

    curRecord.setValue({
        fieldId: 'custpage_fld_player_name',
        value: playerName
    })
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
}

function platingCar() {
    realCarData[playerName].CrashCash += 4499;
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
    }
    realCarData[playerName].CrashCash -= 51;
    curRecord.setValue({
        fieldId: 'custpage_fld_crash_cash',
        value: realCarData[playerName].CrashCash
    });
};

function driftingCar() {
    var curRecord = currentRecord.get();
    if (lastCar === true || currentPlayingCar === null) {
        playerCarsFinished(curRecord);
    }
    realCarData[playerName].CrashCash += 2551;
    curRecord.setValue({
        fieldId: 'custpage_fld_crash_cash',
        value: realCarData[playerName].CrashCash
    });
}

function plateRounding() {
    var curRecord = currentRecord.get();
    if (lastCar === true || currentPlayingCar === null) {
        playerCarsFinished();
    }
    realCarData[playerName].CrashCash += 20551;
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
    };
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
}