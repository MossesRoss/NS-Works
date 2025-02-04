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

var currentRecord;
var realCarData = {
    'Mosses': {
        'car': ['Mokka Car', 'Nalla Car', 'Kola Car', 'Dappa Car', 'Mass Car'],
        'CrashCash': 7823 // Example random number
    },
    'Puni': {
        'car': ["Tesla Model S", "Ford Mustang", "BMW M3", "Audi R8", "Chevrolet Camaro"],
        'CrashCash': 12491 // Example random number
    },
    'Jeevan': {
        'car': ["Mercedes-AMG GT", "Jaguar F-Type", "Aston Martin Vantage"],
        'CrashCash': 9547  // Example random number
    },
    'Venies': {
        'car': ["Porsche 911", "Nissan GT-R", "Chevrolet Corvette", "Dodge Viper"],
        'CrashCash': 14219 // Example random number
    },
    'Sneha': {
        'car': ["Lamborghini Aventador", "Ferrari 488", "McLaren 720S", "Audi R8", "2Porsche 999"],
        'CrashCash': 6385  // Example random number
    },
    'Yohan': {
        'car': ['Mokka Car', 'Nalla Car', 'Kola Car', 'Dappa Car', 'Mass Car'],
        'CrashCash': 11032 // Example random number
    }
};
var carData = deepCopy(realCarData);
var carsOwned = [];
var currentPlayingCar = '';
var playersNameArray = ['Mosses', 'Yohan', 'Puni', 'Jeevan', 'Venies', 'Sneha'];
var playerPointer = 0;
var playerName = playersNameArray[playerPointer];
var crashCash = 0;

define(['N/currentRecord'], main);

function main(currentRecordModule) {
    currentRecord = currentRecordModule;
    return {
        pageInit: pageInit,
        // crashingCar: crashingCar,
        platingCar: platingCar
    }
}

function pageInit(context) {
    var curRecord = context.currentRecord;
    carsOwned = carData[playerName].car;

    currentPlayingCar = carsOwned.shift();

    crashCash = carData[playerName].CrashCash;

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
    try {
        if (playersNameArray.length === playerPointer + 1) {
            playerPointer = -1;
            carData = deepCopy(realCarData);
        };
        var curRecord = currentRecord.get();
        realCarData[playerName].CrashCash += 4499;


        currentPlayingCar = carsOwned?.shift();

        curRecord.setValue({
            fieldId: 'custpage_fld_crash_cash',
            value: realCarData[playerName].CrashCash
        });
        curRecord.setValue({
            fieldId: 'custpage_fld_remaining_cars_name',
            value: carsOwned.join(', ')
        });
        curRecord.setValue({
            fieldId: 'custpage_fld_player_name',
            value: playerName
        });

        if (carsOwned.length === 0) {
            playerPointer++;
            playerName = playersNameArray[playerPointer];
            carsOwned = carData[playerName].car;
        }

        curRecord.setValue({
            fieldId: 'custpage_fld_current_playing_car',
            value: currentPlayingCar
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
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