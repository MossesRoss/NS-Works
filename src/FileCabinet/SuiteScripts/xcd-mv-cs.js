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

var currentRecord;
var realCarData = {
    'Mosses': ['Mokka Car', 'Nalla Car', 'Kola Car', 'Dappa Car', 'Mass Car'],
    'Puni': ["Tesla Model S", "Ford Mustang", "BMW M3", "Audi R8", "Chevrolet Camaro"],
    'Jeevan': ["Mercedes-AMG GT", "Jaguar F-Type", "Aston Martin Vantage"],
    'Venies': ["Porsche 911", "Nissan GT-R", "Chevrolet Corvette", "Dodge Viper"],
    'Sneha': ["Lamborghini Aventador", "Ferrari 488", "McLaren 720S", "Audi R8", "2Porsche 999"],
    'Yohan': ['Mokka Car', 'Nalla Car', 'Kola Car', 'Dappa Car', 'Mass Car']
};
var carData = {
    'Mosses': ['Mokka Car', 'Nalla Car', 'Kola Car', 'Dappa Car', 'Mass Car'],
    'Puni': ["Tesla Model S", "Ford Mustang", "BMW M3", "Audi R8", "Chevrolet Camaro"],
    'Jeevan': ["Mercedes-AMG GT", "Jaguar F-Type", "Aston Martin Vantage"],
    'Venies': ["Porsche 911", "Nissan GT-R", "Chevrolet Corvette", "Dodge Viper"],
    'Sneha': ["Lamborghini Aventador", "Ferrari 488", "McLaren 720S", "Audi R8", "2Porsche 999"],
    'Yohan': ['Mokka Car', 'Nalla Car', 'Kola Car', 'Dappa Car', 'Mass Car']
};
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
    carsOwned = carData[playerName];

    currentPlayingCar = carsOwned.shift();
    
    crashCash += curRecord.getValue("custpage_fld_crash_cash");

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
        crashCash += 4499;
      
        
        currentPlayingCar = carsOwned?.shift();
        console.log('carsOwned:', carsOwned);
       
        curRecord.setValue({
            fieldId: 'custpage_fld_crash_cash',
            value: crashCash
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
            playerPointer ++;
            playerName = playersNameArray[playerPointer];
            carsOwned = carData[playerName];
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