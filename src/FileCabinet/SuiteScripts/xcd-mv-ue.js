/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

var record, redirect;
var modules = ["N/record", "N/redirect"];

define(modules, main);

function main(recordModule, redirectModule) {
    record = recordModule;
    redirect = redirectModule;
    return { afterSubmit: afterSubmit };
}

function afterSubmit(context) {
    try {
        var currentRecord = context.newRecord;
        var playersDataJSON = {};
        var playersNameArray = [];
        var selectedPlayers = currentRecord.getText({ fieldId: 'custrecord_xcd_selected_players' });
        var playersCode = currentRecord.getValue({ fieldId: 'custrecord_xcd_selected_players' });
        if (Array.isArray(selectedPlayers)) {
            selectedPlayers = selectedPlayers.join(',');
        }
        for (var i = 0; i < playersCode.length; i++) {
            var scopeRecord = record.load({
                type: 'customrecord_xcd_player',
                id: playersCode[i]
            })
            var playerName = scopeRecord.getText('name');
            playersNameArray.push(playerName);
            var playerId = scopeRecord.id;
            var playerCarsString = scopeRecord.getValue('custrecord_xcd_cars_owned');
            var playersCars = playerCarsString.split(', ');
            var playerCrashCash = scopeRecord.getValue('custrecord_xcd_crash_cash')
            playersDataJSON[playerName] = {
                id: playerId,
                car: playersCars,
                CrashCash: playerCrashCash
            };
        };

        var playersDataJSONString = JSON.stringify(playersDataJSON);

        redirect.toSuitelet({
            scriptId: 'customscript_xcd_mv_sl',
            deploymentId: 'customdeploy_xcd_mv_sl',
            parameters: {
                selectedPlayers: selectedPlayers,
                playersCode: playersCode.join(', '),
                playersDataJSONString: playersDataJSONString,
                playersNameArrayString: playersNameArray.join(', ')
            }
        });
    } catch (error) {
        log.error('Record Load Error', error.message);
    }
}