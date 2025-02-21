/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

var record, redirect;
var modules = ["N/record", "N/redirect", "N/log"];

define(modules, main);

function main(recordModule, redirectModule, logModule) {
    record = recordModule;
    redirect = redirectModule;
    log = logModule;
    return { afterSubmit: afterSubmit };
}

function afterSubmit(context) {
    try {
        var currentRecord = context.newRecord;
        var playersDataJSON = {};
        var playersNameArray = [];
        var selectedPlayersText = currentRecord.getText({ fieldId: 'custrecord_xcd_selected_players' });
        var selectedPlayerIds = currentRecord.getValue({ fieldId: 'custrecord_xcd_selected_players' });

        if (!selectedPlayerIds || selectedPlayerIds.length === 0) {
            log.audit('No players selected', 'Skipping player data processing.');
            return;
        }


        if (Array.isArray(selectedPlayersText)) {
            selectedPlayersText = selectedPlayersText.join(', ');
        }
        if (Array.isArray(selectedPlayerIds)) {
            selectedPlayerIds = selectedPlayerIds.join(', ');
        }


        for (var i = 0; i < selectedPlayerIds.length; i++) {
            var playerId = selectedPlayerIds[i];
            var playerLookup = record.lookupFields({
                type: 'customrecord_xcd_player',
                id: playerId,
                fields: ['name', 'custrecord_xcd_cars_owned', 'custrecord_xcd_crash_cash', 'custrecord_xcd_player_profile_url']
            });
            var playerName = playerLookup.name;
            playersNameArray.push(playerName);
            var playerCarsString = playerLookup.custrecord_xcd_cars_owned;
            var playersCars = playerCarsString ? playerCarsString.split(', ') : [];
            var playerCrashCash = playerLookup.custrecord_xcd_crash_cash;
            var playerProfilePhotoUrl = playerLookup.custrecord_xcd_player_profile_url;

            playersDataJSON[playerName] = {
                id: playerId,
                car: playersCars,
                CrashCash: playerCrashCash,
                profilePhotoUrl: playerProfilePhotoUrl
            };
        }

        var playersDataJSONString = JSON.stringify(playersDataJSON);

        redirect.toSuitelet({
            scriptId: 'customscript_xcd_mv_sl',
            deploymentId: 'customdeploy_xcd_mv_sl',
            parameters: {
                selectedPlayers: selectedPlayersText,
                playersCode: selectedPlayerIds,
                playersDataJSONString: playersDataJSONString,
                playersNameArrayString: playersNameArray.join(', ')
            }
        });

    } catch (error) {
        log.error({
            title: 'Fatel Error Bruh',
            details: 'Script: customscript_xcd_ue_script, Deployment: customdeploy_xcd_ue_script, Record ID: ' + context.newRecord.id + ', Error: ' + error.message
        });
    }
}
