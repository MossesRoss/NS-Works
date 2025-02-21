/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

var record, redirect;
var modules = ["N/record", "N/redirect", "N/log"]; // Added N/log for better logging

define(modules, main);

function main(recordModule, redirectModule, logModule) {
    record = recordModule;
    redirect = redirectModule;
    log = logModule; // Assign log module
    return { afterSubmit: afterSubmit };
}

function afterSubmit(context) {
    try {
        var currentRecord = context.newRecord;
        var playersDataJSON = {};
        var playersNameArray = [];
        var selectedPlayersText = currentRecord.getText({ fieldId: 'custrecord_xcd_selected_players' }); // Get text representation
        var selectedPlayerIds = currentRecord.getValue({ fieldId: 'custrecord_xcd_selected_players' }); // Get IDs

        if (!selectedPlayerIds || selectedPlayerIds.length === 0) { // Handle case with no players selected
            log.audit('No players selected', 'Skipping player data processing.');
            return; // Exit function early if no players selected - optional depending on requirements
        }


        if (Array.isArray(selectedPlayersText)) { // Join text values for parameters (if needed for Suitelet)
            selectedPlayersText = selectedPlayersText.join(', ');
        }
        if (Array.isArray(selectedPlayerIds)) { // Join IDs for parameters (if needed for Suitelet)
            selectedPlayerIds = selectedPlayerIds.join(', ');
        }


        // Efficiently lookup player data using record.lookupFields
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
            var playersCars = playerCarsString ? playerCarsString.split(', ') : []; // Handle null/empty car string
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
                selectedPlayers: selectedPlayersText, // Use text values for display in Suitelet if needed
                playersCode: selectedPlayerIds, // Pass joined IDs, or array, depending on Suitelet needs
                playersDataJSONString: playersDataJSONString,
                playersNameArrayString: playersNameArray.join(', ')
            }
        });

    } catch (error) {
        log.error({
            title: 'UserEventScript Error',
            details: 'Script: customscript_xcd_ue_script, Deployment: customdeploy_xcd_ue_script, Record ID: ' + context.newRecord.id + ', Error: ' + error.message
        });
    }
}
